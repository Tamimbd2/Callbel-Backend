require("dotenv").config();
const mongoose = require("mongoose");
const LiveKit = require("../src/models/LliveKit");
const Paygic = require("../src/models/Paygic");
const WebsiteInfo = require("../src/models/WebsiteInfo");

const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Seed LiveKit credentials
    const existingLiveKit = await LiveKit.findOne();
    if (!existingLiveKit) {
      const liveKitData = new LiveKit({
        url: process.env.LIVEKIT_URL,
        key: process.env.LIVEKIT_API_KEY,
        secret: process.env.LIVEKIT_API_SECRET,
      });
      await liveKitData.save();
      console.log("✅ LiveKit credentials seeded");
    } else {
      console.log("ℹ️  LiveKit credentials already exist");
    }

    // Seed Paygic settings (optional - you can customize these)
    const existingPaygic = await Paygic.findOne();
    if (!existingPaygic) {
      const paygicData = new Paygic({
        mid: process.env.PAYGIC_MID || "your_paygic_mid", // Replace with actual values or add to .env
        password: process.env.PAYGIC_PASSWORD || "your_paygic_password", // Replace with actual values or add to .env
      });
      await paygicData.save();
      console.log("✅ Paygic settings seeded");
    } else {
      console.log("ℹ️  Paygic settings already exist");
    }

    // Seed Website Info with sample plans
    const existingWebsite = await WebsiteInfo.findOne();
    if (!existingWebsite) {
      const websiteData = new WebsiteInfo({
        about: {
          title: "About Virtual Callbell",
          content: "Virtual Callbell is a modern communication platform.",
        },
        privacy: {
          title: "Privacy Policy",
          content: "Your privacy policy content here.",
        },
        contactUs: {
          email: "contact@virtualcallbell.com",
          phone: "+1234567890",
        },
        termsAndCondition: {
          title: "Terms and Conditions",
          content: "Your terms and conditions here.",
        },
        paymentMethod: {
          paygic: true,
          razorPay: true,
        },
        plan: [
          {
            name: "Basic",
            duration: 30, // days
            price: 9.99,
            minute: 100,
          },
          {
            name: "Pro",
            duration: 30,
            price: 19.99,
            minute: 500,
          },
          {
            name: "Enterprise",
            duration: 30,
            price: 49.99,
            minute: 2000,
          },
        ],
      });
      await websiteData.save();
      console.log("✅ Website info and plans seeded");
    } else {
      console.log("ℹ️  Website info already exists");
    }

    console.log("\n🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
