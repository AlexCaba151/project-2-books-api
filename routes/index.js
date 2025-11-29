const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login con GitHub
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Callback de GitHub
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs'
  }),
  (req, res) => {
    // Si llega aquí, login fue exitoso
    // Puedes redirigir directo a Swagger
    res.redirect('/api-docs');
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect('/api-docs');
    });
  });
});

module.exports = router;
