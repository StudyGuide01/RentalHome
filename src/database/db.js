import mongoose from 'mongoose';

const mongodbUrl = 'mongodb://localhost:27017/RentalHome';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectToDatabase;
