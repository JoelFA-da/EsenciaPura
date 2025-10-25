import { createApp } from './app';
import { env } from './config/index';

const app = createApp();
const port = env.PORT;

app.listen(port, () => {
  console.log(`Esencia Pura API escuchando en puerto ${port}`);
});
