import User from '../models/user';

export const getTransactions = (req, res, next) => {
    const userId = req.query.userId;

    User.findById(userId, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send({ transactions: user.transactions });
    });
};

export const addTransaction = (req, res, next) => {
    const { userId, transaction } = req.body;

    User.findById(userId, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (
            !transaction.name ||
            !transaction.amount ||
            !transaction.occurance
        ) {
            return res.status(422).send({
                error: 'You must provide details for the transaction'
            });
        }

        user.transactions.push(transaction);
        user.save();
        res.send({
            transaction: user.transactions[user.transactions.length - 1]
        });
    });
};

export const deleteTransaction = (req, res, next) => {
    const { userId, transactionId } = req.body;

    User.findById(userId, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (!transactionId) {
            return res
                .status(422)
                .send({ error: 'You must provide a transaction to delete' });
        }

        user.transactions.pull({ _id: transactionId });
        user.save();
        res.send({ transactions: user.transactions });
    });
};

export const updateTransaction = (req, res, next) => {
    const { userId, transaction } = req.body;

    User.findOneAndUpdate(
        { _id: userId, 'transactions._id': transaction._id },
        {
            $set: {
                'transactions.$': transaction
            }
        },
        { new: true },
        (err, user) => {
            if (err) {
                res.status(500).send({ error: 'Failed to update transaction' });
            }

            res.send({ transactions: user.transactions });
        }
    );
};
