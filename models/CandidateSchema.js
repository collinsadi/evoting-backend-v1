const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: {type:String, required:true},
  image: {type:String, required:true},
  votes: [{type:mongoose.Schema.Types.ObjectId,ref:"student"}],
  totalVotes: {type:String}
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
