import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './src/router.js';
import swaggerDocument from './swagger.json' with { type: 'json' };

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ message: 'Invalid JSON body' });
    }

    console.error('Request failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
});

export default app;
