import assert from "node:assert/strict";
import test from "node:test";

test("renders the public production homepage and legal pages", async () => {
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
  const homeHtml = await response.text();
  assert.match(homeHtml, /Weniger Arbeit drumherum/i);
  assert.match(homeHtml, /Erstgespräch anfragen/i);
  assert.doesNotMatch(homeHtml, /Geschützter Zugang|Zugangscode/i);
  assert.doesNotMatch(homeHtml, /codex-preview|prototype|prototyp/i);

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
