// MIDDLEWARE - Functions that run BEFORE controller logic
// Similar to Angular Guards (canActivate, canDeactivate)

const { verifyToken } = require('../utils/tokenUtils');

// Middleware to check if user is authenticated
// Add this to any route that needs login
const authenticate = (req, res, next) => {
  try {
    // Get token from header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    // Extract token (remove "Bearer " part)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Token is valid - attach user info to request
    // Now controller can access req.user
    req.user = decoded;
    return next(); // Continue to next middleware/controller

  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

//empty function for testing
// function testMiddleware(req, res, next) {
//   try {
//     console.log('Test middleware executed');
//     next();
//   } catch (error) {
//     return res.status(500).json({"Error": error.message});
//   }
// }

module.exports = { authenticate };
