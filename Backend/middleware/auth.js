const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error('❌ AUTH: No Authorization header provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔑 AUTH: Decoded token:', decoded);

    if (!decoded._id) {
      console.error('❌ AUTH: Token missing _id:', decoded);
      return res.status(400).json({ error: 'Invalid token payload (no _id)' });
    }

    // ✅ Include role in req.user
    req.user = {
      _id: decoded._id,
      role: decoded.role || null
    };

    console.log('✅ AUTH: req.user set to:', req.user);

    next();
  } catch (err) {
    console.error('❌ AUTH: Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
