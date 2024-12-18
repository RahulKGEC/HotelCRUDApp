const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Defining the schema. We will only define the email. 
// Username and password will be automatically handled by passport-local-mongoose. 
// We don't need to write them separately in the schema, as they will be added automatically when the schema is created for the database.
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Using the plugin because it automatically handles username, password hashing, salting, and other authentication-related tasks.
// This saves us from implementing these features from scratch.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
