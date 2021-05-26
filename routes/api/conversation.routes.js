const router = require("express").Router();
const convCont = require("../../controller/convController");

//new conv
router.post("/", convCont.newConv);

//get conv of a user
router.get("/:userId", convCont.getConvByUser);

// get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", convCont.getTwoUsersConv);

module.exports = router;