const Student = require("../models/studentsSchema");
const sendEmail = require("../utils/emailSystem");
const bcrypt = require("bcrypt");
const generateUniqueHash = require("../utils/generateHash");


const registerForElection = async (request, response)=>{

    const {fullName, matNo, level, email} = request.body;

    try{

        console.log(request.body)

    if(!fullName){
        return response.status(400).json({status:false, message:"Full Name is Required"});
    }

    const nameParts = fullName.trim().split(' ');

    if(nameParts.length < 2){
        return response.status(400).json({status:false, message:"Please Enter Full Name"});
    }

    if(!matNo){
        return response.status(400).json({status:false,message:"Matriculation Number Required"})
    }

    const matNoPattern = /^DE:\d{4}\/\d+$/;

    if (!matNoPattern.test(matNo)) {
        return response.status(400).json({ status: false, message: "Matriculation Number should be in the format DE:year/number" });
    }

    const allowedLevels = ["1","2","3","4"]

    if(!level){
        return response.status(400).json({status:false, message:"Please Select Your Level"});
    }

    if(!allowedLevels.includes(level)){
        return response.status(400).json({status:false, message:"The Level Selected is Invalid"});
    }

    if (!email) {
        return response.status(400).json({ status: false, message: "Your Email is Required to send Your Token for Voting" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return response.status(400).json({ status: false, message: "Please provide a valid email address" });
    }
    

    const emailRegistered = await Student.findOne({email:email.toLowerCase()});

    if(emailRegistered){
        return response.status(400).json({ status: false, message: "This Email Has been used" });
    }

    const matNoRegistered = await Student.findOne({matNo:matNo});

    if(matNoRegistered){
        return response.status(400).json({ status: false, message: "This Matriculation Number Has already been registered" });
    }


    await Student.create({fullName:fullName.toUpperCase(),matNo,level,email});

    response.status(200).json({status:true, message:"You Have Sucessfully Registered for the 2024 SOSAN Departmental Elections, You will Get a Token once your Registration have been validated"});

    }catch(error){
        console.log(error);
        response.status(500).json({status:false,message:"Internal Server Error"})
    }

}

const getRegisteredCandidates = async (request, response)=>{
    
    const { page, perpage,filter } = request.query;

    try {

        if (!page || !perpage) {
            return response.status(422).json({status:false, message:"Pagination details missing"});
        }

        const allowedFilters = ["all","approved","not-approved"];

        if(!allowedFilters.includes(filter)){
            return response.status(400).json({status:false, message:"Invalid Filter Query"});
        }


        if(filter === "all"){

        const currentPage = parseInt(page, 10);
        const itemsPerPage = parseInt(perpage, 10);
        const skip = (currentPage - 1) * itemsPerPage;

        const totalRegistrantsCount = await Student.countDocuments();
        const totalPages = Math.ceil(totalRegistrantsCount / itemsPerPage);

        const registrants = await Student.find()
            .sort({fullName:"asc"})
            .skip(skip)
            .limit(itemsPerPage)
            .exec();

        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

       response.status(200).json({
            status:true,
            registrants,
            currentPage,
            itemsPerPage,
            hasNextPage,
            hasPrevPage,
            totalPages,
            totalItems:totalRegistrantsCount
        });

    }else{

        const currentPage = parseInt(page, 10);
        const itemsPerPage = parseInt(perpage, 10);
        const skip = (currentPage - 1) * itemsPerPage;

        const totalRegistrantsCount = await Student.countDocuments({approved:filter === "approved"});
        const totalPages = Math.ceil(totalRegistrantsCount / itemsPerPage);

        const registrants = await Student.find({approved:filter === "approved"})
            .sort({fullName:"asc"})
            .skip(skip)
            .limit(itemsPerPage)
            .exec();

        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

       response.status(200).json({
            status:true,
            registrants,
            currentPage,
            itemsPerPage,
            hasNextPage,
            hasPrevPage,
            totalPages,
            totalItems:totalRegistrantsCount
        });

    }




    }catch(error){
        console.log(error);
        response.status(500).json({status:false,message:"Internal Server Error"})
    }
}


const approveRegistrant = async (request, response) =>{

    const id = request.params.id;

    try{

    const registrant = await Student.findById(id);
    const votingToken = generateUniqueHash(6);

    registrant.approved = true;
    registrant.token = await bcrypt.hash(votingToken,10);
    await registrant.save();

    sendEmail(registrant.email,"SOSSAN Election E-voting Token",`<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation: Your Registration for School Election Validated</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f5f5f5; padding: 20px;">
    
    <div class="container" style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333; margin-bottom: 20px;">Confirmation: Your Registration for School Election Validated</h2>
      <p style="color: #666; margin-bottom: 20px;">Dear ${registrant.fullName},</p>
      <p style="color: #666; margin-bottom: 20px;">We are delighted to inform you that your registration for the upcoming school election has been successfully validated. Your participation in this democratic process is vital, and we appreciate your enthusiasm for contributing to our school's governance.</p>
      <p style="color: #666; margin-bottom: 20px;">Your voting token, which ensures the integrity and security of the voting process, is <strong style="letter-spacing: 2px;">${votingToken}</strong>. Please treat this token with utmost confidentiality and do not share it with anyone. Your vote is your voice, and its secrecy is paramount to the fairness of the election. Under no circumstances should you sell or disclose your token to others.</p>
      <p style="color: #666; margin-bottom: 20px;">Election Details:<br>
        - Date: <br>
        - Time: <br>
        - Venue: </p>
      <p style="color: #666; margin-bottom: 20px;">We would like to emphasize the importance of fair play and ethical conduct throughout the election process. Any form of electoral malpractice, including but not limited to bribery, coercion, or tampering with votes, will not be tolerated and may result in severe consequences as per school regulations.</p>
      <p style="color: #666; margin-bottom: 20px;">Your participation in this election is a testament to your commitment to our school community. By casting your vote, you are actively shaping the future of our institution. We encourage you to familiarize yourself with the candidates and their platforms to make an informed decision on the election day.</p>
      <p style="color: #666;">Thank you for your cooperation, and we wish you the best of luck in the upcoming election.</p>
      <p style="color: #666;">Sincerely,<br>
      Boma<br>
      Faculty President
    </div>
    
    </body>
    </html>
    `)


    response.status(200).json({status:true, message:"Registrant Approved and Token Sent"});



    }catch(error){
        console.log(error);
        response.status(500).json({status:false,message:"Internal Server Error"});
    }
} 

module.exports = {registerForElection,getRegisteredCandidates,approveRegistrant}