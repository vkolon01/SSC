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

    describe('routing',function(){
        var server;
        beforeEach(function(){
            server = require('../server');
        });
        afterEach(function(){
            server.close();
        });
        it('should redirect to login', function (done) {
            request(server)
                .get('/')
                .expect(REDIRECT, done);
        });
        it('should redirect to login', function (done) {
            request(server)
                .get('/registration/bar')
                .expect(REDIRECT, done);
        });
        it('should authorize access to login page',function(done){
            request(server)
                .get('/login')
                .expect(OK,done);
        });
        it('should deny access to registration page',function(done){
            request(server)
                .get('/registration')
                .expect(DENIED,done);
        });
        it('should deny access to dentist page',function(done){
            request(server)
                .get('/dentist')
                .expect(DENIED,done);
        });
        it('should deny access to client page',function(done){
            request(server)
                .get('/clients')
                .expect(DENIED,done);
        });
    });

    describe('role testing',function(){
        describe('receptionist',function(){
            var server,
                agent,
                client,
                dentist;


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
                if(dentist){
                    agent
                        .post('/dentist/delete')
                        .send({dentist_id: dentist.id})
                        .end()
                }
                if(client){
                    agent
                        .post('/clients/delete')
                        .send({client_id:client.id})
                        .end()
                }

                delete_test_user_accounts(test_account_names).then(function(){
                    server.close();
                });
                setTimeout(function(){
                    request.agent(server).get('/home/logOut');
                    done()
                },200);
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
                            dataController.find_client_by_email(client_test_accounts.client_account1.email).then(function(account){
                                client = account;
                                done();
                            },function(err){
                                console.log(err);
                                done();
                            });
                        });

                });

                it('should not create dentist',function(done){
                    agent
                        .post('/dentist/registration')
                        .send(dentist_test_accounts.dentist_account1)
                        .end(function(err,res){
                            expect(res).to.have.status(DENIED);
                            dataController.find_dentist_by_email(dentist_test_accounts.dentist_account1.email).then(function(account){
                                dentist = account;
                                done();
                            },function(err){
                                done();
                            });
                        });
                });
            });
        });

        describe('general manager',function(){
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
                        .end(function(err,res){
                            done()
                        })
                },function(err){
                    console.log(err);
                    throw err;
                });
            });
            after(function(done){

                if(dentist){
                    agent
                        .post('/dentist/delete')
                        .send({dentist_id: dentist.id})
                        .end()
                }
                if(client){
                    agent
                        .post('/clients/delete')
                        .send({client_id:client.id})
                        .end()
                }
                delete_test_user_accounts(test_account_names).then(function(){
                    server.close();
                });
                setTimeout(function(){
                    request.agent(server).get('/home/logOut');
                    done()
                },200);
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
                            available_day: 'Mon 08/05/17',
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
                    it('should not overlap 1',function(done){

                        agent
                            .post('/appointments/create_appointment')
                            .send(appointment_4)
                            .end(function(err,res){
                                expect(res.body.booked).to.be.true;
                                done();
                            })
                    });
                    it('should not overlap 1',function(done){

                        agent
                            .post('/appointments/create_appointment')
                            .send(appointment_5)
                            .end(function(err,res){
                                expect(res.body.booked).to.be.true;
                                done();
                            })
                    });
                    it('should return 3 booked appointments with correct times',function(done){

                        dataController.get_appointments(dentist.id).then(function(list){
                            if(list && list.length == 3){
                                var case_1 = moment(appointment_1.available_day + ' ' + appointment_1.available_time,'DD/MM/YY HH:mm').format('DD/MM/YY HH:mm') == moment(list[0].start).utc().format('DD/MM/YY HH:mm');
                                var case_2 = moment(appointment_4.available_day + ' ' + appointment_4.available_time,'DD/MM/YY HH:mm').format('DD/MM/YY HH:mm') == moment(list[1].start).utc().format('DD/MM/YY HH:mm');
                                var case_3 = moment(appointment_5.available_day + ' ' + appointment_5.available_time,'DD/MM/YY HH:mm').format('DD/MM/YY HH:mm') == moment(list[2].start).utc().format('DD/MM/YY HH:mm');
                                if(case_1 && case_2 && case_3){
                                    expect(true).to.be.true;
                                    done();
                                }else{
                                    expect.fail();
                                }
                            }else{
                                expect.fail();
                                done();
                        }
                        },function(err){
                            if(err) console.error(err);
                        })

                    });
                });

                /*
                describe('stress testing',function(){
                    var counter = 0;
                    function send_request(){
                        return new Promise(function(resolve){
                            agent
                                .post('/registration/submit')
                                .send(user_test_accounts.receptionist_test_account2)
                                .end(function(err,res){
                                    console.log(counter);
                                    if(counter++ < 100){
                                        if(res.statusCode == 200){
                                            send_request().then(function(result){
                                                resolve(result);
                                            })
                                        }else{
                                            resolve(false)
                                        }

                                    }else{
                                        resolve(true)
                                    }
                                })
                        });

                    }

                    it('log in stress',function(done){
                        this.timeout(5000);
                        send_request().then(function(result){
                            expect(result).to.be.true;
                            done();
                        });

                    });
                });
                */
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