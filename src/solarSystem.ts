import { TextureLoader, SpriteMaterial, Sprite } from 'three';
import { DebugText } from './debug/DebugText';

import { NightSky } from './NightSky';
import { objects } from './objects.json';

NightSky.attachToInitialization(function () {
    let spriteTex = new TextureLoader().load('star.png');
    let spriteMaterial = new SpriteMaterial({ map: spriteTex });

    for (let star of objects) {
        let sprite = new Sprite(spriteMaterial);
        sprite.scale.set(0.02, 0.02, 0.02);
        sprite.position.setFromSphericalCoords(1, (90 - star.dec) * Math.PI / 180, (-star.ra + 180) * Math.PI / 180);
        this.scene.add(sprite);
    }
});
