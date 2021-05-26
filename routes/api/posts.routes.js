const router = require('express').Router();

//include controller
const postCont = require('../../controller/postController');
//Traitement des image par biblio multer
const multer = require("multer");
const upload = multer();
//get post
router.get('/', postCont.readPost);
//get post by id of user
router.get('/:id', postCont.readPostByUser);
//post
router.post('/', upload.single("file"), postCont.createPost);
//update post
router.put('/:id', postCont.updatePost);
//delete post
router.delete('/:id', postCont.deletePost);
//patch
router.patch('/like-post/:id', postCont.likePost);
router.patch('/unlike-post/:id', postCont.unlikePost);
// comments
router.patch('/comment-post/:id', postCont.commentPost);
router.patch('/edit-comment-post/:id', postCont.editCommentPost);
router.patch('/delete-comment-post/:id', postCont.deleteCommentPost);


module.exports = router;