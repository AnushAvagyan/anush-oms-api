import express from 'express';
import cors from 'cors';
// import { config } from 'dotenv';
import { installRoutes } from './routes.js';

export const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

installRoutes(app);
const PORT = process.env['PORT'] || 3001;
// config({
//   path: '.env',
// });

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}   http://localhost:${PORT}`);
});
