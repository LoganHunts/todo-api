const Todo   = require( './todo-list.mongo' );
const { default: mongoose } = require('mongoose');
const getList = async ( query ) => {
    return await Todo.find(query).then( ( result ) => {
        return result;
    });
}

const createList = async (body) => {
        let todo   = new Todo( body );
        let result = await todo.validate().catch( (err) => {
            return {
                success : false,
                message : err.message
            };
        });
    
        if( 'undefined' != typeof result && ! result.success ) return result;
    
        try {
            Todo.create(todo);
            return {
                success : true,
                message : 'Todo created successfully.',
                Todo      : todo
            };
        } catch (error) {
            return {
                success : false,
                message : error.message
            };
        }
    }

const deleteList = async (query) => {
    return await Todo.deleteOne(query).then( ( result ) => {
        return result;
    });
}

const updateList = async (search, body) => {
    console.log(body)
    query = {
        _id : mongoose.Types.ObjectId(search.id)
    };

    return await Todo.findOneAndUpdate(query,body,
        {
            upsert: true,
            new: true
        }).then( ( result ) => {
        return result;
    });
}

module.exports = {
    getList,
    createList,
    updateList,
    deleteList
};