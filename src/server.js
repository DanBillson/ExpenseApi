import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { connect } from 'mongoose';
import cors from 'cors';
import router from './router';

const app = express();

// Database
connect(
    `mongodb://localhost:expense/expense`,
    { useNewUrlParser: true }
);

// App
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);

console.log(`Server is listening on port: ${port}`);
