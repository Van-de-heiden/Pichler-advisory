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
  assert.match(homeHtml, /pichler-advisory-os\.maurus-pichler\.chatgpt\.site/i);
  assert.match(homeHtml, /Interner Bereich/i);
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

test("publishes a canonical sitemap for every public page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("sitemap-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/sitemap.xml"),
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
  assert.equal(
    response.headers.get("content-type"),
    "application/xml; charset=utf-8",
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("cache-control"), "public, max-age=3600");

  const sitemap = await response.text();
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(
    sitemap,
    /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/,
  );

  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, location]) => location,
  );

  assert.deepEqual(locations, [
    "https://pichler-advisory.ch/",
    "https://pichler-advisory.ch/impressum",
    "https://pichler-advisory.ch/datenschutz",
  ]);
});
