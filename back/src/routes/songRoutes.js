const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router
    .route('/song/')
    .get(songController.getAll)
    .put(songController.create);

router
    .route('/song/:id')
    .get(songController.get)
    .patch(songController.update)
    .delete(songController.delete);

module.exports = router;