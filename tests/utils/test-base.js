const base = require('@playwright/test');

//criando data extendendo o comportamento da annotation test do playwright

exports.customtest = base.test.extend({
    testDataForOrder: {
        username: "anshika@gmail.com",
        password: "Iamking@000",
        productName: "ZARA COAT 3"
    }
})