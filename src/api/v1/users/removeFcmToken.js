const User = require("../../../models/User");

const removeFcmToken = async (req, res) => {
  try {
    const { userId, deviceId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize fcmTokens array if it doesn't exist
    if (!user.fcmTokens) {
      user.fcmTokens = [];
    }

    let removedCount = 0;

    if (deviceId) {
      // Remove specific device token
      const initialLength = user.fcmTokens.length;
      user.fcmTokens = user.fcmTokens.filter(t => t.deviceId !== deviceId);
      removedCount = initialLength - user.fcmTokens.length;
      console.log(`🗑️ Removed FCM token for device ${deviceId} from user ${userId}`);
    } else {
      // Remove all tokens (full logout from all devices)
      removedCount = user.fcmTokens.length;
      user.fcmTokens = [];
      console.log(`🗑️ Removed all FCM tokens for user ${userId}`);
    }

    await user.save();

    res.json({
      success: true,
      message: deviceId 
        ? "FCM token removed successfully" 
        : "All FCM tokens removed successfully",
      data: {
        userId: user._id,
        removedCount,
        remainingDevices: user.fcmTokens.length,
      },
    });
  } catch (error) {
    console.error("❌ Remove FCM Token Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove FCM token",
      error: error.message,
    });
  }
};

module.exports = removeFcmToken;
