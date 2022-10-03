const express  = require('express');
const app      = express();
const api      = require( './routes/api' );

/**
 * The express.json() function is a built-in middleware function in Express.
 * It parses incoming requests with JSON payloads and is based on body-parser.
 */
app.use( express.json() );

// Do basic auth for request checks.
app.use('/v1',(req, res, next) => {
    let err     = false;
    let headers = req.headers;
    switch (headers['content-type']) {
        case 'application/json':
            err     = false;
            break;

        default:
            err     = true;
            break;
    }

    // Move further.
    if ( false === err ) next();
    else return res.status(401).json({
        success : false,
        error: 'Bad Request. Check for headers params apart from authentication.'
    });
});

app.use( '/v1', api );

// Restrict and block other urls.
app.get( '/*', (req, res) => {
    // In case of json.
    return res.status(404).json({
        success : false,
        error: 'Opps!! We did not anticipated you landing here.'
    });
});

module.exports = app;