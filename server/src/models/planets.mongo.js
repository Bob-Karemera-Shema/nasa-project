const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    },
});

// Connects the schema to the 'planets' collection in the 'nasa-project' database
module.exports = mongoose.model('Planet', planetsSchema);