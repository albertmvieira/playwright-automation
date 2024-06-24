const { test, expect, request } = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');
const payLoadWithoutOrder = require('../test-data/get_order_withoutOrder.json');

//Test Data
const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45" }] };
const fakePayLoadOrders = { data: [], message: "No Orders" };

//Variables
let response;


test.beforeAll(async () => {

    //intanciando objeto para chamar metodos de login e createorder
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext,loginPayLoad);
    response =  await apiUtils.createOrder(orderPayLoad);
});

test('@SP Place the order', async ({ page }) => {

    //elements
    const noOrderMsg = page.locator(".mt-4");
        
    //inserindo token no local storage
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async route => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill(
        {
          response,
          body,

        });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });

    //validando msg de sem ordens em minhas compras
    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

    console.log(await noOrderMsg.textContent());
    await expect(noOrderMsg).toHaveText('You have No Orders to show at this time. Please Visit Back Us')
})


test('@SP Place the order without', async ({ page }) => {

  //elements
  const noOrderMsg = page.locator(".mt-4");
      
  //inserindo token no local storage
  await page.addInitScript(value => {
      window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");

  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
  async route => {
    const response = await page.request.fetch(route.request());
    route.fulfill(
      {
        response,
        body: JSON.stringify(payLoadWithoutOrder),
      });
    //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
  });

  //validando msg de sem ordens em minhas compras
  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

  console.log(await noOrderMsg.textContent());
  await expect(noOrderMsg).toHaveText('You have No Orders to show at this time. Please Visit Back Us')
})