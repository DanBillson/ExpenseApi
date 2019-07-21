import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 3090;
export const secret = process.env.SECRET;
export const environment = process.env.NODE_ENV || 'development';
export const dbPath =
    process.env.MONGODB_URI || `mongodb://localhost:expense/expense`;
