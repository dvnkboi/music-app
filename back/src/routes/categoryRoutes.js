const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router
    .route('/category/')
    .get(categoryController.getAll)
    .put(categoryController.create);

router
    .route('/category/:id')
    .get(categoryController.get)
    .patch(categoryController.update)
    .delete(categoryController.delete);

module.exports = router;