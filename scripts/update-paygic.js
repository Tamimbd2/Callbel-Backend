require("dotenv").config();
const mongoose = require("mongoose");
const Paygic = require("../src/models/Paygic");

const MONGO_URI = process.env.MONGO_URI;

const updatePaygic = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Update with your real Paygic credentials
    const mid = process.argv[2];
    const password = process.argv[3];

    if (!mid || !password) {
      console.log("❌ Usage: node scripts/update-paygic.js <mid> <password>");
      process.exit(1);
    }

    const result = await Paygic.findOneAndUpdate(
      {},
      { mid, password },
      { upsert: true, new: true }
    );

    console.log("✅ Paygic credentials updated:");
    console.log(`   MID: ${result.mid}`);
    console.log(`   Password: ${result.password.replace(/./g, "*")}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating Paygic:", error);
    process.exit(1);
  }
};

updatePaygic();
