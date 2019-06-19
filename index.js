/* eslint-disable no-console */
'use strict';

var async = require('async');
var server = require('./config/initializers/server');

// Initialize Modules
async.series(
	[
		function startServer(callback) {
			server(callback);
		}
	],
	function(err) {
		if (err) {
			console.error('[APP] initialization failed', err);
		} else {
			console.info('[APP] initialized SUCCESSFULLY');
		}
	}
);
