const mongoose=require('mongoose');

//defining the schema
var ProductSchema=new mongoose.Schema({
   
     name: {type:String}, 
     description:{type:String}, 
     quantity: {type:Number}, 
     price: {type:Number},
      _createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true }
});


//exporting sigup model
module.exports=mongoose.model('Product',ProductSchema)