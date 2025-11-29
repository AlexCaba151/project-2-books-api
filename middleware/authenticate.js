const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'You do not have access' });
  }
};

module.exports = {isAuthenticated };
