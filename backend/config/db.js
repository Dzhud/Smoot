import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\t Connected to MongoDB (DB Connect)');
    } catch (err) {
        console.error('Error connecting to MongoDB: (DB Connect)', err.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
