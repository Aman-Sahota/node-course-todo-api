const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var password='obitouchiha1996';

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
    });
});

var hashedPassword='$2a$10$MX0iM/XO8LzwGHiHeI9ipep5mFRWajNuhGlKYS4E/T5yNta6.5E9q';

bcrypt.compare(password,hashedPassword,(err,res)=>{
    console.log(res);
});
// var data={
//     id:10
// };

// var token=jwt.sign(data,'obito1996');
// console.log(token);
// console.log(typeof token);

// var decoded=jwt.verify(token,'obito1996');
// console.log('decoded',decoded);

// var message='I am user number 3';
// console.log(`Message:${message}`);
// console.log(`Hash:${SHA256(message+'secret').toString()}`);

// var data={
//     id:4
// };

// var token={
//     data,
//     hash:SHA256(JSON.stringify(data)+'secret').toString()
// };

// // token.data.id=5;
// // token.hash=SHA256(token.data.id);

// var resultHash=SHA256(JSON.stringify(token.data)+'secret').toString();
// if(resultHash===token.hash){
//     console.log('valid data');
// }else{
//     console.log('invalid data');
// }