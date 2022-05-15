const AWS = require('aws-sdk');
const S3_BUCKET = "placeholder";


const id = "placeholder"
const secret = "placeholder";

const s3 = new AWS.S3({
    accessKeyId: id,
    secretAccessKey: secret
});
// var qrcode = require('yaqrcode');
/* global base64 */
/**
 * Generate qr codes from a list of strings (a qr code for each string)
 */
 var qcgen = require('yaqrcode');

 exports.handler = async (event) => {
   const requestBody = JSON.parse(event.body);

   if (event.httpMethod !== 'POST' || !requestBody.items) {
     return {
       statusCode: 400,
       headers: {
         "x-custom-header" : "alpha"
       },
       body: 'Malfofrmed request.'
     }
   }

    let responseBody = requestBody.items.map(e => ({
      item: e,
      code: qcgen(e), 
    }))

    for (let i = 0; i < responseBody.length; i++) {
        
        var testy = responseBody[i].code;
       
        //const base64 = responseBody[i].code;
        // const base64Data = new Buffer.from(testy.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const base64Data = Buffer.from(testy.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        
        const type = testy.split(';')[0].split('/')[1];
        const image_name = Date.now() + "-" + Math.floor(Math.random() * 1000);
        const params = {
            Bucket: S3_BUCKET,
            Key: `${image_name}.${type}`, // type is not required
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `image/${type}` // required. Notice the back ticks
        };
        // this doesn't work
        // s3.upload(params, function (err, data) {
        //     console.log(err);
        //     console.log(data);
        //     if (err) {
        //         console.log('ERROR MSG: ', err);
        //     } else {
        //         console.log('Successfully uploaded data');
        //     }
        // });
        // await s3.upload(params).promise().then((data) => {
        //     console.log(data);
        // }, (err) => {
        //     console.log("error!!");
        //     console.log(err);
        // });

    }
 
    let response = {
      statusCode: 200,
      headers: {
        "x-custom-header" : "alpha"
      },
      body: JSON.stringify(responseBody)
     };

     return response;
 };
