const {
  getAllCategories,
  getCandidates,
  voteCandidate
} = require("../controllers/electionControllers");

const express = require("express");
const router = express.Router();

router.get("/all/categories", getAllCategories);
router.get("/candidates/all", getCandidates);
router.post("/vote/:id", voteCandidate);

module.exports = router;
