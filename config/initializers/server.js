/* globals __dirname process */
'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

const app = express();

var start = function(callback) {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({ type: '*/*' }));
	app.use(express.static(path.join(__dirname, 'public')));

	// set api routers
	app.use('/', require('../../api/router'));

	// Error handler
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
		next(err);
	});

	app.listen(process.env.PORT || 3000);

	if (callback) {
		return callback();
	}
};

module.exports = start;
