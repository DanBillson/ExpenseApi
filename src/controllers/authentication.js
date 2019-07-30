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
            .send({ error: 'You must provide a name, email and password.' });
    }

    if (password.length < 6) {
        return res.status(422).send({
            error: 'Your passowrd must be at least 6 characters long.'
        });
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (user) {
            return res
                .status(422)
                .send({ error: `Email ${email} is already in use.` });
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
