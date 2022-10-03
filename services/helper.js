const jwt = require( 'jsonwebtoken' );
require( 'dotenv' ).config();
const APP_SECRET = process.env.APP_SECRET;
const createJwtToken = async ( data ) => {
    let token = await jwt.sign(data, APP_SECRET, { expiresIn: 60 * 60 });
    return token;
}

module.exports = {createJwtToken};