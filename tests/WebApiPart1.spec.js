const { test, expect, request } = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

//Test Data
const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45" }] };

//Variables
let response;


test.beforeAll(async () => {

    //intanciando objeto para chamar metodos de login e createorder
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext,loginPayLoad);
    response =  await apiUtils.createOrder(orderPayLoad);
});

test('@API Place the order', async ({ page }) => {
        
    //inserindo token no local storage
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");

    
    //validando minhas compras e comparando com id gerado
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
})

//Verify if order created is showing in history page
// Precondition - create order -