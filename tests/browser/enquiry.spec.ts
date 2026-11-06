import {test,expect} from '@playwright/test';
for(const width of [1440,390])test(`website form and navigation at ${width}px`,async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:950});
 await page.goto('/');await expect(page.locator('h1')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await page.locator('#anfrage').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'Nachricht senden',exact:true}).click();
 const form=page.locator('.enquiry-form');await form.getByLabel('Ihr Name').fill('UI Test');await form.getByLabel('E-Mail').fill('ui@example.test');await form.locator('[name="message"]').fill('Ich möchte einen wiederkehrenden Prozess vereinfachen.');await form.locator('[name="privacy"]').check();
 const calls:Record<string,unknown>[]=[];await page.route('**/api/enquiries',async route=>{const payload=route.request().postDataJSON();calls.push(payload);await route.fulfill({status:calls.length===1?502:200,contentType:'application/json',body:JSON.stringify(calls.length===1?{error:'Test: Verbindung unterbrochen'}:{ok:true,reference:payload.requestId})});});
 await page.screenshot({path:info.outputPath('form-'+width+'.png'),fullPage:false});
 await form.getByRole('button',{name:/Nachricht/}).click();await expect(page.getByRole('alert')).toContainText('Test: Verbindung unterbrochen');await expect(form.getByLabel('Ihr Name')).toHaveValue('UI Test');
 await form.getByRole('button',{name:/Nachricht/}).click();await expect(page.getByRole('status')).toContainText('Ihre Nachricht ist erfasst.');expect(calls).toHaveLength(2);expect(calls[0].requestId).toBe(calls[1].requestId);expect(JSON.parse(await page.evaluate(()=>sessionStorage.getItem('pa-enquiry-reference')||'{}')).fingerprint).toMatch(/^[a-f0-9]{64}$/);
 await page.screenshot({path:info.outputPath('confirmation-'+width+'.png'),fullPage:false});
 for(const path of ['/?leistung=websites#leistungen','/?leistung=betrieb-betreuung#leistungen','/ueber-mich','/impressum']){await page.goto(path);await expect(page.locator('h1')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),path).toBeTruthy();}
 expect(errors).toEqual([]);
});
test('meeting request keeps manual confirmation and validates missing time choices',async({page})=>{
 await page.goto('/#anfrage');const form=page.locator('.enquiry-form');await form.getByLabel('Ihr Name').fill('Termin Test');await form.getByLabel('E-Mail').fill('termin@example.test');await form.locator('[name="privacy"]').check();
 await form.getByRole('button',{name:'Kostenloses Erstgespräch anfragen',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Datum und eine Uhrzeit');await expect(page.getByRole('status')).toHaveCount(0);
});

test('service navigation sets the enquiry topic without losing typed contact details',async({page})=>{
 await page.goto('/');
 const form=page.locator('.enquiry-form');
 await form.getByLabel('Ihr Name').fill('Migration Test');
 await page.getByRole('tab',{name:'Apps & IT-Projekte'}).click();
 await page.getByRole('button',{name:'IT-Projekt besprechen',exact:true}).click();
 await expect(form.locator('[name="topic"]')).toHaveValue('Apps & IT-Projekte');
 await expect(form.getByLabel('Ihr Name')).toHaveValue('Migration Test');
 await form.locator('[name="topic"]').selectOption('Ein anderes Vorhaben');
 await page.getByRole('button',{name:'IT-Projekt besprechen',exact:true}).click();
 await expect(form.locator('[name="topic"]')).toHaveValue('Apps & IT-Projekte');
 await expect(form.getByLabel('Ihr Name')).toHaveValue('Migration Test');
});

test('existing confirmation links stay inert until explicit approval',async({page})=>{
 const calls:string[]=[];
 await page.route('**/api/bookings/**',async route=>{calls.push(route.request().url());await route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({error:'Der Bestätigungslink ist ungültig oder abgelaufen.'})});});
 await page.goto('/termine/bestaetigen');
 await expect(page.getByRole('alert')).toBeVisible();expect(calls).toHaveLength(0);
 await page.goto('/');
 await page.goto('/termine/bestaetigen#id=12345678-1234-4123-8123-123456789abc&token='+ 'a'.repeat(64));
 await expect(page.getByRole('alert')).toContainText('ungültig');
 expect(calls).toHaveLength(1);expect(calls[0]).toContain('/details');
 expect(calls.some(url=>url.endsWith('/confirm'))).toBe(false);
});
