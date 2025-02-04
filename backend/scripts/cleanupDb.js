import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get reference to the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // List all indexes before cleanup
    console.log("\n📊 Current indexes:");
    const currentIndexes = await usersCollection.indexes();
    console.log(currentIndexes);

    // Drop all indexes except _id
    const indexNames = currentIndexes
      .filter(index => index.name !== '_id_')
      .map(index => index.name);
    
    for (const indexName of indexNames) {
      console.log(`🗑️ Dropping index: ${indexName}`);
      await usersCollection.dropIndex(indexName);
    }

    // Create only the email unique index
    console.log("\n📝 Creating email unique index");
    await usersCollection.createIndex(
      { email: 1 }, 
      { unique: true }
    );

    // Verify final indexes
    console.log("\n✅ Final indexes:");
    const finalIndexes = await usersCollection.indexes();
    console.log(finalIndexes);

    console.log("\n✨ Database cleanup completed successfully!");

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📡 Database connection closed");
  }
};

cleanup().catch(console.error);