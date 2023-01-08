// Set debounce delay and action (https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf)
const debounce = (func, delay) => {
	let inDebounce;
	
	return function() {
		const CONTEXT = this;
		const ARGS = arguments;
		
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(CONTEXT, ARGS), delay);
	}
};

// Set throttle limit and action (https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf)
const throttle = (func, limit) => {
	let lastFunc;
	let lastRan;
	
	return function() {
		const CONTEXT = this;
		const ARGS = arguments;

		if (!lastRan) {
			func.apply(CONTEXT, ARGS)
			lastRan = Date.now()
		} else {
			clearTimeout(lastFunc)
			lastFunc = setTimeout(function() {
				if ((Date.now() - lastRan) >= limit) {
					func.apply(CONTEXT, ARGS)
					lastRan = Date.now()
				}
			}, limit - (Date.now() - lastRan))
		}
	}
};

export {
	debounce,
	throttle
};
