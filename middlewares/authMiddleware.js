const supabase = require("../config/supabaseClient");

const verifyToken = async (req, res, next) => {
  try {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from Authorization header
    // get from cookie
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user data to request
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = verifyToken;
