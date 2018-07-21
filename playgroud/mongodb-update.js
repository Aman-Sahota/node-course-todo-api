const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('connected to MongoDB server');
    const db=client.db('TodoApp');
        
    // db.collection('Todos').findOneAndUpdate({
    //     _id:new ObjectID('5b5327e209d00704d8a2e2e7')
    // },{
    //     $set:{
    //         completed:true
    //     }
    // },{
    //     returnOriginal:false
    // }).then((result)=>{
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id:new ObjectID('5b52dd491312321e648de8ab')
    },{
        $set:{
            name:'Itachi Uchiha'
        },
        $inc:{
            age:1
        }
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
    });

    //client.close();
});