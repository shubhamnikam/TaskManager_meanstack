const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const mongoDBConnString = "REPLACE_YOUR_CONN_STRING_WITH_DB_NAME"; 
mongoose
	.connect(mongoDBConnString)
	.then(() => {
		console.log("mongo db connected");
	})
	.catch((err) => {
		console.error(err);
	});

module.exports = mongoose
