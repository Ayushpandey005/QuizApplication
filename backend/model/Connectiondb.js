import mongoose from "mongoose";

export const connectDb = () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("MONGO_URI environment variable is not defined");
      process.exit(1); // Exit the application with an error code
    }
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`Connected to database...`)
    }).catch((err) => {
        console.log(`Some error occured while connecting to database ${err}`)
    }) 
}
