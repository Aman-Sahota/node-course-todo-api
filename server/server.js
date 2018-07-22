var express=require('express');
var bodyParser=require('body-parser');

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

app.listen(port,()=>{
    console.log('Server Up on Port',port);
});

module.exports=app;