var app = require('./app'),
    reload = require('reload');

var server = app.listen(app.get('port'),function(){
    console.log('listening on port ' + app.get('port'))
});

reload(server,app);

module.exports = server;