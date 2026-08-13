import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig(async () => {
  // Avoid Wrangler debug-log writes during deterministic CI builds.
  process.env.WRANGLER_WRITE_LOGS ??= "false";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
      }),
    ],
  };
});
