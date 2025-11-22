import mongoose from 'mongoose';
import EnvManager from './EnvManager';

const connectDB = async (): Promise<string | any> => {
  try {
    // console.log(EnvManager.getDBConnection() ,"bbb")
    await mongoose.connect(EnvManager.getDBConnection());
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;