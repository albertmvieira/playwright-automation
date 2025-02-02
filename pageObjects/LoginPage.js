const { test, expect } = require('@playwright/test');

class LoginPage{
    
    constructor(page){
        this.page = page;
        this.signInButton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo(){
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async validLogin(username, password){
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle'); // discourage use it, because some pages could load just after 500 ms
    }
}

module.exports = {LoginPage};