const express    = require("express");
const userRouter = express.Router();
const { check, validationResult } = require("express-validator");
// const { unique }                  = require("./../../services/helper");
// const { getUser, createNewUser, deleteUser, updateUser }  = require("./../../models/user/user.model");

//Get request for via session user / token / id.
userRouter.get("/:id", (req, res) => {
	const headers = req.headers;
	const params  = req.params;
	const id      = params.id || false;
	const auth    = headers['authorization'] || false;

	if (false === auth) {
		return res.status(403).json({
			success: false,
			message: "Base Authentication token not found in session. Please login first or add bearer token in request.",
			auth: auth,
		});
	}

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
    });
});

userRouter.post("/create", async (req, res, next) => {
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
		errors.filter(unique);
		return res.status(400).json({ errors: errors });
	}

	// Check if users exists.
    getUser( req.body ).then( ( result ) => {
        if ( true === result ) {
            return res.status(201).json({
                success: false,
                message: "User already exists."
            });
        } else {
            // Create new.
			createNewUser( req.body ).then( ( result ) => {
				return res.status(201).json(result);
			});
        }
    });
});

// Delete user.
userRouter.delete("/delete/:id", async (req, res) => {
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
    });
});

// Update user.
userRouter.put("/update/:id", async (req, res) => {
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