const { default: mongoose } = require("mongoose");
const Category = require("../models/categorySchema");
const Candidate = require("../models/CandidateSchema");
const Student = require("../models/studentsSchema");
const bcrypt = require("bcrypt");

const getAllCategories = async (request, response) => {
  try {
    const categories = await Category.find();

    response.status(200).json({ status: true, categories });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const getCandidates = async (request, response) => {
  const id = request.query.id;

  try {
    if (!id) {
      return response
        .status(422)
        .json({ status: false, message: "Category Missing" });
    }

    if (!mongoose.isValidObjectId(id)) {
      return response
        .status(422)
        .json({ status: false, message: "Invalid Id" });
    }

    const candidates = await Candidate.find({ position: id }).populate(
      "position",
      "name"
    );

    response.status(200).json({ status: true, candidates });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const voteCandidate = async (request, response) => {
  const id = request.params.id;

  const { matNo, code,candidate } = request.body;

  try {
    if (!matNo) {
      return response
        .status(400)
        .json({ status: false, message: "Matriculation Number Required" });
    }
    if (!code) {
      return response
        .status(400)
        .json({ status: false, message: "Voting Pin Required" });
    }
    if (!candidate) {
      return response
        .status(400)
        .json({ status: false, message: "an Error Occured" });
    }

    const matNoPattern = /^DE:\d{4}\/\d+$/;

    if (!matNoPattern.test(matNo)) {
      return response.status(400).json({
        status: false,
        message: "Matriculation Number should be in the format DE:year/number",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return response
        .status(400)
        .json({ status: false, message: "Invalid Id" });
    }

    const category = await Category.findById(candidate);

    if (!category) {
      return response
        .status(400)
        .json({ status: false, message: "Invalid Id" });
    }

    const candidate = await Candidate.findById(id);

    if(!candidate){
        return response
        .status(400)
        .json({ status: false, message: "an Error Occured" });
    }

    const student = await Student.findOne({ matNo: matNo });

    if (!student) {
      return response
        .status(400)
        .json({ status: false, message: "Incorrect Details" });
    }

    const codeIsValid = await bcrypt.compare(code, student.token)

    if(!codeIsValid){
        return response
        .status(400)
        .json({ status: false, message: "Incorrect Details" });
    }

    if (category.voters.includes(student._id)) {
      return response.status(400).json({
        status: false,
        message: "You Have Already Voted in this Category",
      });
    }

    category.voters.push(student._id);
    candidate.votes.push(student._id);
    candidate.totalVotes += 1;
    await candidate.save();

    await category.save();

    response.status(200).json({ status: true, message: "Voted Sucessfully" });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllCategories, getCandidates, voteCandidate };
