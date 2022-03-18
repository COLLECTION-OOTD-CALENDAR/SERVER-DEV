const aws = require('aws-sdk');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { promisify } = require('util')
const randomBytes = promisify(crypto.randomBytes)
dotenv.config();


aws.config.loadFromPath(__dirname + '/awsconfig.json'); 


const s3 = new aws.S3(); 

async function PreSignUrl() {
    const rawBytes = await randomBytes(16);
    const image = rawBytes.toString('hex')
  
    const params = ({
      Bucket: 'collection8bucket',
      Key: image,
      Expires: 60
    })
  
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
  }
  
  module.exports = {
    PreSignUrl,
  }