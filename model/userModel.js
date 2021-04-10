var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* user model */
var userSchema = new Schema({
    fname: { type: String, lowercase: true, trim: true },
    lname: { type: String, lowercase: true, trim: true },
    mobileno: { type: String, trim: true },
    userid: { type: String, required: true, lowercase: true, trim: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    token: { type: String, trim: true },
    reset_password_token: { type: String, trim: true },
    reset_password_expires: { type: Date },
    updated_at: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
    applicationForm: [{ type: Schema.Types.ObjectId, ref: 'ApplicationForm' }],
});

module.exports = User = mongoose.model('Users', userSchema);