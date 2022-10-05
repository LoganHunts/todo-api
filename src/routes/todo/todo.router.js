const express                     = require( 'express' );
const jwt                         = require( 'jsonwebtoken' );
const todoRouter                  = express.Router();
const { check, validationResult, body } = require("express-validator");
require( 'dotenv' ).config();
const APP_SECRET = process.env.APP_SECRET;
const { getList,
    createList,
    updateList,
    deleteList }  = require("./../../models/todo-lists/todo-list.model");

//Get request for via token.
todoRouter.get('/', async (req, res) => {
    let token     = req.headers['authorization'].replace( 'Bearer ', '' );
    let userId    = '';
    // Verify token.
    try {
        let data = await jwt.verify(token, APP_SECRET);
        userId = data.id;
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: 'Login Token is not verified. Please send valid authorization headers',
        });
    }

    let query = {
        user_id : userId || false
    }

	getList( query, 'object' ).then( ( result ) => {
        if ( result.length ) {
            return res.status(200).json({
                success: true,
                message: "All Todo List fetched for this user.",
                lists : result
            });
        } else {
            // Create new.
            return res.status(201).json({
                success: true,
                message: "No Todo Lists Found for this user."
            });
        }
    }).catch( (err) => {
		return res.status(500).json({
			success: false,
			message: err.message
		});
	} );
});

todoRouter.post("/", async (req, res, next) => {
	await check("title").exists().run(req);

	// Schema check.
	const result = validationResult(req);
	if (!result.isEmpty()) {
		let errors = [];
		errors = result.array().map((current, accumulator) => {
			delete current.value;
			delete current.location;
			return current;
		});
		return res.status(400).json({
            success : false,
            errors: errors
        });
	}

    let token     = req.headers['authorization'].replace( 'Bearer ', '' );
    let userId    = '';
    // Verify token.
    try {
        let data = await jwt.verify(token, APP_SECRET);
        userId = data.id;
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: 'Login Token is not verified. Please send valid authorization headers',
        });
    }

    let body = req.body;
    body.user_id = userId;

    // Create new.
    await createList( body ).then( ( result ) => {
        if( result.success ) return res.status(200).json(result);
        else  return res.status(403).json(result);
    }).catch( (err) => {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    });
});

// Delete todo.
todoRouter.delete("/:id", async (req, res) => {
	const params = req.params;
	await check("id").exists().run(params);
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}

	deleteList( params ).then( ( result ) => {
        if ( result ) {
            return res.status(200).json({
				success: true,
				message: "Todo List delete successfully",
				id: params.id,
            });
        } else {
            return res.status(201).json({
                success: false,
                message: "Todo List deletion Failed."
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
todoRouter.put("/:id", async (req, res) => {
	const params = req.params;
	const body   = req.body;
	await check('id').exists().run(params);
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).json({ errors: result.array() });
	}

	updateList( { 'id' : params.id }, body ).then( ( result ) => {
        if ( result ) {
            return res.status(200).json({
				success: true,
				message: "Todo updated successfully",
				id: params.id,
            });
        } else {
            // Create new.
            return res.status(201).json({
                success: false,
                message: "Todo updation Failed."
            });
        }
    });
});


module.exports = todoRouter;