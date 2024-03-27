const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 4848;
const uri = process.env.MONGO_URI;




app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


const preElectionRoutes = require("./routes/preElectionRoutes");
const electionRoutes = require("./routes/electionRoutes")





app.use("/api/v1/pre-election",preElectionRoutes);
app.use("/api/v1/election",electionRoutes);




mongoose.connect(uri)
.then(()=>console.log("Sharp! MongoDB Don Connect 😇️😇️😇️"))
.catch(error=> console.log("Ommor MongoDB no gree Connect ooo 😥️😥️😥️"))






app.listen(port, ()=>{
    console.log(`Server Running http://localhost:${port}`)
})