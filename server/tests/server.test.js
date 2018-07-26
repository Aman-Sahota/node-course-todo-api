const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const app=require('./../server');
const Todo=require('./../models/todo');

const todos=[{
    _id:new ObjectID(),
    text:'First test Todo'
},{
    _id:new ObjectID(),
    text:'Second test Todo',
    completedAt:333
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());
});

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
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });
});