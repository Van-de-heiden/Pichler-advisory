// A tab session survives navigation and reloads, without identifying the visitor.
export const BRAND_REVEAL_SESSION_KEY = "pichler-advisory:intro-seen";

// Run before the body paints so a returning page never flashes the curtains.
// If storage is unavailable, keep the content accessible without an intro.
export const BRAND_REVEAL_BOOTSTRAP = `(() => {
  try {
    if (sessionStorage.getItem(${JSON.stringify(BRAND_REVEAL_SESSION_KEY)}) !== "1") return;
  } catch {}
  document.documentElement.setAttribute("data-brand-reveal", "seen");
})();`;
