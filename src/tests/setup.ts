import mongoose from 'mongoose';
import env from 'dotenv';

env.config({ path: `${__dirname}/../../.env` });

beforeAll(async () => {
    console.log(process.env.MONGODB_TEST_URL);

    await mongoose.connect('mongodb://localhost:27017')
        .then(() => {
            console.log("connected to testing DB");

        })
        .catch(() => {
            console.log("FAILED: connected to testing DB");
        });

});

afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        // clear all mongodb data related to previous tests
        // NOTE : don't drop the DB or you'll get into trouble in validation
        await collection.deleteMany();
    }
});

afterAll(async () => {
    // terminate all connections to mongodb
    await mongoose.disconnect();
});