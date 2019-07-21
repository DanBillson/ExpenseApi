import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { connect } from 'mongoose';
import cors from 'cors';
import router from './router';
import { port, dbPath } from './config';

const app = express();

// Database
connect(
    dbPath,
    { useNewUrlParser: true }
);

// App
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server
const server = http.createServer(app);
server.listen(port);

console.log(`Server is listening on port: ${port}`);
