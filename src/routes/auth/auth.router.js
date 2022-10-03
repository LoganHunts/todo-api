const express    = require( 'express' );
const authRouter = express.Router();

authRouter.post( '/login', ( req, res ) => {
    const body = req.body;
    return res.status(200).json({
        success : true,
        message: 'login',
        body : body
    });
});

authRouter.post('/logout',(req,res) => {
    req.session.destroy();
    res.status(200).json({
        success : true,
        message: 'User Logged out.'
    });
});

module.exports = authRouter;