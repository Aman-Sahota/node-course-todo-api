var {ObjectID}=require('mongodb');

var Todo=require('./../server/models/todo');
var User=require('./../server/models/user');
var mongoose=require('./../server/db/mongoose');

var userID='5b5366e91f30b23ba8d08d9d';

if(ObjectID.isValid(userID)){
    User.find({
        _id:userID
    }).then((users)=>{
        console.log('Users',users);
    });

    User.findOne({
        _id:userID
    }).then((user)=>{
        console.log('User',user);
    });

    User.findById(userID).then((user)=>{
        if(!user){
            console.log('ID not found');
        }
        console.log('User by ID',user);
    });
}else{
    console.log('Id is invalid');
}

// var id ='5b5737d4036c821938474b8d1';

// if(!ObjectID.isValid(id)){
//     console.log('Id is invalid');
// }
// //this method will return an array of documents
// // Todo.find({
// //     _id:id
// // }).then((todos)=>{
// //     console.log('Todos',todos);
// // });

// // //this method will return only one document
// // Todo.findOne({
// //     _id:id
// // }).then((todo)=>{
// //     console.log('Todo',todo);
// // });

// //this method takes the id as argument and returns a document
// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('id not found');
//     }
//     console.log('Todo by id',todo);
// }).catch((e)=>{
//     console.log(e);
// });