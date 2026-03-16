import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Text, OrthographicCamera, shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- Shader Definition ---

const BeamMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#8FB4FF'),
        uOpacity: 1.0,
        uProgress: 0.0,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uProgress;
    varying vec2 vUv;

    // Simple pseudo-random noise
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    void main() {
        // Horizontal flow
        float flow = noise(vec2(vUv.x * 10.0 - uTime * 1.0, vUv.y * 40.0));
        
        // Vertical fade (soft edges top/bottom)
        float distY = abs(vUv.y - 0.2);
        float alphaY = smoothstep(0.2, 0.0, distY);
        
        // Horizontal fade (soft edges left/right)
        float distX = abs(vUv.x - 0.0);
        float alphaX = smoothstep(0.0, 0.0, distX); // Keep center brighter

        // Combine for volumetric feel
        float alpha = alphaY * alphaX * (0.5 + 0.5 * flow);
        
        // Core intensity
        float core = smoothstep(0.1, 0.0, distY) * 2.0;
        
        vec3 finalColor = uColor + core * 0.5; // Add some white/bright core

        // Reveal animation
        float reveal = 1.0 - smoothstep(uProgress - 0.2, uProgress, vUv.x);

        gl_FragColor = vec4(finalColor, alpha * uOpacity * reveal);
    }
  `
);

extend({ BeamMaterial });

// --- Scene Components ---

const Beam = ({ startAnimation }) => {
    const materialRef = useRef();

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime += delta;
            // Animate shoot effect only when startAnimation is true
            if (startAnimation) {
                materialRef.current.uProgress = THREE.MathUtils.lerp(materialRef.current.uProgress, 1.2, delta * 1.5);
            }
        }
    });

    return (
        <mesh position={[0, 0, 0]} scale={[15, 1, 1]}>
            <planeGeometry args={[1, 1]} />
            <beamMaterial
                ref={materialRef}
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
};

const HeroScene = ({ startAnimation }) => {
    return (
        <>
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />

            {/* The Shader Beam */}
            <Beam startAnimation={startAnimation} />

            {/* Post-processing for Glow */}
            <EffectComposer disableNormalPass>
                <Bloom
                    intensity={4.0}
                    luminanceThreshold={0.6}
                    radius={0.3}
                    mipmapBlur
                />
            </EffectComposer>
        </>
    );
};

const Home = ({ startAnimation }) => {
    return (
        <div className="relative h-screen w-full bg-black overflow-hidden z-10">
            {/* Text Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="relative pb-12"> {/* Offset text slightly above center */}
                    <motion.h1
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.35 }}
                        className="text-xl md:text-2xl font-bold text-white tracking-tight text-center"
                    >
                        Design engineered with intent.
                    </motion.h1>
                </div>
            </div>

            {/* 3D Scene */}
            <Canvas
                className="absolute w-full inset-0 z-10"
                gl={{ antialias: false, alpha: false }}
                dpr={[1, 2]}
            >
                <color attach="background" args={['#000000']} />
                <HeroScene startAnimation={startAnimation} />
            </Canvas>
        </div>
    );
};

export default Home;
