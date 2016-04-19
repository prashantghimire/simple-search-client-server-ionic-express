var mysql = require("mysql");

function Database(){

	this.pool = null;

	this.init =function(){
		this.pool = mysql.createPool({
			connectionLimit: 10,
			host: 'localhost',
			user: 'root',
			password: 'lab99b', 
			database: 'web_apps'  
		});
	};
	
	this.acquire = function(callback){
		this.pool.getConnection(function(err, connection){
			callback(err, connection);
		});
	};
}
module.exports = new Database();