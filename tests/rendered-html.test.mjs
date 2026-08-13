import assert from "node:assert/strict";
import test from "node:test";

test("renders the production access gate and public legal pages", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const accessHtml = await response.text();
  assert.match(accessHtml, /Geschützter Zugang/i);
  assert.doesNotMatch(accessHtml, /codex-preview|prototype|prototyp/i);

  const legalResponse = await worker.fetch(
    new Request("http://localhost/impressum", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(legalResponse.status, 200);
  assert.match(await legalResponse.text(), /Häberlibodenstrasse 17/i);
});
