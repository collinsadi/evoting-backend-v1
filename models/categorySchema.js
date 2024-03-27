const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name:String,
    totalCandidates:{
        type:Number,
        default:0
    },
    candidates:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Candidate"
    }],
    voters:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Candidate"
    }],
    winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Candidate"
    }
},{timestamps:true});

const Category = mongoose.model("category",categorySchema);

module.exports = Category;