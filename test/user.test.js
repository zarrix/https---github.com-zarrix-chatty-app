//importation de mongoose
const mongoose = require('mongoose');
//importation de app
const app = require("../app");
const db = require("../config/keys").mongotestURI;
//import usermodel
User = require("../models/user")
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
        server = app.listen(5001);
    })
    afterAll(function(done) {
        mongoose.disconnect();
        done();
      });
    
//test Get All users
    it("can get all users",async()=>{
        await request(server).get("/api/users").expect(200)
    })

//test Get a exist user in database
     it("can get user by id",async()=>{
         const id="60ad3bab0994b45368e5411c";
         await request(server).get("/api/users/"+id).expect(200)
        })
 
//test create user
    it('should create a new user', async () => {
        const data = {
            "pseudo":"chouaib",
             "firstName":"chouaib",
             "lastName":"eladraoui",
             "email":"chouaib@gmail.com",
             "password":"azerty"}
        await request(server)
        .post('/api/users/register')
        .send(data)
             .set('Content-Type', 'application/json')
             .expect(201)
             .then(async (response) => {
                // Check the response
                //console.log(response)
                console.log(response.body.user)
                // Check the response
                expect(response.body.user.pseudo).toBe(data.pseudo)
                expect(response.body.user.firstName).toBe(data.firstName)
                expect(response.body.user.lastName).toBe(data.lastName)
                expect(response.body.user.email).toBe(data.email)
                console.log(response.body.user)
                // Check the data in the database
                const user = await User.findOne({ _id: response.body.user._id })
                expect(user.pseudo).toBe(data.pseudo)
                expect(user.firstName).toBe(data.firstName)
                expect(user.lastName).toBe(data.lastName)
                expect(user.email).toBe(data.email)
            })
      })

   
  
     //
//test update a user
      it('should update a user', async () => {
        const id="60ad3bab0994b45368e5411c";
        const data = {
            "biographie":"holaa",
             "firstName":"abire",
             "lastName":"ghallabi"
            }
        await request(server)
        .put("/api/users/"+id)
        .send(data)
             .set('Content-Type', 'application/json')
             .expect(200)
             .then(async (response) => {
                // Check the response
                //console.log(response)
                //console.log(response.body.user)
                console.log(response.body)
                // Check the response
                expect(response.body.message).toBe('user updated')
                // Check the data in the database
                const user = await User.findOne({ _id: id })
                expect(user.biographie).toBe(data.biographie)
                expect(user.firstName).toBe(data.firstName)
                expect(user.lastName).toBe(data.lastName)
            })
      })
      
      //
//test login user

        it('user should be login', async () => {
            const data = {
                "email":"abire1@gmail.com",
                "password":"azerty"
            }
            await request(server)
            .post("/api/users/login")
            .send(data)
            .set('Content-Type', 'application/json')
            .expect(200)
            .then(async (response) => {
            // Check the response
            //console.log(response)
            //console.log(response.body.user)
            console.log(response.body)
            // Check the response
            // Check the data in the database
            const user = await User.findOne({ email:data.email })
            //console.log(user)
            //const id=user._id
            expect(response.body.user).toBe(user._id.toString())
            //console.log(user._id.toString())
        })
  })
  
  
})
