var AccessControl = require('accesscontrol'),
    ac = new AccessControl();

var roles = ['guest','receptionist','assistant_manager','general_manager','admin'],
    errors ={
        create_account: 'You don\'t have authorization to create this account',
        read_page: 'You don\'t have authorization to view this page.'
    };
ac.grant('receptionist')
    .readAny('customer')
    .readAny('dentist')
    .createAny('customer')
.grant('assistant_manager')
    .extend('receptionist')
    .deleteAny('customer')
    .createAny('receptionist')
    .readAny('registration')
    .createAny('dentist')
.grant('general_manager')
    .extend('assistant_manager')
    .extend('receptionist')
    .createAny('assistant_manager')
.grant('admin')
    .extend('assistant_manager')
    .extend('receptionist')
    .extend('general_manager')
    .createAny('general_manager')
    .grant('guest')
    .readAny('login');

exports.errors = errors;
exports.ac = ac;
exports.roles = roles;