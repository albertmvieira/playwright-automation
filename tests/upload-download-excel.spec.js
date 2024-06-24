const { test, expect } = require('@playwright/test');
const {ExcelUtils} = require('./utils/ExcelUtils');
const ExcelJs =require('exceljs');


let excelUtils = new ExcelUtils();

test('Upload download excel validation',async ({page}) => {

    const textSearch = 'Apple';
    const updateValue = '350';

    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', {name:'Download'}).click();
    const download = await downloadPromise;
    await download.saveAs('../download.xlsx');
    
    excelUtils.writeExcelTest(textSearch, updateValue , {rowChange:0, colChange:2}, "../download.xlsx");
    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles("../download.xlsx")
    const textlocator = page.getByText(textSearch);
    const desiredRow = await page.getByRole('row').filter({has :textlocator });
    await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);

});