import jwt from 'jwt-simple';
import User from '../models/user';
import { secret } from '../config';

const tokenForUser = user => {
    const iat = new Date().getTime();
    return jwt.encode({ sub: user.id, iat }, secret);
};

export const signUp = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res
            .status(422)
            .send({ error: 'Please provide a name, email and password.' });
    }

    if (password.length < 6) {
        return res.status(422).send({
            error: 'Please enter a password that is at least 6 characters long.'
        });
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.status(422).send({
                error: `The email ${email} is already in use, please try a different one.`
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        newUser.save(err => {
            if (err) {
                return next(err);
            }

            res.json({
                userId: newUser._id,
                name: newUser.name,
                token: tokenForUser(newUser)
            });
        });
    });
};

export const signIn = (req, res, next) => {
    res.send({
        userId: req.user._id,
        name: req.user.name,
        token: tokenForUser(req.user)
    });
};

export const updatePassword = (req, res, next) => {
    const { userId, password, verifyPassword } = req.body;

    if (password !== verifyPassword) {
        return res.status(422).send({
            error: 'Please make sure the two entries match.'
        });
    }

    if (password.length < 6) {
        return res.status(422).send({
            error: 'Please enter a password that is at least 6 characters long.'
        });
    }

    User.findById(userId, (err, user) => {
        if (err) {
            return next(err);
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }

            if (isMatch) {
                return res.status(422).send({
                    error:
                        'Sorry, this password is already in use, please try another one'
                });
            }
            user.password = password;
            user.save(err => {
                if (err) {
                    return next(err);
                }
                res.send({ message: 'Your password has been updated.' });
            });
        });
    });
};
