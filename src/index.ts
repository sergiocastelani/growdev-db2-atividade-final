import { createApp } from "./create_server";
import swagger from 'swagger-ui-express';
import swagerJson from './docs/swagger.json';

const app = createApp();

app.use('/docs', swagger.serve);
app.use("/docs", swagger.setup(swagerJson));

app.listen(3333, () => {
    console.log('Listening on port 3333...');
});
