const Category = require('../models/categoryModel');
const base = require('./baseController');

exports.getAll = base.getAll(Category);
exports.get = base.getOne(Category);
exports.update = base.updateOne(Category);
exports.delete = base.deleteOne(Category);
exports.create = base.createOne(Category);