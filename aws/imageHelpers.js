const AWS = require('aws-sdk'),
    mime = require('mime'),
    fs = require('fs'),
    path = require('path');

const s3 = new AWS.S3();

BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const getImageName = (key) => {
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

const parseS3Error = ({ statusCode, message }) => {
    return { statusCode, message };
}

/**
 * Returns all files inside the given folder from the bucket
 * @param {*} keyFolder prefix to the folder
 */
const getAllPhotos = async (keyFolder = "") => {
    return new Promise((resolve, reject) => {
        const searchParams = {
            Bucket: BUCKET_NAME,
            Prefix: keyFolder
        };

        s3.listObjects(searchParams, (err, data) => {
            if (err) {
                reject(parseS3Error(err));
            } else {
                let photos = data.Contents.filter(content => content.Size > 0);
                const photoData = photos.map(content => {
                    return {
                        Key: content.Key,
                        Location: getImageName(content.Key)
                    }
                });
                resolve(photoData);
            }
        });
    });
}

/**
 * Uploads a single image to the S3 bucket
 * @param {*} filePath file path of the image
 * @param {*} folder folder in S3 bucket
 * 
 * @returns
 * If it is successful, it returns data of the newly created object.
 *      Keys => {"ETag", "Location", "key", "Key", "Bucket" }
 */

const uploadImage = async (filePath, folder = "") => {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', (err) => {
            reject(err);
        });

        let Key = path.basename(filePath);
        if (folder) {
            Key = `${folder}/${Key}`;
        }

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Body: fileStream,
            Key: Key,
            ACL: "public-read",
            ContentType: mime.getType(filePath)
        };

        s3.upload(uploadParams, (err, data) => {
            if (err) {
                reject(parseS3Error(err));
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Deletes object from S3 given the key of the object
 * @param {*} key Key of object to be deleted
 */
const deleteImage = async (key) => {
    const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: key
    };

    return new Promise((resolve, reject) => {
        s3.deleteObject(deleteParams, (err, data) => {
            if (err) {
                reject(parseS3Error(err));
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    getAllPhotos,
    uploadImage,
    deleteImage
};