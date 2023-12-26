import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const DBconnection = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/lms_project"
    );
    if (connection) {
      console.log(`db is connected :${connection.host}`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default DBconnection;
