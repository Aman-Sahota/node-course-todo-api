var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
process.env.MONGODB_URI='mongodb://obito1996:22101996aman@ds245661.mlab.com:45661/todoapp_obito';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports=mongoose;