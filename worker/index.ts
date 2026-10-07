/** Cloudflare Worker entry point for Pichler Advisory. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

import { handleEnquiry, type EnquiryEnv } from "./enquiries";

interface Env extends EnquiryEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const PUBLIC_URLS = [
  "https://pichler-advisory.ch/",
  "https://pichler-advisory.ch/leistungen/prozesse-automatisierung",
  "https://pichler-advisory.ch/leistungen/apps-it-projekte",
  "https://pichler-advisory.ch/leistungen/websites",
  "https://pichler-advisory.ch/leistungen/betrieb-betreuung",
  "https://pichler-advisory.ch/branchen/handwerk-bau",
  "https://pichler-advisory.ch/branchen/handel-logistik",
  "https://pichler-advisory.ch/branchen/dienstleistungen",
  "https://pichler-advisory.ch/branchen/immobilien-bewirtschaftung",
  "https://pichler-advisory.ch/branchen/produktion-gewerbe",
  "https://pichler-advisory.ch/branchen/weitere-betriebe",
  "https://pichler-advisory.ch/ueber-mich",
  "https://pichler-advisory.ch/agb",
  "https://pichler-advisory.ch/impressum",
  "https://pichler-advisory.ch/datenschutz",
] as const;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_URLS.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join("\n")}
</urlset>
`;

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/enquiries") return handleEnquiry(request, env);

    if (
      url.pathname === "/robots.txt" &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return new Response(request.method === "HEAD" ? null : "User-agent: *\nAllow: /\nSitemap: https://pichler-advisory.ch/sitemap.xml\n", {
        headers: {
          "cache-control": "public, max-age=3600",
          "content-type": "text/plain; charset=utf-8",
          "x-content-type-options": "nosniff",
        },
      });
    }

    if (
      url.pathname === "/sitemap.xml" &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return new Response(request.method === "HEAD" ? null : SITEMAP_XML, {
        headers: {
          "cache-control": "public, max-age=3600",
          "content-type": "application/xml; charset=utf-8",
          "x-content-type-options": "nosniff",
        },
      });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
