const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

const Todo=require('./../../models/todo');
const {User}=require('./../../models/user');

const userOne=new ObjectID();
const userTwo=new ObjectID();

const users=[{
    _id:userOne,
    email:'userOne@gmail.com',
    password:'userOnePass',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userOne,access:'auth'},'abc123').toString()
    }]
},{
    _id:userTwo,
    email:'userTwo@gmail.com',
    password:'userTwoPass'
}];

const todos=[{
    _id:new ObjectID(),
    text:'First test Todo'
},{
    _id:new ObjectID(),
    text:'Second test Todo',
    completedAt:333
}];

const populateTodos=(done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());
};

const populateUsers=(done)=>{
    User.remove({}).then(()=>{
        var userOne=new User(users[0]).save();
        var userTwo=new User(users[1]).save();
        //promise all will only run when above save function promise will resolve
        return Promise.all([userOne,userTwo]);
    }).then(()=> done());
};

module.exports={todos, populateTodos, users, populateUsers};