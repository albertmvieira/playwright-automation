const { test, expect, request } = require('@playwright/test');

test('Browser Context PlayWright Teste', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    //elements
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");

    //css 
    await userName.fill("rahulshetty");
    await page.locator("[type='password']").fill("learning");
    await signIn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    //type - fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents(); //this command not wait the page to be loaded (can return 0 elements in array, to use other validantion before to wait the page to be loaded)
    console.log(allTitles);

})

test('Browser Context-Validanting abort network', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    //abort Network request to css
    //page.route('**/*.css', route => route.abort());
    page.route('**/*.{jpg,png,jpeg}', route => route.abort());

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    //elements
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");

    //on - listener
    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(), response.status()));

    //css 
    await userName.fill("rahulshetty");
    await page.locator("[type='password']").fill("learning");
    await signIn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    //type - fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents(); //this command not wait the page to be loaded (can return 0 elements in array, to use other validantion before to wait the page to be loaded)
    console.log(allTitles);

})

test('Page PlayWright Teste', async ({ page }) => {

    //PlayWright instance default browser automatically
    await page.goto("https://google.com");

    //get title assertion
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
})

test('@Web UI Controls', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");
    await page.locator(".radiotextsty").last().click();
    
    //await page.pause();
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

test('@Child windows handle - Promisse all', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage, newPage2] = await Promise.all([

        context.waitForEvent('page'),
        documentLink.click(),
    ])
    //Caso abra outra pagina, poderia ser validada a segunda através de newPage2

    const text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@")
    const domain = arrayText[1].split(" ")[0]
    console.log(domain);
    await userName.fill(domain);
    //await newPage.pause();
    console.log(await userName.textContent());
});

test('@Child windows handle - one page', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const pagePromise = context.waitForEvent('page');
    await documentLink.click();
    const newPage = await pagePromise;

    await newPage.waitForLoadState('networkidle');

    const text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@")
    const domain = arrayText[1].split(" ")[0]
    console.log(domain);
    await userName.fill(domain);
    //await page.pause();
    console.log(await userName.textContent());
});