const minZoom = 0.3;
const maxZoom = 40;
let zoom = 1;
let scrollMin = Math.log(minZoom) / Math.log(1.003);
let scrollMax = Math.log(maxZoom) / Math.log(1.003);
let scrollOverlay: HTMLElement, scrollContent: HTMLElement;

export function zoomInit() {
    scrollOverlay = document.getElementById('scroll-overlay');
    scrollContent = document.getElementById('scroll-content');
    scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
    scrollOverlay.scrollTo(0, scrollMax);
}

export function zoomOnRender() {
    zoom = 1.003 ** (scrollMax - scrollOverlay.scrollTop);
    this.camera.zoom = zoom;
}

export function zoomOnResize() {
    scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
}
