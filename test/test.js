var dataController = require('../models/dataController');
var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
var expect = chai.expect;
var moment = require('moment');
var Promise = require('promise');
var request = require('supertest');
var mongoose = require('mongoose');
var rewire = require('rewire');

//test accounts..
var test_registration = require('./mock/test_register');
var user_test_accounts = require('./data/accounts').user_test_accounts;
var test_account_names = require('./data/accounts').test_account_names;
var client_test_accounts = require('./data/accounts').client_test_accounts;
var dentist_test_accounts = require('./data/accounts').dentist_test_accounts;
chai.use(chaiHttp);

describe('Unit Testing',function(){

});

describe('Integrated Testing',function(){

    //status codes
    const OK = 200,
        DENIED = 403,
        REDIRECT = 302;

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
                .expect(REDIRECT, done);
        });
        it('should redirect', function (done) {
            request(server)
                .get('/registration/bar')
                .expect(REDIRECT, done);
        });
        it('should authorize access',function(done){
            request(server)
                .get('/login')
                .expect(OK,done);
        });
        it('should deny access',function(done){
            request(server)
                .get('/registration')
                .expect(DENIED,done);
        });
    });

    describe('receptionist role testing',function(){
        var server;
        var agent;
        before(function(done){
            server = require('../server');
            agent = chai.request.agent(server);
            test_registration.register(user_test_accounts.receptionist_test_account1).then(function(response){
                agent
                    .post('/login')
                    .send({username: user_test_accounts.receptionist_test_account1.username,password: user_test_accounts.receptionist_test_account1.password})
                    .end(done)
            },function(err){
                console.log(err);
                throw err;
            });
        });
        after(function(done){
            request.agent(server).get('/home/logOut');
            delete_test_user_accounts(test_account_names).then(function(){
                server.close();
                done()
            });
        });

        describe('Account creation',function(){

            var customer_id;
            var dentist_id;

            it('should not allow receptionist registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_test_accounts.receptionist_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(DENIED);
                        done();
                    });
            });
            it('should not allow assistant manager registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_test_accounts.assistant_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(DENIED);
                        done();
                    });
            });
            it('should not allow general manager registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_test_accounts.general_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(DENIED);
                        done();
                    });
            });

            it('should create client',function(done){
                agent
                    .post('/client/registration/submit')
                    .send(client_test_accounts.client_account1)
                    .end(function(err,res){
                        expect(res).to.have.status(OK);
                        done();
                    })
            });

            it('should not create dentist',function(done){
                agent
                    .post('/dentist/registration')
                    .send(dentist_test_accounts.dentist_account1)
                    .end(function(err,res){
                        expect(res).to.have.status(DENIED);
                        done();
                    })
            });
        });
    });

    describe('general manager role testing',function(){
        var server,
            agent,
            client,
            dentist;

        before(function(done){
            server = require('../server');
            agent = chai.request.agent(server);
            test_registration.register(user_test_accounts.general_test_account1).then(function(response){
                agent
                    .post('/login')
                    .send({username: user_test_accounts.general_test_account1.username,password: user_test_accounts.general_test_account1.password})
                    .end(done)
            },function(err){
                console.log(err);
                throw err;
            });
        });
        after(function(done){

            //dataController.delete_client(client.id);
            //dataController.delete_dentist(dentist.id);

            agent
                .post('/dentist/delete')
                .send({dentist_id: dentist.id})
                .end(function(err,res){
                });
            agent
                .post('/clients/delete')
                .send({client_id:client.id})
                .end(function(err,res){
                });
            delete_test_user_accounts(test_account_names).then(function(){
                server.close();
            });
            setTimeout(function(){
                request.agent(server).get('/home/logOut');
                done()
            },100);
        });

        describe('Account creation',function(){

            it('should allow receptionist registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_test_accounts.receptionist_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(OK);
                        done();
                    });
            });
            it('should allow assistant manager registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_test_accounts.assistant_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(OK);
                        done();
                    });
            });
            it('should not allow general manager registration',function(done){
                agent
                    .post('/registration/submit')
                    .send(user_test_accounts.general_test_account2)
                    .end(function(err,res){
                        expect(res).to.have.status(DENIED);
                        done();
                    });
            });

            it('should create client',function(done){
                agent
                    .post('/clients/registration/submit')
                    .send(client_test_accounts.client_account1)
                    .end(function(err,res){
                        expect(res).to.have.status(OK);

                        //keeping client data for further use
                        dataController.find_client_by_email(client_test_accounts.client_account1.email).then(function(account){
                            client = account;
                            done();
                        },function(err){
                            console.log(err);
                            done();
                        });
                    })
            });

            it('should create dentist',function(done){
                agent
                    .post('/dentist/registration')
                    .send(dentist_test_accounts.dentist_account1)
                    .end(function(err,res){
                        expect(res).to.have.status(OK);

                        //keeping dentist data for further use
                        dataController.find_dentist_by_email(dentist_test_accounts.dentist_account1.email).then(function(account){
                            dentist = account;
                            done();
                        },function(err){
                            console.log(err);
                            done();
                        });
                    })
            });
            describe('appointments',function(){
                var appointment_1,
                    appointment_2, //should overlap with appointment_1
                    appointment_3, //should overlap with appointment_1
                    appointment_4,
                    appointment_5;
                before(function(done){
                    appointment_1 = {
                        time_slot: 30,
                        available_day: 'Mon 08/05/17',
                        available_time:'00:00',
                        client_id: client.id,
                        dentist_id: dentist.id
                    };
                    appointment_2 = {
                        time_slot: 30,
                        available_day: 'Mon 08/05/17',
                        available_time:'00:15',
                        client_id: client.id,
                        dentist_id: dentist.id
                    };
                    appointment_3 = {
                        time_slot: 30,
                        available_day: 'Mon 07/05/17',
                        available_time:'23:45',
                        client_id: client.id,
                        dentist_id: dentist.id
                    };
                    appointment_4 = {
                        time_slot: 30,
                        available_day: 'Mon 07/05/17',
                        available_time:'23:30',
                        client_id: client.id,
                        dentist_id: dentist.id
                    };
                    appointment_5 = {
                        time_slot: 30,
                        available_day: 'Mon 07/05/17',
                        available_time:'00:30',
                        client_id: client.id,
                        dentist_id: dentist.id
                    };
                    done();
                });

                it('should create appointment',function(done){

                    agent
                        .post('/appointments/create_appointment')
                        .send(appointment_1)
                        .end(function(err,res){
                            expect(res.body.booked).to.be.true;
                            done();
                        })
                });
                it('should overlap 1',function(done){

                    agent
                        .post('/appointments/create_appointment')
                        .send(appointment_1)
                        .end(function(err,res){
                            expect(res.body.booked).to.be.false;
                            done();
                        })
                });
                it('should overlap 2',function(done){

                    agent
                        .post('/appointments/create_appointment')
                        .send(appointment_2)
                        .end(function(err,res){
                            expect(res.body.booked).to.be.false;
                            done();
                        })
                });
                it('should overlap 3',function(done){

                    agent
                        .post('/appointments/create_appointment')
                        .send(appointment_3)
                        .end(function(err,res){
                            expect(res.body.booked).to.be.false;
                            done();
                        })
                });
                it('should overlap 4',function(done){

                    agent
                        .post('/appointments/create_appointment')
                        .send(appointment_4)
                        .end(function(err,res){
                            expect(res.body.booked).to.be.true;
                            done();
                        })
                });
                it('should overlap 5',function(done){

                    agent
                        .post('/appointments/create_appointment')
                        .send(appointment_5)
                        .end(function(err,res){
                            expect(res.body.booked).to.be.true;
                            done();
                        })
                });
            });


        });
    });
});




/*
Deletes all the accounts that are used for testing.
 */
function delete_test_user_accounts(accounts){
    return new Promise(function(fulfill,reject){
        accounts.forEach(function(account){
            dataController.delete_by_username(account).then(function(user){},
                function(err){
                    reject(err);
                });
        });
        setTimeout(function(){fulfill()},200);
    });
}


/*describe('appointment testing',function(){
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
 delete_all_test_accounts({login_user:login_user,client_account: client_account});
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
 */
