const http = require('http');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connected!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(process.env.MONGO_URI);

    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();