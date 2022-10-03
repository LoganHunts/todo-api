const express          = require( 'express' );
const authRouter       = express.Router();
const { getUser }      = require("./../../models/user/user.model");
const { createJwtToken }  = require("./../../../services/helper");

authRouter.post( '/', ( req, res ) => {
    const query = req.query;
    if( typeof query.username == 'undefined' || typeof query.password == 'undefined' || query.username.length <= 0 || query.password.length <= 0 ) {
        return res.status(403).json({
            success : false,
            message: 'Username and password are required.',
        });
    }

	getUser( query, 'object' ).then( ( result ) => {

        let isValidUser = false;
        if( result.password == query.password ) {
            isValidUser = true;
        }

        if ( true === isValidUser ) {

            data = {
                id : result._id.toString()
            };

            createJwtToken( data ).then( (jwtResult) => {
                return res.status(200).json({
                    success : true,
                    message : "User found.",
                    token   : jwtResult,
                });
            });

        } else {
            return res.status(201).json({
                success: false,
                message: "Check your credentials again."
            });
        }
    }).catch( (err) => {
		return res.status(500).json({
			success: false,
			message: err.message
		});
	});
});

module.exports = authRouter;