import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }
  
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
    req.user = decoded.userId;

    next();  
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
