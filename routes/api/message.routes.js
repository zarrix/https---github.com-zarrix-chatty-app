const router = require("express").Router();
const messCont = require("../../controller/messController");

//add
router.post("/", messCont.addMessage);

//get
router.get("/:conversationId", messCont.getConvId);
  
module.exports = router;