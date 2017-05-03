var AccessControl = require('accesscontrol'),
    ac = new AccessControl();

var roles = ['guest','receptionist','assistant_manager','general_manager','admin'],
    errors ={
        create_account: 'You don\'t have authorization to create this account',
        delete_account: 'You don\'t have authorization to delete this account',
        read_page: 'You don\'t have authorization to view this page.',
        other: 'You don\'t have authorization to perform this action'
    };
ac.grant('receptionist')
    .readAny('client')
    .readAny('dentist')
    .updateAny('client')
    .createAny('client')
.grant('assistant_manager')
    .extend('receptionist')
    .readAny('registration')
    .updateAny('dentist')
    .createAny('receptionist')
    .createAny('dentist')
    .deleteAny('client')
.grant('general_manager')
    .extend('assistant_manager')
    .extend('receptionist')
    .readAny('settings')
    .createAny('assistant_manager')
    .deleteAny('dentist')
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