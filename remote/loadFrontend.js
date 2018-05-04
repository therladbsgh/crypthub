const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

AWS.config.region = 'us-east-1';
const s3 = new AWS.S3();

const root_dir = 'dist/';

function uploadDir(s3Path) {
    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            const filePath = path.join(currentDirPath, name);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function(filePath, stat) {
        const bucketPath = filePath.substring(s3Path.length);
        if (bucketPath != '.DS_Store') {
            const contentType = _.includes(bucketPath, '.html') ? 'text/html' : _.includes(bucketPath, '.js') ? 'application/javascript' : _.includes(bucketPath, '.css') ? 'text/css' : 'image/jpeg';
            const params = {Bucket: 'crypthub', Key: bucketPath, Body: fs.readFileSync(filePath), ContentType: contentType};
            s3.putObject(params, function(err, data) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Successfully uploaded '+ bucketPath);
                }
            });
        }

    });
}

s3.listObjects({ Bucket: 'crypthub' }, function (err, data) {
    if (err) {
        console.log("error listing bucket objects " + err);
        return;
    }

    const items = data.Contents;
    for (var i = 0; i < items.length; i += 1) {  
        const deleteParams = { Bucket: 'crypthub', Key: items[i].Key};
        s3.deleteObject(deleteParams, function (err2, data) {
            if (data) {
                console.log("File deleted successfully");
            }
            else {
                console.log("Check if you have sufficient permissions : " + err2);
            }
        });
    }
});

setTimeout(() => uploadDir(root_dir), 5000);