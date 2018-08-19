const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');

var UserSchema=new mongoose.Schema({email:{
    type:String,
    required:true,
    minlength:1,
    trim:true,
    unique:true,
    validate:{
        validator:validator.isEmail,
        message:'{VALUE} is not a valid email'
    }
},
password:{
    type:String,
    required:true,
    minlength:6
},
tokens:[{
    access:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
}]});

//toJSON method is used so that only the id and email is given back whenever a 
//new user is added
UserSchema.methods.toJSON=function(){
    //this keyword is used to know what we are manipulating
    //here we are manipulating a single user document
    var user=this;

    //the toObject method converts the mongoose var user from a document to a 
    //normal object
    var userObject=user.toObject();
    return _.pick(user,['_id','email']);
};

//UserSchema.methods is an object where instance methods are added for
//example generateauthtoken
UserSchema.methods.generateauthtoken=function(){
    var user=this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(), access},'abc123').toString();
    // user.tokens.push({access, token});
    user.tokens=user.tokens.concat([{access,token}]);
    
    return user.save().then(()=>{
        return token;
    });
};

//this is where model methods are added 
UserSchema.statics.findByToken=function(token){
    //here we are manipulating a User model
    var User=this;
    var decoded;
    
    try{
        decoded=jwt.verify(token,'abc123');
    }catch(e){
        // return new Promise((resolve,reject)=>{
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        '_id':decoded._id,
        //'' is used whenever '.' is used in between 
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

UserSchema.statics.findByCredentials=function(email,password){
    var User=this;
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        //since bcrypt does not support Promises, it only supports callbacks
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    return resolve(user);
                }else{
                    return reject();
                }
            });
        });
    });
}

UserSchema.pre('save', function (next) {
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }else{
        next();
    }
});

var User=mongoose.model('User',UserSchema);

module.exports={User};