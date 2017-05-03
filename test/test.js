var dataController = require('../models/dataController');
var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
var expect = chai.expect;
var request = require('supertest');
var mongoose = require('mongoose');
var test_registration = require('./mock/test_register');
var user_accounts = require('./data/accounts');

chai.use(chaiHttp);
describe('loading routes',function(){
   var server;
    beforeEach(function(){
        server = require('../server');
    });
    afterEach(function(){
        server.close();
    });
    it('should redirect', function (done) {
        request(server)
            .get('/')
            .expect(302, done);
    });
    it('should redirect', function (done) {
        request(server)
            .get('/registration/bar')
            .expect(302, done);
    });
    it('should authorize access',function(done){
        request(server)
            .get('/login')
            .expect(200,done);
    });
    it('should not authorize access',function(done){
       request(server)
           .get('/registration')
           .expect(403,done);
    });
});

describe('actions as receptionist',function(){
    var server;
    var agent;
    before(function(done){
        server = require('../server');
        agent = chai.request.agent(server);
        test_registration.register(user_accounts.receptionist_test_account1).then(function(response){
            agent
                .post('/login')
                .send({username: user_accounts.receptionist_test_account1.username,password: user_accounts.receptionist_test_account1.password})
                .end(done)
        },function(err){
                console.log(err);
                throw err;
        });
    });
    after(function(done){
        dataController.delete_by_username(user_accounts.receptionist_test_account1.username);
        dataController.delete_by_username(user_accounts.receptionist_test_account2.username);
        dataController.delete_by_username(user_accounts.assistant_test_account2.username);
        dataController.delete_by_username(user_accounts.general_test_account2.username);
        request.agent(server).get('/home/logOut');
        server.close();
        done()
    });
    it('should not allow receptionist registration',function(done){
        agent
            .post('/registration/submit')
            .send(user_accounts.receptionist_test_account2)
            .end(function(err,res){
                expect(res).to.have.status(403);
                done();
            });
    });
    it('should not allow assistant manager registration',function(done){
        agent
            .post('/registration/submit')
            .send(user_accounts.assistant_test_account2)
            .end(function(err,res){
                expect(res).to.have.status(403);
                done();
            });
    });
    it('should not allow general manager registration',function(done){
        agent
            .post('/registration/submit')
            .send(user_accounts.general_test_account2)
            .end(function(err,res){
                expect(res).to.have.status(403);
                done();
            });
    });
    it('should allow visit the pages',function(done){
        agent
            .get('/customers').then(function(res){
                expect(res).to.have.status(200);
                done()
            })
    })
});

