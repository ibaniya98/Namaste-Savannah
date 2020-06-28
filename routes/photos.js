const express = require('express'),
    upload = require('../util/multer'),
    S3 = require('../aws/imageHelpers'),
    middleWare = require('../middleware');

let router = express.Router();

const VALID_FOLDERS = ['menu', 'gallery'];

router.get('/photos/:type/all', (req, res) => {
    if (VALID_FOLDERS.includes(req.params.type)) {
        S3.getAllPhotos(req.params.type)
            .then(photos => res.send({ photos }))
            .catch(error => res.status(error.statusCode).send(error));
    } else {
        res.status(400).send({ message: "Invalid folder" });
    }
});

router.post('/photos/:type', middleWare.isLoggedIn, upload.single('image'), (req, res) => {
    if (VALID_FOLDERS.includes(req.params.type)) {
        S3.uploadImage(req.file.path, req.params.type)
            .then(data => res.send(data))
            .catch(error => res.status(error.statusCode).send(error));
    } else {
        res.status(400).send({ message: "Invalid folder" });
    }
});

router.delete('/photos/:key', middleWare.isLoggedIn, (req, res) => {
    const key = decodeURIComponent(req.params.key);
    S3.deleteImage(key)
        .then(data => res.send(data))
        .catch(err => res.send(err));
});

module.exports = router;