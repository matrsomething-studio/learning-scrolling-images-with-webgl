// return total height of page
const getPageHeight = () => {
	let body = document.body;
	let html = document.documentElement;

	return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};

export {
	getPageHeight
};
