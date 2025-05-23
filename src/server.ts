import express, {Request, Response} from 'express';
const app= express();
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
import userRoutes from './routes/user';

const port= process.env.PORT || 7000;

app.use(express.json());

app.get('/', (req: Request, res: Response)=>{
    res.send('Welcome to the Backend Development !');
});

connectDB();

app.use('/api/users', userRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})