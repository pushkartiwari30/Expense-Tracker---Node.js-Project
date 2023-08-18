const AWS = require('aws-sdk');

const uploadDataToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetrackerproject';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    //creating a new intance of s3bucket
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        //Bucket: BUCKET_NAME
    })
    // actually creating a bucketby defining the new intance of s3bucket

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    //we are using promises here becuase uploadDataToS3 is an async task it reutns undefined if we dont use async await (check controller logic for code). And to use async await for uploadDataToS3, this fn(uploadDataToS3) should reunr a promise. 
    return new Promise ((resolve, reject) =>{
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log("Success", s3response);
                resolve(s3response.Location);
            }
        })
    })
    
}
module.exports = {
    uploadDataToS3
}