const { AccessToken } = require("livekit-server-sdk");
const LiveKit = require("../../../models/LliveKit");

const getLiveKit = async (req, res, next) => {
  try {
    // Fetch LiveKit credentials
    const credentials = await LiveKit.findOne();

    if (!credentials?.key || !credentials?.secret) {
      return res.status(500).json({
        error: "LiveKit credentials not found",
      });
    }

    const { key, secret } = credentials;
    const { roomName, username, role = "web" } = req.query;

    // Validate request params
    if (!roomName || !username) {
      return res.status(400).json({
        error: "roomName and username are required",
      });
    }

    // Generate a unique identity to prevent DUPLICATE_IDENTITY issue
    const identity = `${role}_${username}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 6)}`;

    // Create LiveKit access token
    const token = new AccessToken(key, secret, {
      identity,
      name: username,
    });

    // Assign permissions
    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    // Generate JWT and ensure it's a string
    const jwt = await token.toJwt();
    const jwtString = String(jwt);
    
    console.log("✅ [BACKEND] Generated LiveKit token for:", username);
    console.log("   Room:", roomName);
    console.log("   Identity:", identity);
    console.log("   Token type:", typeof jwtString);
    console.log("   Token length:", jwtString.length);

    // Respond with token as string
    return res.status(200).json({
      token: jwtString,
      identity,
    });
  } catch (error) {
    console.error("LiveKit Token Error:", error);
    next(error);
  }
};

module.exports = getLiveKit;
