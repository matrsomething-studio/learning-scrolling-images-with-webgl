// Style(s)
import '../styles/main.scss';


// Module(s)
import NoJS from './modules/NoJS';
import ScrollingImages from './modules/ScrollingImages';


// Main
const APP = (() => {
    let NO_JS = null;
    let SCROLLING_IMAGES = null;

    function raf() {
        SCROLLING_IMAGES.animate();
        requestAnimationFrame(raf);
    }

    function bindWindowEvents() {
        window.addEventListener('wheel', (e) => {
            SCROLLING_IMAGES.setSpeed(e.deltaY * 0.0003);
        });

        window.addEventListener('resize', (e) => {
            SCROLLING_IMAGES.resize();
        });
    }

    function init() {
        NO_JS = new NoJS();
        SCROLLING_IMAGES = new ScrollingImages({ scene: "#scene" });
        // ScrollingImages.init();
        bindWindowEvents();
        requestAnimationFrame(raf);
    }
    
    return {
        init: init
    };
})();


// Load App
document.addEventListener('readystatechange', e => {
    if (e.target.readyState === 'complete') {
        APP.init();
    }
});
