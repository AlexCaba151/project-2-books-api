require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const authorsRoutes = require('./routes/authors');
const booksRoutes = require('./routes/books');

const app = express();

// ----------------------------
// MongoDB
// ----------------------------
connectDB();

// ----------------------------
// Middlewares globales
// ----------------------------
app.use(cors());
app.use(express.json());

// ----------------------------
// Session (REQUIRED for OAuth)
// ----------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false
  })
);

// ----------------------------
// Passport
// ----------------------------
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------
// GitHub OAuth Strategy
// ----------------------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ----------------------------
// Authentication middleware
// ----------------------------
function authenticate(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Not authenticated" });
}

// ----------------------------
// Rutas OAuth
// ----------------------------
app.get('/login', passport.authenticate('github'));

app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/api-docs');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('/api-docs');
  });
});

// ----------------------------
// Rutas API
// ----------------------------

// Rutas públicas
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Books API is running",
    authenticated: req.isAuthenticated()
  });
});

// Rutas protegidas
app.use('/api/authors', authenticate, authorsRoutes);
app.use('/api/books', authenticate, booksRoutes);

// ----------------------------
// Swagger Docs
// ----------------------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// ----------------------------
// 404 Handler
// ----------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ----------------------------
// Error Handler
// ----------------------------
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ----------------------------
// Server
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
