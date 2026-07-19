import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { env, isProduction } from './config/env.js';

const app = express();

const allowedOrigins = new Set([env.clientOrigin, 'http://localhost:5173', "https://til-up.netlify.app/"]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      // In development, also allow any localtunnel/dev-tunnel origin so the
      // public HTTPS URL used for real Telegram testing isn't blocked by CORS.
      if (!isProduction && /^https:\/\/[a-z0-9-]+\.loca\.lt$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS: ruxsat etilmagan manba'));
    },
  })
);
app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
