const userSchema = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'./config/.env'});
const {registerErrors,loginErrors} = require('../utils/errors.utils')

module.exports.getAllUsers = async(req,res)=>{
    try{
        const users = await userSchema.find().select('-password'); 
        res.status(200).json(users); 
    }catch{
        err => res.status(400).send(err.message);
    }
}

module.exports.getUser = async(req,res)=>{ 
    if(!ObjectId.isValid(req.params.id)){
        res.status(400).send('Unkown Id : '+req.params.id);
    } 
    else{
        try{
            const user = await userSchema.findById(req.params.id).select('-password');
            res.status(200).json(user);  
        }catch{
            err => res.status(500).send(err.message);
        }
    }
    
}

module.exports.updateUser = async(req,res)=>{
    const {biographie,firstName,lastName} = req.body;
    if(!ObjectId.isValid(req.params.id)){
        res.status(400).send('Unkown Id : '+req.params.id);
    } 
    else{
        try{
            await userSchema.findOneAndUpdate(
                {
                    _id : req.params.id,
                },
                {
                    biographie : biographie,
                    firstName: firstName,
                    lastName : lastName
                },
                {
                    new : true
                }
            )
            res.status(200).json({message:'user updated'});
        }catch{
            err => res.status(500).send(err.message);
        }
    }
}

module.exports.updateUserStatus=async(req,res)=>{
    const {online} = req.body;
    if(!ObjectId.isValid(req.params.id)){
        res.status(400).send('Unkown Id : '+req.params.id);
    } 
    else{
        try{
            await userSchema.findOneAndUpdate(
                {
                    _id : req.params.id,
                },
                {
                    online : online,
                },
                {
                    new : true
                }
            )
            res.status(200).json({message:'status updated'});
        }catch{
            err => res.status(500).send(err.message);
        }
    }
}
module.exports.deleteUser = async(req,res)=>{
    if(!ObjectId.isValid(req.params.id)){
        res.status(400).send('Unkown Id :');
    }  
    else{
        try {
            await userSchema.findOneAndDelete(
                {
                    _id:req.params.id
                }
            );
            res.status(200).json({id:req.params.id,message:'has been deleted'});
        } catch {
            err=> res.status(500).send(err.message);
        }    
    }  
}

module.exports.sendInvitation = async(req,res)=>{
    //on parametre on pass id de la personne à inviter 
    //on body l'id de la personne qui passer l'invitation
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.id)){
        res.status(400).send('Unkown Id : ');
    }  
    else{
        
        try {
            const user = await userSchema.findById(req.body.id);
            if(!(user.friendlist).includes(req.params.id)){
                await userSchema.findByIdAndUpdate(
                    req.params.id,
                    {
                        $addToSet:{invitationlist:req.body.id}
                    },
                    {
                        new: true
                    }
                );
                res.status(200).send('invitation successfuly sent');
            }
            else{
                throw new Error('request not accepted');
            }
        } catch (error){
            res.status(500).send(error.message);
        }    
    }  
}
module.exports.acceptInvitation = async(req,res)=>{
    //on parametre on pass id de la personne à accepter
    //on body l'id de la personne qui l'invite
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.id)){
        res.status(400).send('Unkown Id : ');
    }  
    else{
        try {
            const user = await userSchema.findById(req.body.id);
            if((user.invitationlist).includes(req.params.id)){
                const userToAccept = await userSchema.findByIdAndUpdate(
                    req.body.id,
                    {
                        $addToSet:{friendlist:req.params.id},
                        $pull:{invitationlist:req.params.id}
                    },
                    {
                        new: true
                    }
                );
                const userToInvite = await userSchema.findByIdAndUpdate(
                    req.params.id,
                    {
                        $addToSet:{friendlist:req.body.id}
                    },
                    {
                        new: true
                    }
                );
                res.status(200).send("user accepted");
            }
            else{
                throw new Error('request not accepted');
            }
        } catch(error) {
            res.status(500).send(error.message);
        }    
    }  
}

module.exports.refuseInvitation = async(req,res)=>{
    //on parametre on pass id de la personne à refuser
    //on body l'id de la personne qui l'invite
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.id)){
        res.status(400).send('Unkown Id : ');
    }  
    else{
        try {
            const user = await userSchema.findById(req.body.id);
            if((user.invitationlist).includes(req.params.id)){
                const userToRefuse = await userSchema.findByIdAndUpdate(
                    req.body.id,
                    {
                        $pull:{invitationlist:req.params.id}
                    },
                    {
                        new: true
                    }
                );
                res.status(200).send('invitation refused');
                console.log("invitation refused");
            }
            else{
                throw new Error('request not accepted');
            }
        } catch(error) {
            res.status(500).send(error.message);
        }    
    }  
}



const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken =(id)=>{
    return jwt.sign({id},process.env.TOKEN_SECRET , {
        expiresIn: maxAge
    })
};

module.exports.register = async (req,res) => {
   // console.log(req.body);
    const {pseudo,firstName,lastName,email,password}=req.body;
    try{
        const user = await userSchema.create({pseudo,firstName,lastName,email,password});
        res.status(201).json({user});
    }catch(err){
        const errors = registerErrors(err);
        res.status(400).send({errors});
    }
}

module.exports.login = async (req,res)=>{
    
    const {email , password } = req.body;
    try{
        const user = await userSchema.login(email , password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:false , maxAge:maxAge });
        res.status(200).json({user:user._id})
    }catch(err){
        const errors = loginErrors(err);
        res.status(400).json(errors)
    }
}

module.exports.logout = (req,res)=>{
    console.log("method invocked")
    res.clearCookie('jwt', '', { maxAge: 1});
    res.redirect('/');
}