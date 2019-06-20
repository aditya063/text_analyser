/* eslint-disable no-console */
'use strict';

var async = require('async');
var server = require('./config/initializers/server');

const startServer = callback => {
	server(callback);
};

// Initialize Modules
async.series([startServer], err => {
	if (err) console.error('[APP] initialization failed', err);
	else console.info('[APP] initialized SUCCESSFULLY');
});
