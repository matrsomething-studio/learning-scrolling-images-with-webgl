// DOM
const HTML = document.querySelector('html');

// Method(s)
const isEnabled = () => {
	return !HTML.classList.contains('no-js') ? true : false;
};

const isTouchEnabled = () => { 
	return !!(( 'ontouchstart' in window ) ||  
	       ( window.DocumentTouch && document instanceof window.DocumentTouch) ||
		   ( navigator.maxTouchPoints > 0 ) || 
		   ( navigator.msMaxTouchPoints > 0 )); 
};

const enable = () => {
	if (isEnabled()) {
		HTML.classList.remove('js');
		HTML.classList.add('no-js');
	}
};

const disable = () => {
	if (!isEnabled()) {
		HTML.classList.remove('no-js');
		HTML.classList.add('js');
	}

	if (isTouchEnabled()) {
		HTML.classList.add('has-touch');
	}
};

const init = (options) => {
	if (options && options.hasOwnProperty('enable') && options.enable === true) {
		enable();
		return;
	}

	disable();
};

// Export(s)
export {
	init,
	isEnabled,
	isTouchEnabled,
	disable,
	enable
};
