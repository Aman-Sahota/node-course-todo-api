const {ObjectID}=require('mongodb');

const mongoose=require('./../server/db/mongoose');
const Todo=require('./../server/models/todo');
const User=require('./../server/models/user');

//Todo.remove
// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id:'5b58be036d804928b4df076a'}).then((todo)=>{
//     console.log(todo);
// });

Todo.findByIdAndRemove('5b58be036d804928b4df076a').then((todo)=>{
    console.log(todo);
});