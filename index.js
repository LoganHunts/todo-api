require( 'dotenv' ).config();
const http          =  require( 'http' );
const { doLog, doSuccessLog }     = require( './services/logger' );
const { dbConnect,createRoleCollection, createAdminUser } = require( './services/db' );
const app           = require( './src/app' );
const PORT          = process.env.PORT || 8000;
const server        = http.createServer( app );
async function serverStart() {
    await dbConnect().then( async () => {
        return await createRoleCollection().then(( roleCreated ) => {
            if( roleCreated ) {
                doSuccessLog( 'success-setup', 'Role Created Successfully' );
                return createAdminUser();
            } else {
                let err = new Error( 'Role Creation Failed' );
                doLog( 'exception', err );
            }
        })
        .then( ( adminCreated ) => {
            if( adminCreated ) {
                doSuccessLog( 'success-setup', 'Admin Created Successfully. Initial process completed.' );
            } else {
                let err = new Error( 'Admin Creation Failed' );
                doLog( 'exception', err );
            }
            server.listen( PORT, () => {
                console.log( `Server listening on port ${PORT}...` );
            });
        });
    }).catch( ( error ) => {
        doLog( 'exception', error );
    });
}
serverStart();