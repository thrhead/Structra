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
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xf59e0b, 2); // Industrial Amber
        dirLight1.position.set(10, 10, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x0ea5e9, 1.5); // Azure Blue
        dirLight2.position.set(-10, -10, -5);
        scene.add(dirLight2);

        // Group for the industrial cluster
        const clusterGroup = new THREE.Group();
        scene.add(clusterGroup);

        // 1. Central "Industrial Core" (A large rotating gear/hex)
        const coreGeom = new THREE.CylinderGeometry(2, 2, 0.8, 6);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x0f172a,
            emissiveIntensity: 0.2
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        core.rotation.x = Math.PI / 2;
        clusterGroup.add(core);

        // Add "bolts" to the core
        for (let i = 0; i < 6; i++) {
            const boltGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 6);
            const bolt = new THREE.Mesh(boltGeom, new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 1 }));
            const angle = (i / 6) * Math.PI * 2;
            bolt.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0.4);
            bolt.rotation.x = Math.PI / 2;
            core.add(bolt);
        }

        // 2. Floating "Cargo Boxes" (Logistics symbols)
        const boxes: THREE.Mesh[] = [];
        const boxGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
        
        for (let i = 0; i < 5; i++) {
            const box = new THREE.Mesh(boxGeom, boxMat);
            const angle = (i / 5) * Math.PI * 2;
            box.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, (Math.random() - 0.5) * 2);
            clusterGroup.add(box);
            boxes.push(box);
        }

        // 3. Floating "Dashboard Mockups" (Planes with gradients)
        const dashboards: THREE.Mesh[] = [];
        const dashGeom = new THREE.PlaneGeometry(2.5, 1.8);
        
        for (let i = 0; i < 3; i++) {
            const dashMat = new THREE.MeshStandardMaterial({ 
                color: 0x0f172a, 
                transparent: true, 
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const dash = new THREE.Mesh(dashGeom, dashMat);
            
            // Add a wireframe border to the dashboard
            const borderEdges = new THREE.EdgesGeometry(dashGeom);
            const borderLine = new THREE.LineSegments(borderEdges, new THREE.LineBasicMaterial({ color: 0x06b6d4 }));
            dash.add(borderLine);

            const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
            dash.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, (Math.random() - 0.5) * 4);
            dash.lookAt(0, 0, 0);
            clusterGroup.add(dash);
            dashboards.push(dash);
        }

        // 4. Particle Field
        const particleCount = 200;
        const particlesGeom = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 20;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        particlesGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particlesMat = new THREE.PointsMaterial({
            color: 0xf59e0b,
            size: 0.04,
            transparent: true,
            opacity: 0.4
        });
        const particles = new THREE.Points(particlesGeom, particlesMat);
        scene.add(particles);

        // Animation Loop
        let animationFrameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Rotate cluster
            clusterGroup.rotation.y += delta * 0.05;
            
            // Core slow rotation
            core.rotation.z += delta * 0.2;

            // Animate Boxes
            boxes.forEach((box, i) => {
                box.rotation.x += delta * 0.5;
                box.rotation.y += delta * 0.3;
                box.position.y += Math.sin(time + i) * 0.005;
            });

            // Animate Dashboards
            dashboards.forEach((dash, i) => {
                dash.position.y += Math.cos(time * 0.5 + i) * 0.01;
                dash.rotation.z += Math.sin(time * 0.2) * 0.001;
            });

            // Subtle camera movement
            camera.position.x = Math.sin(time * 0.2) * 0.5;
            camera.position.y = Math.cos(time * 0.2) * 0.5;
            camera.lookAt(0, 0, 0);

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
            coreGeom.dispose();
            boxGeom.dispose();
            dashGeom.dispose();
            particlesGeom.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div className="absolute inset-x-0 top-0 h-screen w-full -z-10 overflow-hidden bg-slate-950 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950 z-10" />

            {/* Industrial Glowies */}
            <div className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-amber-600/5 blur-[180px] mix-blend-screen z-0" />
            <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] rounded-full bg-blue-700/5 blur-[160px] mix-blend-screen z-0" />

            {/* Vanilla Three.js Mount Point */}
            <div ref={mountRef} className="absolute inset-0 z-0" />

            {/* Grid Overlay Mask */}
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#64748b11_1px,transparent_1px),linear-gradient(to_bottom,#64748b11_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_30%,transparent_100%)] opacity-30" />
        </div>
    );
}
