const mongoose       = require( 'mongoose' );
const fs             = require( 'fs' );
const { createAll }  = require( './../src/models/role-resource/role.model' );
const { createAdmin }  = require( './../src/models/user/user.model' );
require( 'dotenv' ).config();

const DB_URL = process.env.DB_CONNECTION_STRING;
mongoose.connection.once( 'open', () => {
    console.log( 'Connected to MongoDb' );
});

async function dbConnect() {
    await mongoose.connect(DB_URL);
}

async function dbDisconnect() {
    await mongoose.disconnect();
}

async function createAdminUser() {
    let path = './data-dumps/users.json';
    if (fs.existsSync(path)){
        fs.readFile(path, null, ( err, data ) => {
            if (err) throw err;
            // Converting to JSON
            let parsedJson = JSON.parse(data);
            createAdmin( parsedJson );
        });

        return true;
    }

    return false;
}

async function createRoleCollection() {
    let path = './data-dumps/role-resources.json';
    if (fs.existsSync(path)){
        fs.readFile(path, null, ( err, data ) => {
            if (err) throw err;
            // Converting to JSON
            let parsedJson = JSON.parse(data);
            createAll( parsedJson );
        });

        return true;
    }

    return false;
}

module.exports = {
    dbConnect,
    dbDisconnect,
    createRoleCollection,
    createAdminUser,
}