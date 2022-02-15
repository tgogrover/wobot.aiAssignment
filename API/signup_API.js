const express=require('express');
const router=express.Router();
const signupModel=require('../models/signupModel')
const bcrypt=require('bcrypt');
const  {body,validationResult}=require('express-validator');

//wrong validation signup messages
const signIN_validationMessages=[
     body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')
    .isString()
    .withMessage('Password must be string'),
  body('firstName')
    .notEmpty()
    .withMessage(' firstName is required')
    .isLength({ min: 4,max:10})
    .withMessage('firstName must be between 4 and 10 alphabets')
    .isString()
    .withMessage('firstName must be string'), 
     body('lastName')
    .notEmpty()
    .withMessage(' lastName  is required')
    .isLength({ min: 4,max:10})
    .withMessage('lastName must be between 4 and 10 alphabets')
    .isString()
    .withMessage('lastName must be string'),
    body('username')
    .notEmpty()
    .withMessage(' username  is required')
    .isLength({ min: 5,max:10})
    .withMessage('username must be between 5 and 10 alphabets')
    .isString()
    .withMessage('username must be string'), 
]



//giving validation messages as response if there is wrong validation
const Validation=  (req,res,next)=> {const errors = validationResult(req);
if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(400).json({ error: errors.array()[0].msg })
}
next();
}




//checking if passed username in database or not if,found then give message="Try differnt username" as response
const uniqueUsername = async (req,res,next) => {
    const {username}=req.body;
    const usernameFindQuery=signupModel.findOne({username:username})
    await usernameFindQuery.exec((err,data)=>{
        if(err) throw err
    if(data){
       return  res.status(400).json({
           Message:"Try differnt Username"
       });
        
    }
    else{
        next();
    }
    }) 
};




// signup here
router.post('/api/signup',signIN_validationMessages,Validation,uniqueUsername,async(req,res)=>{
    
    const {password,username,firstName,lastName}=req.body;
     
    const Hash_Password=bcrypt.hashSync(password,10);
     const User=new signupModel({
        Password:Hash_Password,
        username:username,
        firstName:firstName,
        lastName:lastName
 })
   await User.save((err,Data)=>{
       if(err){
           res.status(400).json({
               message:'Something went Wrong',
               Error:err
           })
       }
       else{
           const {username,firstName,lastName}=Data
        res.status(201).json({
            message:'User Information Saved Successfully',
            username,firstName,lastName
        })    
       }
   })     
})







module.exports=router;
