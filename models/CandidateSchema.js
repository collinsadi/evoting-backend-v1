const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  matNo: { type: String, required: true },
  position: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
  totalVotes: { type: Number, default: 0 },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
