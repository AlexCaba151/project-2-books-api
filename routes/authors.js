const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Authors management
 */

router.get('/', authorsController.getAuthors);
router.get('/:id', authorsController.getAuthorById);
router.post('/', authorsController.createAuthor);
router.put('/:id', authorsController.updateAuthor);
router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;
