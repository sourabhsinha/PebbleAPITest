var sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
        user: 'testuser',
        password: 'Pebble123',
        server: 'test.database.windows',
        database: 'Pebble'
    });
 
    return conn;
};

module.exports = connect;