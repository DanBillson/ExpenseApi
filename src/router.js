import passport from 'passport';
import { signUp, signIn, updatePassword } from './controllers/authentication';
import {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
} from './controllers/transactions';
import passportService from './services/passport';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

export default app => {
    app.get('/', requireAuth, (req, res) => {
        res.send({ message: 'Hello you cheeky hacker' });
    });

    // Authentication
    app.post('/signup', signUp);
    app.post('/signin', requireSignIn, signIn);
    app.put('/updatePassword', requireAuth, updatePassword);

    // Transactions
    app.get('/getTransactions', requireAuth, getTransactions);
    app.post('/addTransaction', requireAuth, addTransaction);
    app.delete('/deleteTransaction', requireAuth, deleteTransaction);
    app.put('/updateTransaction', requireAuth, updateTransaction);
};
