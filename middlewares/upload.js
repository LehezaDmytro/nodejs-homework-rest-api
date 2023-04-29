const multer = require("multer");
const path = require("path");

const tmpDir = path.resolve("tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cd) => {
    cd(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
