import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// Define Transaction model
const transactionSchema = new Schema({
    name: String,
    amount: Number,
    occurance: String,
    day: {
        type: Number,
        min: 0,
        max: 31
    },
    month: {
        type: Number,
        min: 0,
        max: 11
    }
});

//Define User Model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String,
    name: String,
    transactions: [transactionSchema]
});

// On save hook, encrypt password
userSchema.pre('save', function(next) {
    const user = this;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }

        callback(null, isMatch);
    });
};

//Create the model class
const ModelClass = model('user', userSchema);

export default ModelClass;
