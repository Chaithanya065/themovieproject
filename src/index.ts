import 'dotenv/config';
import { PORT } from './config';
import app from './app';
app.listen(PORT, () => {
  console.log(`The server has started successfully on port: ${PORT}`);
});
