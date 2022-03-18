
const multer = require('multer'); 
const multerS3 = require('multer-s3'); 
const aws = require('aws-sdk'); 

aws.config.loadFromPath(__dirname + '/awsconfig.json'); 


const s3 = new aws.S3(); 
const upload = multer({ 
    storage: multerS3({ 
        s3: s3, 
        bucket: 'collection8bucket', 
        acl: 'public-read', 
        key: function(req, file, cb) { 
            cb(null, `collectionImageDB/${Date.now()}_${file.originalname}`); 
        } 
    }), 
    // limits: { 
    //     fileSize: 3024 * 4032 * 2 
    // } 
}); 

module.exports = upload;

