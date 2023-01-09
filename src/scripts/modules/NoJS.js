// Module(s)

// Class - NoJS
export default class NoJS {
	constructor(options) {
		// Prop(s)
		this.HTML = document.querySelector('html');

		if (options && options.hasOwnProperty('enable') && options.enable === true) {
			this.enable();
			return;
		}

		this.disable();
	}
	
	// Methods
	isEnabled() {
		return !this.HTML.classList.contains('no-js') ? true : false;
	};

	isTouchEnabled() { 
		return !!(( 'ontouchstart' in window ) ||  
			( window.DocumentTouch && document instanceof window.DocumentTouch) ||
			( navigator.maxTouchPoints > 0 ) || 
			( navigator.msMaxTouchPoints > 0 )); 
	};

	enable() {
		if (this.isEnabled()) {
			this.HTML.classList.remove('js');
			this.HTML.classList.add('no-js');
		}
	};

	disable() {
		if (!this.isEnabled()) {
			this.HTML.classList.remove('no-js');
			this.HTML.classList.add('js');
		}

		if (this.isTouchEnabled()) {
			this.HTML.classList.add('has-touch');
		}
	};
};