// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const admin = require('firebase-admin');
admin.initializeApp();

const uploader = require('./S3/uploader');

exports.uploader = uploader.uploader;
