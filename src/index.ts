import { createApp } from "./create_server";

const app = createApp();

app.listen(3333, () => {
    console.log('Listening on port 3333...');
});
