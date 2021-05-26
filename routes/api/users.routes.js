const express = require("express");
const router = express.Router();
//include controller
const userCont = require("../../controller/userController");
const uploadCont = require("../../controller/uploadController")

//Traitement des image par biblio multer
const multer = require("multer");
const upload = multer();
//routes
//auth
router.post("/register", userCont.register);
router.post("/login", userCont.login);
router.get("/logout", userCont.logout);
//get
router.get("/", userCont.getAllUsers);
router.get("/:id", userCont.getUser);
//put
router.put("/:id", userCont.updateUser);
router.put("/status/:id",userCont.updateUserStatus);
//patch
router.patch("/friends/:id", userCont.acceptInvitation);
router.patch("/invitations/:id", userCont.sendInvitation);
router.patch("/refuseinv/:id", userCont.refuseInvitation);
//delete
router.delete("/:id", userCont.deleteUser);

// upload
router.post("/upload", upload.single("file"), uploadCont.uploadProfil);

module.exports = router;
