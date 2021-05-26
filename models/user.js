const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    pseudo:{
        type:String,
        required:true,
        minlength:5,
        maxlength:20,
        unique:true,
        trim : true 
    },
    firstName:{
        type:String,
        required:true,
        minlength:5,
        maxlength:20,
        trim : true ,
       
    },
    lastName:{
        type:String,
        required:true,
        minlength:5,
        maxlength:20,
        trim : true ,
   
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate:[isEmail],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required: true,
        minlength:5,
        maxlength:20,
    },
    biographie:{
        type : String,
        maxlength : 1024,
        default : ""
    },
    avatar:{
        type : String,
        default: "/uploads/avatar/user.png"
    },
    online:{
        type : Boolean,
        default: false
    },
    friendlist:{
        type : [String]
    },
    invitationlist: {
        type : [String]
    }
},
{ 
    timestamps: true 
})

userSchema.pre("save", async function(next){
    const salt  = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
};

module.exports = User = mongoose.model('user',userSchema);