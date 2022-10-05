const express    = require( 'express' );
const jwt        = require( 'jsonwebtoken' );
const api        = express.Router();
const authRouter = require( './auth/auth.router' );
const userRouter = require( './user/user.router' );
const todoRouter = require( './todo/todo.router' );
require( 'dotenv' ).config();
const APP_SECRET = process.env.APP_SECRET;

api.use( '/auth', authRouter ); // login the user.
api.use( '/user', userRouter);  // crud users.

api.use( '/todo', ( req,res, next ) => {
    if( 'undefined' != typeof req.headers['authorization'] ) {
        let token    = req.headers['authorization'].replace( 'Bearer ', '' );
        // Verify token.
        try {
            jwt.verify(token, APP_SECRET);
        } catch (error) {
            return res.status(403).json({
                success : false,
                message: 'Login Token is not verified. Please send valid authorization headers',
            });
        }
        next();
    } else {
        return res.status(403).json({
            success : false,
            message: 'Login Token Required. Please send valid authorization headers',
        });
    }
});

api.use( '/todo', todoRouter);  // crud todo.
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