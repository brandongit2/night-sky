import './coordinateLabels';
import './skyGrid';
import './SkyObject';
import './solarSystem';
import './TextLabel';
import './input/Inertia';
import './input/mouse';
import './input/pan';
import './input/touch';
import './input/zoom';

window.addEventListener('load', () => import('./NightSky').then(val => val.NightSky.init()));
