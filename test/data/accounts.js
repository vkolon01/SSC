var test_account_names = ["receptionisttest1","receptionisttest2","assistanttest1","assistanttest2","generaltest1","generaltest2"];
var user_test_accounts = {
    receptionist_test_account1: {
        username: test_account_names[0],
        password: '12345',
        password_confirm: '12345',
        role: 'receptionist',
        name: 'test test',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'receptionisttest1@hotmail.com',
        gender: 'male'
    },
    receptionist_test_account2: {
        username: test_account_names[1],
        password: '12345',
        password_confirm: '12345',
        role: 'receptionist',
        name: 'test test',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'receptionisttest2@hotmail.com',
        gender: 'male'
    },
    assistant_test_account1: {
        username: test_account_names[2],
        password: '12345',
        password_confirm: '12345',
        role: 'assistant_manager',
        name: 'test test',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'assistanttest1@hotmail.com',
        gender: 'male'
    },
    assistant_test_account2: {
        username: test_account_names[3],
        password: '12345',
        password_confirm: '12345',
        role: 'assistant_manager',
        name: 'test test',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'assistanttest2@hotmail.com',
        gender: 'male'
    },
    general_test_account1: {
        username: test_account_names[4],
        password: '12345',
        password_confirm: '12345',
        role: 'general_manager',
        name: 'test test',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'generaltest1@hotmail.com',
        gender: 'male'
    },
    general_test_account2: {
        username: test_account_names[5],
        password: '12345',
        password_confirm: '12345',
        role: 'general_manager',
        name: 'test test',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'generaltest2@hotmail.com',
        gender: 'male'
    }
};
var client_test_accounts = {
    client_account1:{
        name: 'Viktor Salabin',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'clienttest@hotmail.com',
        gender: 'male'
    }
};
var dentist_test_accounts = {
    dentist_account1:{
        name: 'Salena Salabina',
        phone_number: '12345',
        date_of_birth: new Date(),
        email: 'dentisttest@hotmail.com',
        gender: 'male'
    }
};

exports.dentist_test_accounts = dentist_test_accounts;
exports.client_test_accounts = client_test_accounts;
exports.user_test_accounts = user_test_accounts;
exports.test_account_names = test_account_names;
