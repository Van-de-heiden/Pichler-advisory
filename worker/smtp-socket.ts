import { connect, type TLSSocket } from 'node:tls';

type SocketCallback = (error: Error | null, result?: { connection: TLSSocket; secured: true }) => void;

/**
 * Open TLS directly against the DNS hostname, like the working IMAP client.
 * Nodemailer's own resolver replaces the hostname with an IP before opening TLS.
 * Giving it an already-secured socket avoids that extra DNS/IP connection path
 * and preserves the original TLS error instead of wrapping it as ESOCKET.
 */
export function smtpSocket(_options: unknown, callback: SocketCallback, connector: typeof connect = connect) {
  let socket: TLSSocket | undefined;
  let settled = false;
  const timeout = setTimeout(() => fail(Object.assign(new Error('SMTP TLS connection timed out'), { code: 'ETIMEDOUT' })), 10000);
  const closed = () => fail(Object.assign(new Error('SMTP TLS connection closed'), { code: 'ECONNRESET' }));
  function fail(error: Error) {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    socket?.removeListener('secureConnect', ready);
    socket?.removeListener('close', closed);
    // Keep the error handler during teardown; it absorbs later errors without a second callback.
    socket?.destroy();
    callback(error);
  }
  function ready() {
    if (settled || !socket) return;
    if (!socket.authorized) {
      fail(Object.assign(new Error('SMTP TLS certificate was not verified'), { code: 'ETLS' }));
      return;
    }
    settled = true;
    clearTimeout(timeout);
    socket.removeListener('close', closed);
    // The callback installs Nodemailer's handlers synchronously before we release ownership.
    callback(null, { connection: socket, secured: true });
    socket.removeListener('error', fail);
  }
  try {
    socket = connector({ host: 'mail.infomaniak.com', port: 465, servername: 'mail.infomaniak.com', rejectUnauthorized: true });
    socket.once('secureConnect', ready);
    socket.on('error', fail);
    socket.once('close', closed);
  } catch (error) {
    fail(error instanceof Error ? error : new Error('SMTP TLS connection failed'));
  }
}
