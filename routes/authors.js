const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');

const authorsController = require('../controllers/authorsController');
/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Authors management
 */

router.get('/', authorsController.getAuthors);
router.get('/:id', authorsController.getAuthorById);
router.post('/', isAuthenticated, authorsController.createAuthor);
router.put('/:id', isAuthenticated, authorsController.updateAuthor);
router.delete('/:id', isAuthenticated, authorsController.deleteAuthor);

module.exports = router;
