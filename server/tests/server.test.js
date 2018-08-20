const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const app=require('./../server');
const Todo=require('./../models/todo');
const {User}=require('./../models/user');
const {todos, users, populateTodos, populateUsers}=require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
    it('should create a new todo',(done=>{
        var text='Test todo next';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));
            });            
    }));
    it('should not create todo with invalid data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });
    });
});

describe('GET /todos',()=>{
    it('it should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.collection.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id',()=>{
    it('should return todo doc',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                //i will get a todo object because in server.js in this route
                //i gave todo object as a response
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);            
    });
    it('should return a 404 if todo not found',(done)=>{
        var id=new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 on non-object ids',(done)=>{
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
        var id=todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(id);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.findById(id).then((todo)=>{
                    expect(todo).toBeNull();
                    done();
                    // if(!todo){
                    //     console.log('todo does not exist');
                    //     done();
                    // }
                }).catch((e)=> done(e));
            });
    });

    it('should return 404 if todo not found',(done)=>{
        var id=new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 on invalid ids',(done)=>{
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
    it('should update a todo',(done)=>{
        var id=todos[0]._id.toHexString();
        var text='this is new text';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed:true
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done)
    });

    it('should clear completedAt when todo is not completed',(done)=>{
        var id=todos[0]._id.toHexString();
        var text='this is new second text';
        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({
                text,
                completed:false
            })
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                //first toNotExist method was used but this method is no longer there
                //thus toBeNull was used in its place
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });
});

describe('GET /users/me',()=>{
    it('should return user it authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                //here we use toHexString method to convert the object id into a 
                //string value since value in url is gonna be a string
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users',()=>{
    it('should create a user',(done)=>{
        var email='example@example.com';
        var password='password';
    request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            //first toExist method was used but its no longer a method 
            //in its place toBeTruthy is now used  
            expect(res.header['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user)=>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password)
                done();
            }).catch((e)=> done(e));
        });
    });
    it('should return validation errors if request is invalid',(done)=>{
        request(app)
            .post('/users')
            .send({
                email:'KuchBhiMatlab',
                password:'passwordTest'
            })
            .expect(400)
            .end(done);
    });   
    it('should not create a user if email is already in use',(done)=>{
        request(app)
            .post('/users')
            .send({
                email:users[0].email,
                password:'passwordTest'
            })
            .expect(400)
            .end(done);
    }); 
});

describe('POST /users/login',()=>{
    it('should return a user',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body).toBeTruthy();
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    //here formerly toInclude method was used but since it no 
                    //longer exists, the new alias is toMtachObject
                    expect(user.tokens[0]).toMatchObject({
                        access:'auth',
                        token:res.header['x-auth']
                    });
                    done();
                }).catch((e)=> done(e));
            });
    });
    it('should reject invalid login',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password+'1'
        })
        .expect(400)
        .expect((res)=>{
            //in place of toNotExist
            expect(res.header['x-auth']).toBeUndefined();
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(0)
                done();
            }).catch((e)=> done(e));
        });
    });
});

describe('DELETE /users/me/token',()=>{
    it('should delete the token on logout',(done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=> done(e));
            });
    });
});