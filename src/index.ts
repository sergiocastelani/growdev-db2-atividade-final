import express from 'express';
import cors from 'cors';
import user_controller from './controllers/user_controller';
import tweet_controller from './controllers/tweet_controller';
import like_controller from './controllers/like_controller';

const app = express();
app.use(express.json());
app.use(cors());

app.use(user_controller);
app.use(tweet_controller);
app.use(like_controller);

app.listen(3333, () => {
    console.log('Listening on port 3333...');
});
