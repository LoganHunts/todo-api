const Role   = require( './role.mongo' );
const getAll = async () => {
    return await Role.find().select('role').then( ( result ) => {
        return result;
    });
}

const createAll = async (collections) => {
    const options = { ordered: true, versionKey: false };

    let count = await Role.find().count().then( ( result ) => {
        return result;
    });

    if( count == 0 ) {
        return await Role.insertMany(collections, options).then( ( result ) => {
            return result;
        });
    }
}

module.exports = {
    getAll,
    createAll
};