import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.onload = function () {

    const SCENE = new THREE.Scene();
    window.myThreeJsScene = SCENE;
    const CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    CAMERA.position.z = 30;

    const RENDERER = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });
    window.renderer = RENDERER;
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(window.innerWidth, window.innerHeight);

    const geometry1 = new THREE.IcosahedronGeometry(6, 0);
    const geometry2 = new THREE.IcosahedronGeometry(6, 4);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(5, 5, 5);
    SCENE.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    SCENE.add(ambientLight);

    //const cloudTexture = new THREE.TextureLoader().load('./cloud.png');
    const cloud1 = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: 0x655967 }));
    window.cloud1 = cloud1;

    const cloud2 = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: 0x655967 }));
    window.cloud2 = cloud2;

    const moon = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("./moon.png")} ));
    window.moon = moon;

    const sun = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("./sun.png")} ))
    window.sun = sun;

    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(15000 * 3), 3));

    rainGeo.setAttribute('velocity', new THREE.BufferAttribute(new Float32Array(15000 * 3), 3));

    const positions = rainGeo.attributes.position.array;
    const velocities = rainGeo.attributes.velocity.array;
    var velocity;
    for (let i = 0; i < 15000; i++) {
        const rainDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );

        positions[i * 3] = rainDrop.x;
        positions[i * 3 + 1] = rainDrop.y;
        positions[i * 3 + 2] = rainDrop.z;

        velocity = new THREE.Vector3(0, -0.08, 0);
        velocities[i * 3] = velocity.x;
        velocities[i * 3 + 1] = velocity.y;
        velocities[i * 3 + 2] = velocity.z;
    }

    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
    });

    const rain = new THREE.Points(rainGeo, rainMaterial);
    window.myRain = rain;

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(15000 * 3), 3))

    const positionStar = starGeo.attributes.position.array;
    var velocity;
    for (let i = 0; i < 15000; i++) {
        const star = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );

        positionStar[i * 3] = star.x;
        positionStar[i * 3 + 1] = star.y;
        positionStar[i * 3 + 2] = star.z;
    }

    const starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
    });

    const stars = new THREE.Points(starGeo, starMaterial);
    window.stars = stars;

    function animate() {
        requestAnimationFrame(animate);
        //console.log(".");
        RENDERER.render(SCENE, CAMERA);

        for (let i = 0; i < 15000; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            //console.log("hello");
            const acceleration = new THREE.Vector3(0, -0.004, 0);
            velocities[i * 3] += acceleration.x;
            velocities[i * 3 + 1] += acceleration.y;
            velocities[i * 3 + 2] += acceleration.z;

            if (positions[i * 3 + 1] < -250) {
                // check for when rain drop is off screen
                positions[i * 3] = Math.random() * 400 - 200; // reset x position
                positions[i * 3 + 2] = Math.random() * 400 - 200; // reset z position
                positions[i * 3 + 1] = 250; // set y position to the top of the viewport
                velocities[i * 3] = 0;
                velocities[i * 3 + 2] = 0;
                velocities[i * 3 + 1] = -0.1; // set velocity.y to previous value
            }
        }
        rainGeo.attributes.position.needsUpdate = true;

        cloud1.rotation.z -= 0.01;
        cloud2.rotation.x += 0.01;

        moon.rotation.y += 0.005;
        sun.rotation.y += 0.005;
    }
    animate();
};