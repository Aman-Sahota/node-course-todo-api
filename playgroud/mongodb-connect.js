const {MongoClient}=require('mongodb');
//const MongoClient=require('mongodb').MongoClient;

//synatactic sugar-Obeject Destructuring
// var user={
//     name:'aman'
// }
// var {name}=user; with this i pull the name prop from user object
//this is in es6 not node
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('connected to MongoDB server');
    const db=client.db('TodoApp');
    
    // db.collection('Todos').insertOne({
    //     text:'Something to do',
    //     completed:false
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert Todos');
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    // db.collection('Users').insertOne({
    //     name:'Aman Sahota',
    //     age:22,
    //     location:'B1/1103 KAG Vaibhav Khand Indrapuram Ghz UP India pin-201014'
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert Todos');
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });
    db.collection('Users').insertOne({
        name:'Obito Uchiha',
        age:22,
        location:'Hidden Leaf village, Land of Fire'
    },(err,result)=>{
        if(err){
            return console.log('Unable to insert Todos');
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });

    client.close();
});