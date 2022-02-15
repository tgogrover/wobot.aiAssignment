const express=require('express');
const router=express.Router();
const signupModel=require('../models/signupModel')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const  {body,validationResult}=require('express-validator');




//making scratch folder and storing some information(work like cache) in it 
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  const authUser=(req,res,next)=>{
    const loginUsername=localStorage.getItem('loginUsername');
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
//validation messages (occur only if there is wrong validation)
  const loginRequirement=[
    body('username')
    .notEmpty()
    .withMessage('username is required'),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
]

//Giving wrong validation messages as response 
const Validation=  (req,res,next)=> {const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
    }


     //here only user can login
    router.post('/api/login',loginRequirement,Validation,async (req,res)=>{
        const {username,password}=req.body;
        const legalContacts=signupModel.findOne({
            username:username
        })
        await   legalContacts.exec((err,Data)=>{
            if(err) throw err
            if(Data){
                console.log(Data)
                 const {username,firstName,lastName,_id,Password}=Data
                if(bcrypt.compareSync(password,Password)){
                   
                    var token = jwt.sign({_id:_id,username:username}, process.env.SecretKey);
                    localStorage.setItem("loginUsername",username);
                    localStorage.setItem('loginToken',token);
                 
                 res.status(200).json({
                     token,
                 CustomerData:{username,firstName,lastName}
                 })    
            }
        
            else{
                res.status(400).json({
                    Message:'Invalid password '
                })
            }
        }
        else{
            res.status(400).json({
                message:'You have to sigup First'
            })
        }
    })
    })

    router.get('/api/fetch/userDetails/:id',authUser,async(req,res)=>{
        
            const {id}=req.params;
            await signupModel.findById({_id:id}).select('username firstName lastName')
            .exec((err,data)=>{
                if(err) throw err;
                if(data){
                    res.status(200).json({
                       data

                    })
                }
                else{
                    res.status(400).json({
                        Message:'user does not exist'
                    })
                }

            })

        
    })

    router.get('/api/fetch/userLists',authUser,async(req,res)=>{
        
        
        await signupModel.find({}).select('username firstName lastName')
        .exec((err,data)=>{
            if(err) throw err;
            if(data){
                res.status(200).json({
                   data

                })
            }
            else{
                res.status(400).json({
                    Message:'user does not exist'
                })
            }

        })

    
})

    router.get('/logout',(req,res)=>{
        localStorage.removeItem('loginUsername')
        localStorage.removeItem('loginToken')
        res.json({
            Message:'logout Successfull'
        })
    
    })

module.exports=router;