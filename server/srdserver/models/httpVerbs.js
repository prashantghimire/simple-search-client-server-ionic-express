var database = require('../database');
var mysql = require('mysql');
function HttpVerb(){
	this.get = function(table, res){
		
		database.acquire(function(err,con){
			
			var sql = "SELECT * FROM ??";
			var inserts = [table];
			var query = mysql.format(sql, inserts);

			con.query(query,function(err, rows, fields){
				if(err){
					if(err.code === "ER_NO_SUCH_TABLE"){
						res.send({"error":"No such table."});
					} else {
						res.send({"error":"Cannot fetch API data."});
					}
					return;
				}
				
				var fields = rows[0];
				fields[Object.keys(fields)[0]] = "id";


				var good_fields = [];
				for(var f in fields){
					good_fields.push(String(fields[f]).toLowerCase());
				}

				var datatypes = rows[1];

				var good_datatypes = [];
				for(var key in datatypes){
					good_datatypes.push(String(datatypes[key]).toLowerCase());
				}
				good_datatypes[0] = "id";

				var data = rows.splice(2, rows.length);

				var response = [];

				for(var i = 0 ; i < data.length; i++){
					var item = data[i];
					var processed = {};
					processed["id"] = item[Object.keys(fields)[0]];

					for(var f = 1; f < good_fields.length; f++){
						processed[good_fields[f]] = {"value":item[Object.keys(item)[f]] , "data_type": good_datatypes[f]};
					}
					response.push(processed);
				}

				res.send(response);

			});


    	});
  	};
 }
 module.exports = new HttpVerb();