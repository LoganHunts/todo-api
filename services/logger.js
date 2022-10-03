const fs = require("fs");

async function doLog(filename, err) {
	if ( "string" !== typeof filename ) {
		console.error("File name not appropiate");
		return;
	}
	if ( "object" !== typeof err ) {
		console.error("Error Object not appropiate");
		return;
	}

    let dir = './logs';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    let path = dir + '/' + filename + '.log';

    if (!fs.existsSync(path)){
        fs.writeFile( path, '', function (err) {
            if (err) throw err;
        });
    }

	let date_ob = new Date();
	let date    = ("0" + date_ob.getDate()).slice(-2);
	let month   = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year    = date_ob.getFullYear();
	let hours   = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	parsedError = [ year, month, date ].join('-') + ' ' + [ hours, minutes, seconds, err.message ].join(':') + "\n";
	fs.appendFile(path, parsedError, function (err) {
		if (err) throw err;
		console.log( "Error Occured please check " + filename + ".log file!" );
	});
}

async function doSuccessLog(filename, msg) {
	if ( "string" !== typeof filename ) {
		console.error("File name not appropiate");
		return;
	}
	if ( "string" !== typeof msg ) {
		console.error("Message not appropiate");
		return;
	}

    let dir = './logs';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    let path = dir + '/' + filename + '.log';

    if (!fs.existsSync(path)){
        fs.writeFile( path, '', function (err) {
            if (err) throw err;
        });
    }

	let date_ob = new Date();
	let date    = ("0" + date_ob.getDate()).slice(-2);
	let month   = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year    = date_ob.getFullYear();
	let hours   = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	parsedMessage = [ year, month, date ].join('-') + ' ' + [ hours, minutes, seconds, msg ].join(':') + "\n";
	fs.appendFile(path, parsedMessage, function (err) {
		if (err) throw err;
	});
}


module.exports = {
	doLog,
	doSuccessLog
};
