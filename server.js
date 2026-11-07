import app from './app.js';

const PORT = process.env.PORT;

if (!PORT) {
    throw new Error('PORT is not defined. Set it in .env or your hosting environment.');
}

app.listen(PORT, () => {
    console.log(`Server listening at http://127.0.0.1:${PORT}`);
});