/* eslint-disable no-console */
const fs = require('fs');
const axios = require('axios');
const CONSTANTS = require('../config/constants');
const textHelper = require('../utils/textHelpers');
const filename = 'temp.txt';
let result = 'Error, please try again later.';

const init = async () => {
	try {
		await fetchDocument();
		const formatedText = await readAndFormatText();
		const wordCounts = textHelper.getWordCounts(formatedText);
		const topTenWords = textHelper.sortAndGetTopTenWords(wordCounts);
		result = await collectDetails(topTenWords);
	} catch (error) {
		console.log(error);
	}
};

const fetchDocument = () => {
	// returning promise to make callback functions to work with async/await
	return new Promise((resolve, reject) => {
		fs.stat(filename, async err => {
			// check if file exists
			if (err == null) {
				resolve();
			} else {
				var data = await makeCallURL(CONSTANTS.TEXTFILE_URL);
				fs.writeFile(filename, data, err => {
					if (err) reject(err);
					resolve();
				});
			}
		});
	});
};

const makeCallURL = async url => {
	const res = await axios.get(url);
	return res.data;
};

const readAndFormatText = () => {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, 'utf8', (err, data) => {
			if (err) reject(err);
			data = data
				.replace(/[^a-zA-Z ]/g, ' ') // replace all special chars with space
				.toLowerCase()
				.split(/\s+/); // get rid of all spaces, tabs, new lines etc.
			resolve(data);
		});
	});
};

const collectDetails = async data => {
	let resultArray = [];
	for (let index = 0; index < data.length; index++) {
		const item = data[index];
		const wordDetails = await makeCallURL(CONSTANTS.DICTIONARY_URL + item.word);
		item.output.pos = getPos(wordDetails);
		item.output.synonym = getSynonym(wordDetails);
		resultArray.push(item);
	}
	return resultArray;
};

const getPos = wordDetails => {
	return wordDetails.def.length > 0 ? wordDetails.def[0].pos : 'N/A';
};

const getSynonym = wordDetails => {
	let _tr = wordDetails.def.length > 0 ? wordDetails.def[0].tr : null;

	if (_tr) {
		let _synArray = _tr.map(item => {
			if (item['syn']) {
				const syn = item.syn.map(syn => {
					return syn.text;
				});
				return syn;
			}
		});

		var result = _synArray
			.filter(Boolean)
			.map(item => item.join(', '))
			.join(', ');
		return result.length ? result : 'N/A';
	} else return 'N/A';
};

init();

exports.express = (req, res) => res.send(result);
