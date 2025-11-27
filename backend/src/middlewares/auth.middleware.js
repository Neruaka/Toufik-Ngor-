const { verifyToken } = require("../utils/jwt.utils");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: true, message: "Accès interdit.", statusCode: 401 });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(accessToken);

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: true, message: "Token invalide ou expiré.", statusCode: 403 });
  }
};

module.exports = authenticateUser;