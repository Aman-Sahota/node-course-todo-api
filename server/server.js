var express=require('express');
var bodyParser=require('body-parser');
var {ObjectID}=require('mongodb');

var mongoose=require('./db/mongoose');
var Todo=require('./models/todo');
var User=require('./models/user');

var app=express();

var port=process.env.PORT||3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var newTodo=new Todo({
        text:req.body.text
    });
    newTodo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos',(req,res)=>{
    //todo is the name of model
    //with find method returns an array which can be of any name
    //i have passed name as 'todos' it can be anything
    //todos is an array a collection which has all the documents
    Todo.find().then((todos)=>{
        res.send({collection:todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(ObjectID.isValid(id)){
        Todo.findById(id).then((todo)=>{
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

app.delete('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }else{
        Todo.findByIdAndRemove(id).then((todo)=>{
            if(!todo){
                return res.status(404).send();
            }
            res.status(200).send({todo});
        }).catch((e)=>{
            return res.status(400).send();
        });
    }
});

app.listen(port,()=>{
    console.log('Server Up on Port',port);
});

module.exports=app;