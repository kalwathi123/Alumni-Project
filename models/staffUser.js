var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var StaffUserSchema = new mongoose.Schema({
    Name: String,
    EmailId: { type: String, unique: true, required: true },
    StaffId: { type: String, unique: true, required: true },
    Designation: String,
    Department: String,
    PhoneNo: String,
    Password: String,
    ConfirmPassword: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isStaff: { type: Boolean, default: false }
});

StaffUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('StaffUser', StaffUserSchema);