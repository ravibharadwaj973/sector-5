import mongoose from "mongoose"

async function ConnectDB() {
     try {
    await mongoose.connect("mongodb+srv://jharavi0605_db_user:google2025@cluster0.d3iq7lq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection error:", error);
  }

    
}
export default ConnectDB;