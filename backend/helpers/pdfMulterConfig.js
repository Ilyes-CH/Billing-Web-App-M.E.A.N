const multer = require('multer');

const MIME_TYPE = {
  'application/pdf': 'pdf'
};

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = isValid ? null : new Error('Invalid file type. Only PDFs are allowed.');
    cb(error, 'backend/uploads/pdfs');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE[file.mimetype];
    const pdfName = `${name}-${Date.now()}.${extension}`;
    cb(null, pdfName);
  }
});


module.exports = storage;


/**
 * @TODO implement the full logic of the invoice and notice
 * @INSTRUCT view service -> get notice -> add one or many to notice group -> send to accountant ->
 *  -> respond with odf solution -> customer view notice and it has a button on the side ->
 *  -> go to cart-> choose quantity -> make the purchase -> save order -> save gain -> update report and gain
 */
