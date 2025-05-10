import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { measureObjectDimensions } from '../utils/measureUtils';

function ARScene({ isMeasuring, onMeasurementComplete }) {
    const containerRef = useRef(null);
    const renderer = useRef(null);
    const scene = useRef(null);
    const camera = useRef(null);
    const xrHitTestSource = useRef(null);
    const reticle = useRef(null);
    const box = useRef(null);

    useEffect(() => {
        if (navigator.xr) {
            initAR();
        } else {
            alert('WebXR not supported');
        }

        return () => {
            renderer.current?.dispose();
        };
    }, []);

    const initAR = async () => {
        renderer.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        renderer.current.xr.enabled = true;
        containerRef.current.appendChild(renderer.current.domElement);

        scene.current = new THREE.Scene();
        camera.current = new THREE.PerspectiveCamera();

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.current.add(light);

        const session = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test', 'local-floor'],
        });

        renderer.current.xr.setSession(session);

        const refSpace = await session.requestReferenceSpace('local-floor');
        const viewerSpace = await session.requestReferenceSpace('viewer');
        const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

        xrHitTestSource.current = hitTestSource;

        const tempReticle = new THREE.Mesh(
            new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({ color: 0x0fff00 })
        );
        tempReticle.matrixAutoUpdate = false;
        tempReticle.visible = false;
        reticle.current = tempReticle;
        scene.current.add(reticle.current);

        session.addEventListener('select', () => {
            if (reticle.current.visible && isMeasuring) {
                if (!box.current) {
                    const geometry = new THREE.BoxGeometry(0.1, 0.05, 0.03);
                    const material = new THREE.MeshStandardMaterial({ color: 0xff5533 });
                    const newBox = new THREE.Mesh(geometry, material);
                    newBox.position.setFromMatrixPosition(reticle.current.matrix);
                    scene.current.add(newBox);
                    box.current = newBox;

                    const dimensions = measureObjectDimensions(newBox);
                    onMeasurementComplete(dimensions);
                }
            }
        });

        renderer.current.setAnimationLoop((timestamp, frame) => {
            if (frame) {
                const hitTestResults = frame.getHitTestResults(xrHitTestSource.current);
                if (hitTestResults.length > 0) {
                    const hit = hitTestResults[0];
                    const pose = hit.getPose(refSpace);
                    if (pose) {
                        reticle.current.visible = true;
                        reticle.current.matrix.fromArray(pose.transform.matrix);
                    }
                } else {
                    reticle.current.visible = false;
                }
            }

            renderer.current.render(scene.current, camera.current);
        });
    };

    return <div ref={containerRef} className="ar-container" />;
}

export default ARScene;
