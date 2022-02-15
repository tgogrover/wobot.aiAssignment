const mongoose=require('mongoose');

//defining the schema
var SignupSchema=new mongoose.Schema({
   
    Password:{
        type:String,
        required:true,
        minlength:6
    },
    username:{
        type:String,
       required:true,
        unique:true,
        minlength:5,
        maxlength:10
    },
    lastName:{
        type:String,
       required:true,
        minlength:4,
        maxlength:10
    }, 
    firstName:{
        type:String,
       required:true,
        minlength:4,
        maxlength:10
    },
    date:{
        type:Date,
        default:Date
    }
});


//exporting sigup model
module.exports=mongoose.model('User',SignupSchema)