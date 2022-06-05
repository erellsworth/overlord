import express from 'express';
import contentRouter from './routes/content';
import mediaRouter from './routes/media';

// Create express instance
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(contentRouter);
app.use(mediaRouter);

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
    const port = process.env.PORT || 3001
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API server listening on port ${port}`)
    });
}