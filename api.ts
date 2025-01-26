import express from 'express';
import 'dotenv/config';
import contentRouter from './api/routes/content';
import mediaRouter from './api/routes/media';
import taxonomyRouter from './api/routes/taxonomy';
import settingsRouter from './api/routes/settings';
import atproRouter from './api/routes/atpro';

// Create express instance
const app = express();
app.use(express.json({ limit: '10mb' })); // for parsing application/json
app.use(express.urlencoded({ limit: '10mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(contentRouter);
app.use(mediaRouter);
app.use(taxonomyRouter);
app.use(settingsRouter);
app.use(atproRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port http://localhost:${port}`);
});
