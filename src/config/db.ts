import mongoose from 'mongoose';

const connectDB= ()=>{
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mitchel')
        .then(()=>{
            console.log('MongoDB Connected');
        })
        .catch((err)=>{
            console.log(err);
        })
};

export default connectDB;