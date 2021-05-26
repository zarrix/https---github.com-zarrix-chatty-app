//importation de mongoose
const mongoose = require('mongoose');
//importation de app
const app = require("../app");
const db = require("../config/keys").mongotestURI;
const fs = require("fs");
//import usermodel
Post = require("../models/post")
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})


var request = require('supertest');

describe("App test",()=>{
    it("has a module",()=>{
        expect(app).toBeDefined();
    });
    let server;
    //start server;
    beforeAll(()=>{
        server = app.listen(5002);
    })
    
    afterAll(function(done) {
        mongoose.disconnect();
        done();
      });
    
//test Get All posts
    it("can get all posts",async()=>{
        await request(server).get("/api/posts").expect(200)
    })

//test Get a exist post in database
     it("can get post by id",async()=>{
         const id="60ad6508927a5d0648129230";
         await request(server).get("/api/posts/"+id).expect(200)
        })
      
    
//test create post
      it('should create a new post', async () => {
        const data = {
            "posterId":"60ad3bab0994b45368e5411c",
             "message":"hello everyone"
            }
        await request(server)
        .post('/api/posts/')
        .set('content-type', 'multipart/form-data')
        .field('posterId', '60ad3bab0994b45368e5411c')
        .field('message', 'hello everyone')
             .expect(201)
             .then(async (response) => {
                // Check the response
                //console.log(response)

                console.log(response.body)
                // Check the response
        
                expect(response.body.posterId).toBe(data.posterId)
                expect(response.body.message).toBe(data.message)
             
                // Check the data in the database
                const post = await Post.findOne({ _id: response.body._id })
                expect(post.posterId).toBe(data.posterId)
                expect(post.message).toBe(data.message)
        
                
            })
      })

      
     //

//test update a post
      it('should update a post', async () => {
        const id="60ad6508927a5d0648129230";
        const data = {
            "message":"heeey everybody"
            }
        await request(server)
        .put("/api/posts/"+id)
        .send(data)
             .set('Content-Type', 'application/json')
             .expect(200)
             .then(async (response) => {
                // Check the response
                //console.log(response)
                //console.log(response.body.post)
                console.log(response.body)
                // Check the response
                expect(response.body.message).toBe(data.message)
                // Check the data in the database
                const post = await Post.findOne({ _id: id })
                expect(post.message).toBe(data.message)
            })
      })
      //


  
})
