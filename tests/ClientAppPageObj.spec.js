const { test, expect} = require('@playwright/test');
const {customtest} = require('./utils/test-base');
const {POManager} = require('../pageObjects/POManager');


//Convertendo Json para String e depois para JavaScript Objetc
//Usando fixtures data
const dataset = JSON.parse(JSON.stringify(require("../fixture/placeOrderTestData")));

//Executando vários testes através do tamamnho do array de dataset
for (const data of dataset) {
   
test(`@Web Client App login for ${data.productName}`, async ({ page }) => {
      
   //instânciando Page Objects
   const poManager = new POManager(page);
   
   //Armazenando as páginas
   const loginPage = poManager.getLoginPage();
   const dashboardPage = poManager.getDashboardPage();
   const cartPage = poManager.getCartPage();
   const ordersReviewPage = poManager.getOrdersReviewPage();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   
   //validando informações e preenchendo formulário final de compra
   await loginPage.goTo();
   await loginPage.validLogin(data.username,data.password);
   await dashboardPage.searchProductAddCart(data.productName);
   await dashboardPage.navigateToCart();
   await cartPage.VerifyProductIsDisplayed(data.productName);
   await cartPage.Checkout();

   await ordersReviewPage.searchCountryAndSelect("ind","India");
   
   //validando compra e id do pedido
   await ordersReviewPage.VerifyEmailId(data.username);
   const orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);

   //validando minhas compras e comparando com id gerado
   await dashboardPage.navigateToOrders();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
})
}

//tests usando anotação customizada criada no test-base

customtest(`Client App login`, async ({ page, testDataForOrder }) => {
      
   //instânciando Page Objects
   const poManager = new POManager(page);
   
   //Armazenando as páginas
   const loginPage = poManager.getLoginPage();
   const dashboardPage = poManager.getDashboardPage();
   const cartPage = poManager.getCartPage();
   const ordersReviewPage = poManager.getOrdersReviewPage();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   
   //validando informações e preenchendo formulário final de compra
   await loginPage.goTo();
   await loginPage.validLogin(testDataForOrder.username,testDataForOrder.password);
   await dashboardPage.searchProductAddCart(testDataForOrder.productName);
   await dashboardPage.navigateToCart();
   await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
   await cartPage.Checkout();

})