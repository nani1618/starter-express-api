const express = require('express')
const app = express()
app.all('/', (req, res) => {
    const browser = await puppeteer.launch({
        headless:'new',// Run in non-headless mode for visibility
       defaultViewport: null,
       //slowMo:50,
       
        // Use the default viewport size
        // Slow down the automation actions by 50ms
     });
     
     let consumableTableData = 'There are no consumables for this task';
     let referenceTableData = ''
     const page = await browser.newPage();
     const jobCardNumber = prompt("Enter Task Number: ")
     const customization = prompt("Enter Customization: ")
     console.log(' ')
     console.log("Started Fetching the Tools and Consumables...")
     await page.goto('https://w3.airbus.com/H380/external/forms/airbus.sfcc?TYPE=33554433&REALMOID=06-11805940-832c-486b-b7ef-b85f20c92807&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-t%2fTX88CtTFIPqQ15ugBfOME66PQGCWGuAAOSByMZUiVIJPozo431pS4LE4YuSGzU&TARGET=-SM-https%3a%2f%2fw3%2eairbus%2ecom%2f1T40%2fsearch%2ftext')

     await page.type('#Login > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(2) > td > input[type=text]','Planning');
     await page.type('#Login > table > tbody > tr:nth-child(2) > td:nth-child(3) > table > tbody > tr:nth-child(2) > td > input[type=password]','Airbus@2023@');
     await page.click('#enter_li > a');
     await page.waitForSelector('#searchContent > div > adns-searchbar > div > form > input');
     await page.type('#searchContent > div > adns-searchbar > div > form > input',jobCardNumber);
     await page.click('#select_6');
     await page.waitForSelector('#customizationInput')
     await page.type('#customizationInput',customization);
     await page.waitForSelector('#select_container_7 > md-select-menu > md-content > div.ng-scope > div')
     await new Promise(resolve => setTimeout(resolve, 1000));
     await page.click('#select_container_7 > md-select-menu > md-content > div.ng-scope > div');
     await page.waitForSelector('#leftContainer > div > div:nth-child(1) > adns-data-module')
     await page.click('#leftContainer > div > div:nth-child(1) > adns-data-module')
     await new Promise(resolve => setTimeout(resolve, 4000));
     await page.waitForSelector('div.table-struct.h1 > div.row-struct.h1 > div.cell-struct.numerotation.h1 > div > div')
     
     await page.click('div.table-struct.h1 > div.row-struct.h1 > div.cell-struct.numerotation.h1 > div > div')
     
     const tableData = await tableParser(page, {
        selector: 'div.cell-struct.content.default > div > div:nth-child(1) > div > div:nth-child(2) > div.cell-struct.content.default > div > table',
        allowedColNames: {
          'REFERENCE': 'REFERENCE',
          'QTY': 'QTY',
          'DESIGNATION': 'DESIGNATION',
        },
      });
      let spanVal3='';
      const spanVal =  await page.$eval('div.cell-struct.content.default > div > div:nth-child(1) > div > div.row-struct.h2 > div.cell-struct.label.alignTop.default.h2', el => el.innerText);
      
      const spanVal2 =  await page.$eval('div.cell-struct.content.default > div > div:nth-child(2) > div > div.row-struct.h2 > div.cell-struct.label.alignTop.default.h2', el => el.innerText);
     try{
      spanVal3 =  await page.$eval('div.cell-struct.content.default > div > div:nth-child(3) > div > div.row-struct.h2 > div.cell-struct.label.alignTop.default.h2', el => el.innerText);
     }catch{

     }
      console.log(' ')
      console.log(spanVal)
      console.log(' ')
      console.log(tableData.replaceAll(';',','));
      console.log('____________________________________')

    if(spanVal2 == 'Work Zones and Access Panels'){
        referenceTableData = await tableParser(page, {
            selector: 'div.cell-struct.content.default > div > div:nth-child(3) > div > div:nth-child(2) > div.cell-struct.content.default > div > table',
            allowedColNames: {
              'REFERENCE': 'REFERENCE',
              'DESIGNATION': 'DESIGNATION',
            },
          });
          console.log(consumableTableData);
          console.log(' ')
          console.log(spanVal3)
          console.log(' ')
          console.log(referenceTableData.replaceAll(';',','))
    }
    else if(spanVal2=='Consumable Materials'){
      const spanVal4 =  await page.$eval('div.cell-struct.content.default > div > div:nth-child(3) > div > div.row-struct.h2 > div.cell-struct.label.alignTop.default.h2', el => el.innerText);
      if(spanVal4=='Referenced Information')  {
      referenceTableData = await tableParser(page, {
            selector: 'div.cell-struct.content.default > div > div:nth-child(4) > div > div:nth-child(2) > div.cell-struct.content.default > div > table',
            allowedColNames: {
              'REFERENCE': 'REFERENCE',
              'DESIGNATION': 'DESIGNATION',
            },
          });
        }
        else{
          referenceTableData = await tableParser(page, {
            selector: 'div.cell-struct.content.default > div > div:nth-child(5) > div > div:nth-child(2) > div.cell-struct.content.default > div > table',
            allowedColNames: {
              'REFERENCE': 'REFERENCE',
              'DESIGNATION': 'DESIGNATION',
            },
          });
        }
          consumableTableData = await tableParser(page, {
            selector: 'div.cell-struct.content.default > div > div:nth-child(2) > div > div:nth-child(2) > div.cell-struct.content.default > div > table',
            allowedColNames: {
              'REFERENCE': 'REFERENCE',
              'DESIGNATION': 'DESIGNATION',
            },
          });
          console.log(spanVal2)
          console.log(' ')
          console.log(consumableTableData.replaceAll(';',','));
          console.log('___________________________________')
          console.log('Reference Information')
          console.log(' ')
          console.log(referenceTableData.replaceAll(';',','))
    }
     else if(spanVal2=='Referenced Information'){

      referenceTableData = await tableParser(page, {
        selector: 'div.cell-struct.content.default > div > div:nth-child(2) > div > div:nth-child(2) > div.cell-struct.content.default > div > table',
        allowedColNames: {
          'REFERENCE': 'REFERENCE',
          'DESIGNATION': 'DESIGNATION',
        },
      });
      console.log('Referenced Information')
     console.log('')
     console.log(referenceTableData.replaceAll(';',','))
     }
     
    
    
    
    await browser.close()
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)
