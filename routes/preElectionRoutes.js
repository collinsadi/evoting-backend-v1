const express = require("express");
const router = express.Router();

const {registerForElection,getRegisteredCandidates,approveRegistrant} = require("../controllers/preElectionController");


router.post("/register",registerForElection);
router.get("/registered",getRegisteredCandidates);
router.post("/approve/:id",approveRegistrant);



module.exports = router;