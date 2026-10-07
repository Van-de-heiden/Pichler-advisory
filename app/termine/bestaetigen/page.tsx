import type { Metadata } from 'next';
import { BookingConfirmation } from './confirmation';
export const metadata: Metadata = { title: 'Termin bestätigen – Pichler Advisory', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default function ConfirmBookingPage() { return <BookingConfirmation />; }
