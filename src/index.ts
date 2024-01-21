import express from 'express';
import cors from 'cors';
import user_controller from './controllers/user_controller';
import tweet_controller from './controllers/tweet_controller';
import like_controller from './controllers/like_controller';
import auth_controller from './controllers/auth_contoller';

const app = express();
app.use(express.json());
app.use(cors());

app.use(user_controller);
app.use(tweet_controller);
app.use(like_controller);
app.use(auth_controller);

app.listen(3333, () => {
    console.log('Listening on port 3333...');
});
