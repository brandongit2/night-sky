const minZoom = 0.3;
const maxZoom = 40;
let zoom = 1;

export function zoomInit() {
    let scrollOverlay = document.getElementById('scroll-overlay');
    let scrollContent = document.getElementById('scroll-content');
    let scrollMin = Math.log(minZoom) / Math.log(1.003);
    let scrollMax = Math.log(maxZoom) / Math.log(1.003);
    scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
    scrollOverlay.scrollTo(0, scrollMax);
    setInterval(() => {
        zoom = 1.003 ** (scrollMax - scrollOverlay.scrollTop);
    }, 10);
}

export function zoomOnRender() {
    this.camera.zoom = zoom;
}

export function zoomOnResize() {
    let scrollOverlay = document.getElementById('scroll-overlay');
    let scrollContent = document.getElementById('scroll-content');
    let scrollMin = Math.log(minZoom) / Math.log(1.003);
    let scrollMax = Math.log(maxZoom) / Math.log(1.003);
    scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
    scrollOverlay.scrollTo(0, Math.log(zoom) / Math.log(1.003) + scrollOverlay.scrollTop);
}
