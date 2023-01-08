// return string capitalized
const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

// return string in title case format
const titleCase = (str) => {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

// return string with all empty space(s) removed
const stripEmptySpace = (str) => {
	return str.replace(/\s+/g, '');
};

// return string with specified word replaced
const replaceAt = (str, index, replacement) => {
	return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

// return string with all space(s) at beginning or end of string removed
const stripLeadingTrailingEmptySpace = (str) => {
	return str.replace(/(^\s+|\s+$)/g, '');
};

export {
	capitalize,
	titleCase,
	stripEmptySpace,
	replaceAt,
	stripLeadingTrailingEmptySpace
};
