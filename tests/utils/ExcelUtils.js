const ExcelJs = require('exceljs');

class ExcelUtils {

    async writeExcelTest(searchText, replaceText, change, filePath) {

        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet('Sheet1');
        const output = await this.readExcel(worksheet, searchText);

        const cell = worksheet.getCell(output.row, output.column + change.colChange);
        cell.value = replaceText;
        await workbook.xlsx.writeFile(filePath);
    }

    async readExcel(worksheet, searchText) {

        let output = { row: -1, column: -1 };
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                //console.log(cell.value);
                if (cell.value === searchText) {
                    //console.log(rowNumber);
                    //console.log(colNumber);
                    output.row = rowNumber;
                    output.column = colNumber;
                }
            })
        })
        return output;
    }
}

module.exports = {ExcelUtils};