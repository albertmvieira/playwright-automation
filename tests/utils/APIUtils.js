class APIUtils {

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {

        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayLoad
            })
        const loginResponseJson = (await loginResponse.json());
        //console.log(loginResponseJson)
        const token = loginResponseJson.token;
        console.log(token);
        return token;
    }

    async createOrder(orderPayload) {

        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: {
                    'Authorization': response.token,
                    'Content-Type': 'application/json'
                },
            })
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;
        return response;
    }
}
module.exports = {APIUtils};