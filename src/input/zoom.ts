import { DebugText } from '../debug/DebugText';
import { NightSky } from '../NightSky';

const minZoom = 0.3;
const maxZoom = 40;
let zoom = 1;
let scrollMin = Math.log(minZoom) / Math.log(1.003);
let scrollMax = Math.log(maxZoom) / Math.log(1.003);
let scrollOverlay: HTMLElement, scrollContent: HTMLElement;
let initHeight: number;
let debugText: DebugText;

NightSky.attachToInitialization(() => {
    initHeight = window.innerHeight;
    scrollOverlay = document.getElementById('scroll-overlay');
    scrollContent = document.getElementById('scroll-content');
    scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
    scrollOverlay.scrollTo(0, scrollMax);

    debugText = new DebugText('zoom', String(zoom));
});

NightSky.attachToRenderLoop(function () {
    zoom = scrollToZoom(scrollOverlay.scrollTop);
    this.camera.zoom = zoom;

    debugText.update(String(zoom));
});

NightSky.attachToResizeEvent(() => {
    if (initHeight > window.innerHeight) { // If window just got smaller
        scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
    } else { // If window just got bigger
        scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
        scrollOverlay.scrollTop = zoomToScroll(zoom);
    }
    initHeight = window.innerHeight;
});

// Translates from scrollTop to zoom
function scrollToZoom(scroll: number) {
    return 1.003 ** (scrollMax - scroll);
}

// Translates from zoom to scrollTop
function zoomToScroll(zoom: number) {
    return -Math.log(zoom) / Math.log(1.003) + scrollMax;
}
