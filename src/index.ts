import express from 'express';
import cors from 'cors';
import  { PrismaClient } from "@prisma/client"
import user_controller from './controllers/user_controller';

const app = express();
app.use(express.json());
app.use(cors());

app.use(user_controller);

app.locals.repository = new PrismaClient();

app.listen(3333, () => {
    console.log('Listening on port 3333...');
});
