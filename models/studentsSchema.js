const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const studentSchema = new Schema({

    fullName:{
        type:String,
        required:true
    },
    matNo:{
        type:String,
        required:true
    },
    level:{
        type:String,
        enum:["1","2","3","4"]
    },
    email:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    approved:{
        type:Boolean,
        default:false
    }


},{timestamps:true});


const Student = mongoose.model("student",studentSchema);

module.exports = Student;