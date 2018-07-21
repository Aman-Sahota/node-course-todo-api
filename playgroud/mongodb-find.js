const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('connected to MongoDB server');
    const db=client.db('TodoApp');
    
    //find method returns a pointer therfore toArray method is used 
    //to convert the documents into an array
    //the to array returns a promise, therfore 'then' method is
    //used-the first callback is for resolve and the other callback 
    //is for reject 
    
    
    // db.collection('Todos').find({_id:new ObjectID('5b52f078e2ce2404d80b525b')}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log(err);
    // });

    // db.collection('Todos').find({completed:false}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log(err);
    // });

    db.collection('Todos').find().count().then((count)=>{
        console.log(`Todos count: ${count}`);
    },(err)=>{
        console.log(err);
    });

    //client.close();
});