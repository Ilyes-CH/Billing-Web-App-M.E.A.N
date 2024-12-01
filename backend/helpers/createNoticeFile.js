const fs = require('fs');
const path = require('path')
const pdfGenerator = require('./pdfGenerator')
const { sendEmailWithAttachment } = require('./mailer')

const currentDate = new Date(Date.now())

const createNoticeFile = async (noticeInfo) => {
    const data = {
        companyLogo: "https://your-company-logo-url.com/logo.png",
        companyName: "BootcampCorp",
        companyAddress: "123 Company St, City, Country",
        companyEmail: "bootcamp_org@dev.com",
        companyPhone: "+21656126611",

        NoticeId: `${Date.now()}`,
        NoticeDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,

        clientFirstName: noticeInfo.firstName,
        clientLastName: noticeInfo.lastName,
        clientEmail: noticeInfo.email,

        items: noticeInfo.items.map(service => ({
            name: service.name,
            priceHT: service.priceHT,
            quantity: service.quantity, 
            taxAmount: service.taxAmount,
            priceAfterTax: service.priceAfterTax,
            totalAfterTax: service.quantifiedPrice
        })),

        subTotal: noticeInfo.subTotal,
        taxRate: noticeInfo.taxRate,
        totalTaxAmount: noticeInfo.taxAmount,
        totalWithTax: noticeInfo.total
    };

    console.log("creation of data", data);
    try {
        const pdfBuffer = await pdfGenerator(data, 'notice.hbs');
        if (pdfBuffer) {
            const dirPath = path.join(__dirname, '../uploads/pdfs');
            const fileName = `Notice-${data.NoticeId}.pdf`;
            const filePath = path.join(dirPath, fileName);

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            fs.writeFileSync(filePath, pdfBuffer);
            sendEmailWithAttachment(noticeInfo.firstName, noticeInfo.email, 'Order Notice', "noticeMail", fileName, filePath);
            
            return [true, filePath];
        }
    } catch (error) {
        console.error(error);
        return [false, ""];
    }
};

module.exports = createNoticeFile;
