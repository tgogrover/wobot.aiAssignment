const express=require('express');
const router=express.Router();
const productModel=require('../models/productModel');
const multer=require('multer');
const csvTojson=require('csvtojson');
const jwt=require('jsonwebtoken');
const loginUsername=localStorage.getItem('loginUsername');

const authUser=(req,res,next)=>{
    if(loginUsername){
        const {authorisation} = req.headers;
        
     if(authorisation){
         
        var header = authorisation.split(' ')[1]
    try{
     var token=jwt.verify(header, process.env.SecretKey);
     
     req.user=token
     //console.log(req.user._id)
     if(req.user){
        next();
     }
    
    
    }
     catch (err){
       return res.status(400).json
       ({
           message:err.message
    })
     }
    }
    else{
        res.status(400).json({
            Message:' Authorisation Required'
    
        })
    
    }
    }
    else{
        res.status(400).json({
            Message:'You have to login first'
    
        })
    }
    
    }
const storage = multer.diskStorage({
   
    destination: function (req, file, cb) {
      cb(null,  'productUploads')
    },
    filename: function (req, file, cb) {
        
      cb(null, loginUsername + '-' + file.originalname)
    }
})


const fileUpload = multer({ storage });

router.post('/api/productUpload',fileUpload.single('csv'),authUser,(req,res)=>{
    //const csvFilepath=''
    //console.log(req.files)
       csvTojson().fromFile(req.file.path)  
.then((jsonObj)=>{  
 const productArray=jsonObj.map((obj)=>{
   obj._createdBy=req.user._id;
   parseFloat(obj.quantity)
   parseFloat(obj.price)
return obj
 })
    console.log(productArray);
   return productModel.insertMany(productArray,(err,product)=>{
        if(err) throw err;
        else{
            res.status(201).json({
                product
            })
        }

    })
 
})
})

router.get('/api/fetchProductLists',authUser,async(req,res)=>{

    await productModel.find({}).select('name quantity price description').exec((err,products)=>{
        if(err) throw err;
        else{
            res.status(200).json({
                products
            })
        }

    })

})

module.exports=router;