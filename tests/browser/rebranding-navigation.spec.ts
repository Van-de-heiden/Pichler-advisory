import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:4181' });
const holding = /Neuer Auftritt\.\s*Gleicher Anspruch\./;

for (const path of ['/impressum', '/datenschutz', '/agb']) {
  for (const link of ['header', 'footer']) {
    test(`${path} ${link} home link reaches holding through real navigation`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(path);
      await page.waitForFunction(() => typeof (window as Window & { __VINEXT_RSC_NAVIGATE__?: unknown }).__VINEXT_RSC_NAVIGATE__ === 'function');
      const home = page.locator(`${link} a.wordmark`).first();
      await home.hover();
      await home.click();
      await expect(page).toHaveURL('http://localhost:4181/');
      await expect(page.locator('h1')).toHaveText(holding);
      await expect(page.locator('.enquiry-form')).toHaveCount(0);
      await page.goBack();
      await expect(page).toHaveURL(`http://localhost:4181${path}`);
      await page.goForward();
      await expect(page.locator('h1')).toHaveText(holding);
      expect(errors).toEqual([]);
    });
  }
}

test('programmatic client navigation uses clean holding fallback rather than old Flight page', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/impressum');
  await page.waitForFunction(() => typeof (window as Window & { __VINEXT_RSC_NAVIGATE__?: unknown }).__VINEXT_RSC_NAVIGATE__ === 'function');
  await page.evaluate(() => {
    const navigate = (window as Window & { __VINEXT_RSC_NAVIGATE__?: (href: string) => Promise<void> }).__VINEXT_RSC_NAVIGATE__;
    void navigate?.('/?campaign=browser-test');
  });
  await expect(page.locator('h1')).toHaveText(holding);
  await expect(page).toHaveURL('http://localhost:4181/?campaign=browser-test');
  expect(requests.some(url => new URL(url).pathname === '/.rsc')).toBeTruthy();
});

test('legal client navigation stays usable while marketing and home anchors leave the app', async ({ page }) => {
  await page.goto('/impressum');
  await page.waitForFunction(() => typeof (window as Window & { __VINEXT_RSC_NAVIGATE__?: unknown }).__VINEXT_RSC_NAVIGATE__ === 'function');
  await page.locator('footer').getByRole('link', { name: 'AGB', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:4181/agb');
  await expect(page.locator('h1')).toContainText('Allgemeine Geschäftsbedingungen');
  await page.getByRole('link', { name: 'Über Pichler', exact: true }).click();
  await expect(page.locator('h1')).toHaveText(holding);
  await page.goBack();
  await expect(page).toHaveURL('http://localhost:4181/agb');
  await page.getByRole('link', { name: 'Erstgespräch', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:4181/#anfrage');
  await expect(page.locator('h1')).toHaveText(holding);
});

test('disabled mode keeps the original client-side homepage navigation', async ({ page }) => {
  await page.goto('http://localhost:4180/impressum');
  await page.waitForFunction(() => typeof (window as Window & { __VINEXT_RSC_NAVIGATE__?: unknown }).__VINEXT_RSC_NAVIGATE__ === 'function');
  await expect(page.locator('#pa-rebranding-navigation')).toHaveCount(0);
  await page.evaluate(() => { (window as Window & { documentMarker?: string }).documentMarker = 'original-document'; });
  await page.getByRole('link', { name: 'Pichler Advisory – Startseite', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Was jeden Tag Zeit kostet');
  expect(await page.evaluate(() => (window as Window & { documentMarker?: string }).documentMarker)).toBe('original-document');
});

test('same-document history cannot restore a protected marketing route', async ({ page }) => {
  const documents: string[] = [];
  page.on('request', request => { if (request.isNavigationRequest()) documents.push(request.url()); });
  await page.goto('/impressum');
  await page.waitForFunction(() => typeof (window as Window & { __VINEXT_RSC_NAVIGATE__?: unknown }).__VINEXT_RSC_NAVIGATE__ === 'function');
  await page.evaluate(() => {
    history.pushState({}, '', '/?history=protected');
    history.pushState({}, '', '/impressum?history=legal');
  });
  await page.goBack();
  await expect(page).toHaveURL('http://localhost:4181/?history=protected');
  await expect(page.locator('h1')).toHaveText(holding);
  expect(documents.some(url => new URL(url).searchParams.get('history') === 'protected')).toBeTruthy();
});
