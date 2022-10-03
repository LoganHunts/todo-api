const express    = require("express");
const userRouter = express.Router();
const { check, validationResult } = require("express-validator");
const { getUser, createNewUser, deleteUser, updateUser }  = require("./../../models/user/user.model");

//Get request for via session user / token / id.
userRouter.get("/:id", (req, res) => {
	const params  = req.params;
	const id      = params.id || false;

	if( !id ) {
		return res.status(200).json({
			success: false,
			message: "User not found",
		});	
	}

	getUser( params, 'object' ).then( ( result ) => {
        if ( result ) {
            return res.status(200).json({
                success: true,
                message: "User found.",
				user : result
            });
        } else {
            // Create new.
            return res.status(201).json({
                success: false,
                message: "User not Found."
            });
        }
    }).catch( (err) => {
		return res.status(500).json({
			success: false,
			message: err.message
		});
	} );
});

userRouter.post("/", async (req, res, next) => {
	await check("email").exists().isEmail().bail().run(req);
	await check("password").isLength({ min: 7 }).run(req);

	// Schema check.
	const result = validationResult(req);
	if (!result.isEmpty()) {
		let errors = [];
		errors = result.array().map((current, accumulator) => {
			delete current.value;
			delete current.location;
			return current;
		});
		return res.status(400).json({ errors: errors });
	}

	// Check if users exists.
    getUser( req.body ).then( async ( result ) => {
        if ( true === result ) {
            return res.status(201).json({
                success: false,
                message: "User already exists."
            });
        } else {
            // Create new.
			let result = await createNewUser( req.body ).then( ( result ) => {
				return res.status(200).json(result);
			}).catch( (err) => {
				return res.status(500).json({
					success: false,
					message: err.message
				});
			});
        }
    }).catch( (err) => {
		return res.status(500).json({
			success: false,
			message: err.message
		});
	});
});

// Delete user.
userRouter.delete("/:id", async (req, res) => {
	const params = req.params;
	await check("id").exists().run(params);
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}

	deleteUser( params ).then( ( result ) => {
        if ( result ) {
            return res.status(200).json({
				success: true,
				message: "User delete successfully",
				id: params.id,
            });
        } else {
            // Create new.
            return res.status(201).json({
                success: false,
                message: "User deletion Failed."
            });
        }
    }).catch( (err) => {
		return res.status(500).json({
			success: false,
			message: err.message
		});
	} );
});

// Update user.
userRouter.put("/:id", async (req, res) => {
	const params = req.params;
	const body   = req.body;
	await check('id').exists().run(params);
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}

	updateUser( params, body ).then( ( result ) => {
        if ( result ) {
            return res.status(200).json({
				success: true,
				message: "User updated successfully",
				id: params.id,
            });
        } else {
            // Create new.
            return res.status(201).json({
                success: false,
                message: "User updation Failed."
            });
        }
    });
});

module.exports = userRouter;