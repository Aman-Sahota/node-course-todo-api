require('./config/config');

const express=require('express');
const _=require('lodash');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var mongoose=require('./db/mongoose');
var Todo=require('./models/todo');
var {User}=require('./models/user');
var {authenticate}=require('./middleware/authenticate');

var app=express();

var port=process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=>{
    var newTodo=new Todo({
        text:req.body.text,
        _creator:req.user._id
    });
    newTodo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos',authenticate,(req,res)=>{
    //todo is the name of model
    //with find method returns an array which can be of any name
    //i have passed name as 'todos' it can be anything
    //todos is an array a collection which has all the documents
    Todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({collection:todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;
    if(ObjectID.isValid(id)){
        Todo.findOne({
            _id:id,
            _creator:req.user._id
        }).then((todo)=>{
            if(!todo){
                return res.status(404).send(todo);
            }
            res.send({todo});
        }).catch((e)=>{
            res.status(400).send();
        });
    }else{
        return res.status(404).send();
    }
});

app.delete('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }else{
        Todo.findOneAndRemove({
            _id:id,
            _creator:req.user._id
        }).then((todo)=>{
            if(!todo){
                return res.status(404).send();
            }
            res.status(200).send({todo});
        }).catch((e)=>{
            return res.status(400).send();
        });
    }
});

app.patch('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;

    //here body is an object made by picking the specified properties(text and 
    //completed) from req.body and these properties are added to the body object
    var body=_.pick(req.body, ['text', 'completed']);
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        //Now, body.completedAt is not a property on body object since body object
        //has two properties text and completed therfore here completedAt property is 
        //added to the body object
        body.completedAt=new Date().getTime();  
    }else{
        body.completed=false;
        body.completedAt=null;
    }

    Todo.findOneAndUpdate({_id:id, _creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
        //new: true means that new document after update will be returned
        //these are properties that are used to tweak the result provided by mongoose
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
        console.log(body);
    }).catch((e)=> res.status(400).send(e));
});

app.post('/users',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    
    var user=new User(body);

    user.save().then(()=>{
        return user.generateauthtoken();
    }).then((token)=>{
        // console.log('server',token);
        //here header takes two arguments-1)Name of header,2)value of header
        //here the name is prefixed by 'x-' in order to know that this is
        //a custom header which is not by default supported by html
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});


app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

app.post('/users/login',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        //why are we generating a token here
        //the generatetoken method was used to create and send a token back to
        //the new user which was then used to find the user in GET /users/me 
        //Here we are generating a new token because-
        //That's for the user logging in for the first time, 
        //they wouldn't be able to access that route again until they logged out.
        return user.generateauthtoken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    })
});

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>{
        res.status(400).send();
    })
});

app.listen(port,()=>{
    console.log('Server Up on Port',port);
});

module.exports=app;