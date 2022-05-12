const Song = require('../models/songModel');
const base = require('./baseController');

exports.getAll = base.getAll(Song);
exports.get = base.getOne(Song);
exports.update = base.updateOne(Song);
exports.delete = base.deleteOne(Song);
exports.create = base.createOne(Song);