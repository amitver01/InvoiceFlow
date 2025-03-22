
const mongoose=require('mongoose');

const User= new mongoose.Schema({
    name:{
        type:String,
        required: true,
        
    }
})