const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;