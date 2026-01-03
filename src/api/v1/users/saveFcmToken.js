const User = require("../../../models/User");

const saveFcmToken = async (req, res) => {
  try {
    const { fcmToken, userId, deviceType = 'mobile', deviceId } = req.body;

    if (!fcmToken || !userId) {
      return res.status(400).json({
        success: false,
        message: "FCM token and userId are required",
      });
    }

    if (!['mobile', 'web'].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        message: "deviceType must be either 'mobile' or 'web'",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize fcmTokens array if it doesn't exist (backward compatibility)
    if (!user.fcmTokens) {
      user.fcmTokens = [];
    }

    // Check if this device already has a token saved
    const existingTokenIndex = user.fcmTokens.findIndex(
      t => (deviceId && t.deviceId === deviceId) || (t.token === fcmToken && t.deviceType === deviceType)
    );

    if (existingTokenIndex !== -1) {
      // Update existing token
      user.fcmTokens[existingTokenIndex].token = fcmToken;
      user.fcmTokens[existingTokenIndex].updatedAt = new Date();
      console.log(`🔄 Updated existing ${deviceType} FCM token for user ${userId}`);
    } else {
      // Add new token
      user.fcmTokens.push({
        token: fcmToken,
        deviceType,
        deviceId: deviceId || `${deviceType}_${Date.now()}`,
        updatedAt: new Date()
      });
      console.log(`✅ Added new ${deviceType} FCM token for user ${userId}`);
    }

    await user.save();

    res.json({
      success: true,
      message: "FCM token saved successfully",
      data: {
        userId: user._id,
        deviceCount: user.fcmTokens.length,
        devices: user.fcmTokens.map(t => ({ deviceType: t.deviceType, deviceId: t.deviceId }))
      },
    });
  } catch (error) {
    console.error("❌ Save FCM Token Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save FCM token",
      error: error.message,
    });
  }
};

module.exports = saveFcmToken;
