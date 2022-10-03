const express    = require( 'express' );
const api        = express.Router();
const authRouter = require( './auth/auth.router' );
const userRouter = require( './user/user.router' );

api.use( '/auth', authRouter ); // login the user.
api.use( '/user', userRouter);  // crud users.
api.use( '/', ( req,res, next ) => {
    if ( '/' === req.url ) {
        return res.status(200).json({
            success : true,
            message: 'Nothing much here. Use documentation https://documenter.getpostman.com/view/23403874/2s7YmriR5z for perfom more.',
        });
    } else {
        next();
    }
});

module.exports = api;