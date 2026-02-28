'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HeroScene() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xbae6fd, 2);
        dirLight1.position.set(10, 10, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x0284c7, 1);
        dirLight2.position.set(-10, -10, -5);
        scene.add(dirLight2);

        // Group for the structure
        const structureGroup = new THREE.Group();
        scene.add(structureGroup);

        // Outer Geometry (Wireframe)
        const outerGeom = new THREE.IcosahedronGeometry(3, 1);
        const outerMesh = new THREE.Mesh(
            outerGeom,
            new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 })
        );
        const outerEdges = new THREE.LineSegments(
            new THREE.EdgesGeometry(outerGeom),
            new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.6 })
        );
        outerMesh.add(outerEdges);
        structureGroup.add(outerMesh);

        // Inner Geometry (Solid)
        const innerGeom = new THREE.IcosahedronGeometry(1.2, 0); // scaled by 1.2
        const innerMesh = new THREE.Mesh(
            innerGeom,
            new THREE.MeshStandardMaterial({
                color: 0x0284c7,
                roughness: 0.2,
                metalness: 0.8,
                emissive: 0x0369a1,
                emissiveIntensity: 0.5
            })
        );
        const innerEdges = new THREE.LineSegments(
            new THREE.EdgesGeometry(innerGeom),
            new THREE.LineBasicMaterial({ color: 0x38bdf8 })
        );
        innerMesh.add(innerEdges);
        structureGroup.add(innerMesh);

        // Particles array
        const particleCount = 300;
        const particlesGeom = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const radius = 5;

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos((Math.random() * 2) - 1);
            particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // x
            particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
            particlePositions[i * 3 + 2] = radius * Math.cos(phi); // z
        }

        particlesGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particlesMat = new THREE.PointsMaterial({
            color: 0x22d3ee,
            size: 0.03,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        const particles = new THREE.Points(particlesGeom, particlesMat);
        structureGroup.add(particles);

        // Animation Loop
        let animationFrameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Rotate group
            structureGroup.rotation.y += delta * 0.1;
            structureGroup.rotation.x += delta * 0.05;

            // Bob up and down
            structureGroup.position.y = Math.sin(time * 0.5) * 0.5;

            // Rotate inner core opposite way
            innerMesh.rotation.y -= delta * 0.2;
            innerMesh.rotation.z += delta * 0.1;

            // Rotate particles slightly
            particles.rotation.y -= delta * 0.05;
            particles.rotation.x += delta * 0.02;

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            outerGeom.dispose();
            innerGeom.dispose();
            particlesGeom.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div className="absolute inset-x-0 top-0 h-screen w-full -z-10 overflow-hidden bg-zinc-950 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950 z-10" />

            {/* Dynamic Cyan/Blue Animated Glow effects */}
            <div className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-cyan-600/10 blur-[180px] mix-blend-screen animate-pulse z-0" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] rounded-full bg-blue-700/10 blur-[160px] mix-blend-screen animate-pulse z-0" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-sky-500/10 blur-[150px] mix-blend-screen animate-pulse z-0" style={{ animationDuration: '10s' }} />

            {/* Vanilla Three.js Mount Point */}
            <div ref={mountRef} className="absolute inset-0 z-0" />

            {/* Grid Overlay Mask */}
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#0ea5e911_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e911_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_30%,transparent_100%)] opacity-30" />
        </div>
    );
}
