const { test, expect } = require('@playwright/test'); 


test("Calendar validations",async ({ page }) =>{
    
    const monthNumber = "6";
    const date = "15";
    const year = "2027";
    const expectList = [monthNumber,date,year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
    await page.locator("//abbr[text()='"+ date +"']").click();

    //Pegando elemento com $$ pois quando indica o locator ele não encontra
    //const inputs = await page.$$(".react-date-picker__inputGroup input");
    
    const inputs = await page.locator("input.react-date-picker__inputGroup__input").all();
    
    for (let index = 0; index < inputs.length; index++) {
        const elementHandle = inputs[index];
        
        // Use evaluate to execute JavaScript code in the context of the browser page
        const value1 = await elementHandle.getAttribute('value');

        // Display the value in the console
        console.log("value1: ", value1);
        console.log("expectedList: ", expectList[index]);

        expect(value1).toEqual(expectList[index]);
    }
})