describe('data access testing',function(){

    describe('system access as receptionist',function(){
        var server;
        var agent;
        before(function(done){
            server = require('../server');
            agent = chai.request.agent(server);
            test_registration.register(user_accounts.receptionist_test_account1).then(function(response){
                agent
                    .post('/login')
                    .send({username: user_accounts.receptionist_test_account1.username,password: user_accounts.receptionist_test_account1.password})
                    .end(done)
            },function(err){
                console.log(err);
                throw err;
            });
        });
        after(function(done){
            dataController.delete_by_username(user_accounts.receptionist_test_account1.username);
            dataController.delete_by_username(user_accounts.receptionist_test_account2.username);
            dataController.delete_by_username(user_accounts.assistant_test_account2.username);
            dataController.delete_by_username(user_accounts.general_test_account2.username);
            request.agent(server).get('/home/logOut');
            server.close();
            done()
        });
        it('should not allow receptionist registration',function(done){
            agent
                .post('/registration/submit')
                .send(user_accounts.receptionist_test_account2)
                .end(function(err,res){
                    expect(res).to.have.status(403);
                    done();
                });
        });
        it('should not allow assistant manager registration',function(done){
            agent
                .post('/registration/submit')
                .send(user_accounts.assistant_test_account2)
                .end(function(err,res){
                    expect(res).to.have.status(403);
                    done();
                });
        });
        it('should not allow general manager registration',function(done){
            agent
                .post('/registration/submit')
                .send(user_accounts.general_test_account2)
                .end(function(err,res){
                    expect(res).to.have.status(403);
                    done();
                });
        });
        it('should allow visit the pages',function(done){
            agent
                .get('/customers').then(function(res){
                expect(res).to.have.status(200);
                done()
            })

        })

    });

    describe('system access as assistant manager',function(){
            var server;
            var agent;
            before(function(done){
                server = require('../server');
                agent = chai.request.agent(server);
                test_registration.register(user_accounts.assistant_test_account1).then(function(response){
                    agent
                        .post('/login')
                        .send({username: user_accounts.assistant_test_account1.username,password: user_accounts.assistant_test_account1.password})
                        .end(done)
                },function(err){
                    console.log(err);
                    throw err;
                });
            });
            after(function(done){
                dataController.delete_by_username(user_accounts.assistant_test_account1.username);
                dataController.delete_by_username(user_accounts.receptionist_test_account2.username);
                dataController.delete_by_username(user_accounts.assistant_test_account2.username);
                dataController.delete_by_username(user_accounts.general_test_account2.username);
                request.agent(server).get('/home/logOut');
                server.close();
                done()
            });
            it('should allow receptionist registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_accounts.receptionist_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(200);
                        done();
                    });
            });
            it('should not allow assistant manager registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_accounts.assistant_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(403);
                        done();
                    });
            });
            it('should not allow general manager registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_accounts.general_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(403);
                        done();
                    });
            });
            it('should allow visit the pages',function(done){
                agent
                    .get('/customers').then(function(res){
                    expect(res).to.have.status(200);
                    done()
                })

            })
        });
    describe('system access as general manager',function(){
        var server;
        var agent;
        before(function(done){
            server = require('../server');
            agent = chai.request.agent(server);
            test_registration.register(user_accounts.general_test_account1).then(function(response){
                agent
                    .post('/login')
                    .send({username: user_accounts.general_test_account1.username,password: user_accounts.general_test_account1.password})
                    .end(done)
            },function(err){
                console.log(err);
                throw err;
            });
        });
        after(function(done){
            delete_all_accounts({gm1:user_accounts.general_test_account1.username,am2:user_accounts.assistant_test_account2.username, gm2: user_accounts.general_test_account2.username, re2: user_accounts.receptionist_test_account2.username});
            request.agent(server).get('/home/logOut');
            server.close();
            done()
        });
        it('should allow receptionist registration',function(done){
            agent
                .post('/registration/submit')
                .send(user_accounts.receptionist_test_account2)
                .end(function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it('should not allow assistant manager registration',function(done){
            agent
                .post('/registration/submit')
                .send(user_accounts.assistant_test_account2)
                .end(function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it('should not allow general manager registration',function(done){
            agent
                .post('/registration/submit')
                .send(user_accounts.general_test_account2)
                .end(function(err,res){
                    expect(res).to.have.status(403);
                    done();
                });
        });
        it('should allow visit the pages',function(done){
            agent
                .get('/customers').then(function(res){
                expect(res).to.have.status(200);
                done()
            })

        })
    });
});

describe('appointment testing',function(){
    var server;
    var agent;
    var login_user;
    var client_account;
    before(function(done){
        server = require('../server');
        agent = chai.request.agent(server);
        test_registration.register(user_accounts.assistant_test_account1).then(function(user){
            login_user = user;
            agent
                .post('/login')
                .send({username: user_accounts.assistant_test_account1.username,password: user_accounts.assistant_test_account1.password})
                .end(done)
        },function(err){
            throw err;
        });
    });
    after(function(done){
        request.agent(server).get('/home/logout');
        delete_all_accounts({login_user:login_user,client_account: client_account});
        done()
    });

    it('should create client',function(done){
        agent
            .post('/clients/registration/submit')
            .send(user_accounts.client_account1)
            .end(function(err,res){
                dataController.find_client_by_email(user_accounts.client_account1.email).then(function(client){
                    expect(client.account_info.name).to.equal(user_accounts.client_account1.name);
                    client_account = client;
                    done();
                })
            })
    })
});


function delete_all_accounts(accounts){
    accounts.forEach(function(account){
        console.log(account);
        var role = account.role;
        if(role == 'Client'){
            dataController.delete_client(account._id);
        }
        if(role == 'receptionist' || role == 'assistant_manager' || role == 'general_manager' || role == 'administrator'){
            dataController.delete_by_username(account.username);
        }
        if(role == 'dentist'){
            dataController.delete_dentist(account._id);
        }
    });
};
