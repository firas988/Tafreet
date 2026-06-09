const multer = require("multer");
const fs = require("fs");


//save the image in the temp folder before moving it to the product folder.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const dir = "uploads/temp";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    try {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}_${safeName}`);
    } catch (error) {
      cb(error);
    }
  },
});

const uploadImage = multer({ storage });

module.exports = { uploadImage };