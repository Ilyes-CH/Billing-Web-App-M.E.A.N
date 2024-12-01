const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

async function generatePDF(data,fileName) {
  const templatePath = path.join(__dirname, '../views', fileName);
  // Read the template file with 'utf8' encoding
  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateHtml);
  const html = template(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdfBuffer;
}

module.exports = generatePDF;

// generatePDF(data,"/views/invoice.hbs")
//   .then((pdfBuffer) => {
//     fs.writeFileSync("output.pdf", pdfBuffer)

//     mailer("Ilyes Chaabane","ilyes.leo.ch@gmail.com", 'Order Invoice',"invoiceMail","invoice.pdf","output.pdf");
//   })
//   .catch((error) => console.error(error));

