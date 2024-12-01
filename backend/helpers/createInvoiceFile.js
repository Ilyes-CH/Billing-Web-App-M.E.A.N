const fs = require('fs');
const path = require('path')
const pdfGenerator = require('./pdfGenerator')
const { sendEmailWithAttachment } = require('./mailer')

const currentDate = new Date(Date.now())

const createInvoiceFile = async (orderInfo) => {
    const data = {
        companyLogo: "https://your-company-logo-url.com/logo.png", // Replace with the actual URL or base64 string of your logo
        companyName: "BootcampCorp",
        companyAddress: "123 Company St, City, Country",
        companyEmail: "bootcamp_org@dev.com",
        companyPhone: "+21656126611",
    
        invoiceId: `${Date.now()}`,
        invoiceDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
    
        clientFirstName: orderInfo.firstName,
        clientLastName: orderInfo.lastName,
        clientEmail: orderInfo.email,
        
        //Populate the services
        items: orderInfo.items.map(service => ({
            name: service.name,
            priceHT: service.priceHT,
            quantity: service.quantity, 
            taxAmount: service.taxAmount,
            priceAfterTax: service.priceAfterTax,
            totalAfterTax: service.totalAfterTax
        })),
    
        subtotal: orderInfo.subtotal,
        taxRate: orderInfo.taxRate,
        taxAmount: orderInfo.taxAmount,
        totalAmount: orderInfo.total
    }
    try{
        console.log("Data: ",data)
        const pdfBuffer = await pdfGenerator(data, 'invoice.hbs');

        if (pdfBuffer) {
            const dirPath = path.join(__dirname, '../uploads/pdfs');
            const fileName = `Invoice-${data.invoiceId}.pdf`;
            const filePath = path.join(dirPath, fileName);

            // Check if the directory exists, and create it if it doesn't
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            // Write the PDF file to the specified path
            fs.writeFileSync(filePath, pdfBuffer);

            // Send the invoice via email after saving the file
            sendEmailWithAttachment(orderInfo.firstName, orderInfo.email, 'Order Invoice', "invoiceMail", fileName, filePath);
            
            return [true, filePath];
        }
    } catch (error) {
        console.error(error);
        return [false, ""];
    }
};

module.exports = createInvoiceFile;