var AccessControl = require('accesscontrol');

var ac = new AccessControl();

ac.grant('receptionist')
    .readAny('customer')
    .createAny('customer')
.grant('assistant_manager')
    .extend('receptionist')
    .deleteAny('customer')
    .createAny('receptionist')
    .readAny('registration')
.grant('general_manager')
    .extend('assistant_manager')
    .extend('receptionist')
    .createAny('assistant_manager')
.grant('admin')
    .extend('assistant_manager')
    .extend('receptionist')
    .extend('general_manager')
    .createAny('general_manager');

exports.ac = ac;