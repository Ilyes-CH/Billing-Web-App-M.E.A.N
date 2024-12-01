
const multer = require('multer');
const path = require('path')
const MIME_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
}
// Set up storage configuration
const storage = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    const uploadPath = path.join(__dirname, '../uploads/images')

    if (isValid) {
      cb(null, uploadPath)
    }
  },
  // file name
  filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
    
    const extension = MIME_TYPE[file.mimetype];
    const imgName = name + '-' + Date.now() + '-bootcamp' + '.' + extension;
  
    cb(null, imgName);
  }
});
module.exports = storage
