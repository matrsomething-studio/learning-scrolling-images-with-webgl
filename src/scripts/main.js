// Style(s)
import '../styles/main.scss';


// Module(s)
import * as NoJs from './modules/NoJS';
import * as ScrollingImages from './modules/ScrollingImages';


// Main
const App = (() => {
    function raf() {
        ScrollingImages.animate();
        requestAnimationFrame(raf);
    }

    function bindWindowEvents() {
        window.addEventListener('wheel', (e) => {
            ScrollingImages.setSpeed(e.deltaY * 0.0003);
        });

        window.addEventListener('resize', (e) => {
            ScrollingImages.resize();
        });
    }

    function init() {
        NoJs.init();
        ScrollingImages.init();
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
        App.init();
    }
});
