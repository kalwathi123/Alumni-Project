var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var AlumniUserSchema = new mongoose.Schema({
    username: String,
    Name: String,
    EmailId: { type: String, unique: true, required: true },
    CompanyName: { type: String, unique: true, required: true },
    Designation: String,
    PassedOutYear: Date,
    LinkedInID: String,
    PhoneNo: String,
    Password: String,
    ConfirmPassword: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAlumni: { type: Boolean, default: false }
});

AlumniUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('AlumniUser', AlumniUserSchema);