const express = require("express");
const router = express.Router();

const {registerForElection,getRegisteredCandidates,approveRegistrant,createElectionCategory, getElectionCategories, deleteElectionCategory,addCandidate,getCandidates} = require("../controllers/preElectionController");


router.post("/register",registerForElection);


// ADMIN


router.get("/registered",getRegisteredCandidates);
router.post("/approve/:id",approveRegistrant);
router.post("/category/create",createElectionCategory);
router.get("/category/all",getElectionCategories);
router.delete("/category/delete/:id",deleteElectionCategory);
router.post("/candidate/add",addCandidate);
router.get("/candidate/all",getCandidates)



module.exports = router;