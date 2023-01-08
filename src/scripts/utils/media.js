// Lib(s)
import imagesLoaded from 'imagesloaded';

// Method(s)
const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => {
      imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
  });
};

// Export(s)
export {
	preloadImages
};
