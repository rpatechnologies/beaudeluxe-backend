var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});

connection.connect(function(error){
	if(error) {
		// console.log(error);
		console.log("Error while connecting to db");
	} else {
		console.log('Connected..!');
	}
});
 
module.exports = connection;
 
// connection.connect();
// connection.end();