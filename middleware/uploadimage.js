const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
require('dotenv').config();

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;


const s3 = new AWS_SECRET_ACCESS_KEY.s3({
    Credential:{
        accesskeyId:AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region:AWS_REGION
})

const uploadWithMulter = () => multer({
    storage:multerS3({
        s3:s3,
        bucket:AWS_BUCKET_NAME,
        metadata:function(req,file,cb){
            cb(null,{fieldname:File.fieldname})
        },
        key:function(req,file,cb){
            cb(null,file.originalname)
        }
    })
}).array("s3Image",2)

uploadtoAws = (req,res) => {
    const upload = uploadWithMulter();

    upload((req,res,err => {
        if(err){
            console.log(err);
            res.json({err,msg:'error occured while uploading'})
            return
        }
        res.json({msg:"file upload successfully", files: req.files})
    }))}


const router = express.Router();

router.post('/upload',uploadToAws);

module.exports= router;