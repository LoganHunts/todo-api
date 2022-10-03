const User       = require( './user.mongo' );
const { getAll } = require( './../role-resource/role.model' );
const { default: mongoose } = require('mongoose');

const createNewUser = async ( body ) => {
    let user   = new User( body );
    let role   = body.role || 'customer';

    // Append required role.
    user.role_id = await getAll().then( ( rolesQuery ) => {
        let selectedRole = rolesQuery.filter( ( current ) => {
            return( current.role === role )
        });
        return selectedRole[0]._id.toString();
    });

    let result = await user.validate().catch( (err) => {
        return {
            success : false,
            message : err.message
        };
    });

    if( 'undefined' != typeof result && ! result.success ) return result;

    try {
        User.create(user);
        return {
            success : true,
            message : 'User created successfully.',
            id      : user._id.toString()
        };
    } catch (error) {
        return {
            success : false,
            message : error.message
        };
    }
}

const getUser = async ( params, returnType = 'bool' ) => {
    const user = await User.findOne({ 
        $or: [ 
            { '_id': mongoose.Types.ObjectId(params.id) || '' },
            { 'email': params.email || '' },
            { 'username': params.username || '' } 
        ]
    },{
        '__v' : 0
    });

    if ( returnType === 'bool' )  return user ? true : false;
    else return user || false;
}

const deleteUser = async ( params ) => {
    const isDeleted = await User.deleteOne({ '_id': mongoose.Types.ObjectId(params.id) || '' });
    return isDeleted;
}

const updateUser = async ( params, body ) => {

    const isUpdated = await User.findOneAndUpdate(
        { '_id': mongoose.Types.ObjectId(params.id) || '' },
        body,
        {
            upsert: true,
            new: true
        }
    );
    return isUpdated;
}

const createAdmin = async ( params ) => {
    let ifExists = await getUser( params[0], 'bool' );
    if( ! ifExists ) {
      return await createNewUser( params[0] );
    }
    return true;
}

module.exports = { 
    createNewUser,
    getUser,
    deleteUser,
    updateUser,
    createAdmin
}