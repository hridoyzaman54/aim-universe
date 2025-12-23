import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced particles with trails
const Particles: React.FC<{ count?: number }> = ({ count = 600 }) => {
  const mesh = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>();
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const vels = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 12;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 10;
      
      // Velocity for movement
      vels[i * 3] = (Math.random() - 0.5) * 0.01;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      
      // Vibrant cyan to teal color range
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Cyan
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.7) {
        // Teal
        colors[i * 3] = 0.1 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
      } else {
        // Coral accent
        colors[i * 3] = 0.97;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.1;
      }
      
      sizes[i] = 0.02 + Math.random() * 0.06;
    }
    
    velocities.current = vels;
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (mesh.current && velocities.current) {
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        // Add wave motion
        positions[i * 3] += Math.sin(time * 0.5 + i * 0.01) * 0.002;
        positions[i * 3 + 1] += Math.cos(time * 0.3 + i * 0.01) * 0.002;
        positions[i * 3 + 2] += Math.sin(time * 0.2 + i * 0.01) * 0.001;
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true;
      mesh.current.rotation.y = time * 0.015;
      mesh.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Animated connecting lines between particles
const ConnectionLines: React.FC = () => {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(100 * 6);
    const colors = new Float32Array(100 * 6);
    
    for (let i = 0; i < 100; i++) {
      const x1 = (Math.random() - 0.5) * 15;
      const y1 = (Math.random() - 0.5) * 15;
      const z1 = -5 - Math.random() * 10;
      
      const x2 = x1 + (Math.random() - 0.5) * 3;
      const y2 = y1 + (Math.random() - 0.5) * 3;
      const z2 = z1 + (Math.random() - 0.5) * 3;
      
      positions[i * 6] = x1;
      positions[i * 6 + 1] = y1;
      positions[i * 6 + 2] = z1;
      positions[i * 6 + 3] = x2;
      positions[i * 6 + 4] = y2;
      positions[i * 6 + 5] = z2;
      
      // Cyan color with fade
      colors[i * 6] = 0.0;
      colors[i * 6 + 1] = 0.8;
      colors[i * 6 + 2] = 1.0;
      colors[i * 6 + 3] = 0.0;
      colors[i * 6 + 4] = 0.6;
      colors[i * 6 + 5] = 0.8;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

// Glowing orb with animation
const FloatingOrb: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  speed?: number;
}> = ({ position, color, scale = 1, speed = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.5;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.3) * 0.3;
      meshRef.current.rotation.y = time * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current!.position);
      glowRef.current.scale.setScalar(scale * (1 + Math.sin(time * 2) * 0.1));
    }
  });

  return (
    <Float speed={2 * speed} rotationIntensity={0.3} floatIntensity={0.8}>
      {/* Inner solid orb */}
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef} position={position} scale={scale * 1.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  );
};

// Animated ring
const AnimatedRing: React.FC<{ 
  position: [number, number, number]; 
  color: string;
  size?: number;
}> = ({ position, color, size = 2 }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[size, 0.02, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

// Mouse-responsive camera
const ResponsiveCamera: React.FC = () => {
  const { camera } = useThree();
  
  useFrame((state) => {
    // Subtle camera movement
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.3;
    camera.lookAt(0, 0, -5);
  });
  
  return null;
};

const Scene: React.FC = () => {
  return (
    <>
      <ResponsiveCamera />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 5]} intensity={0.6} color="#00bcd4" />
      <pointLight position={[-10, -5, 5]} intensity={0.4} color="#2dd4bf" />
      <pointLight position={[0, 5, -10]} intensity={0.3} color="#f96854" />
      
      {/* Stars background */}
      <Stars 
        radius={150} 
        depth={80} 
        count={2000} 
        factor={5} 
        fade 
        speed={0.3} 
      />
      
      {/* Particles */}
      <Particles count={400} />
      
      {/* Connection lines */}
      <ConnectionLines />
      
      {/* Floating orbs at different depths */}
      <FloatingOrb position={[-5, 2, -8]} color="#00bcd4" scale={1.8} speed={0.8} />
      <FloatingOrb position={[5, -1, -12]} color="#2dd4bf" scale={1.2} speed={1.2} />
      <FloatingOrb position={[0, 4, -15]} color="#f96854" scale={2} speed={0.6} />
      <FloatingOrb position={[-7, -3, -10]} color="#00bcd4" scale={0.8} speed={1.5} />
      <FloatingOrb position={[7, 2, -6]} color="#2dd4bf" scale={1} speed={1} />
      <FloatingOrb position={[-3, 5, -18]} color="#f96854" scale={1.5} speed={0.7} />
      <FloatingOrb position={[4, -4, -9]} color="#00bcd4" scale={0.6} speed={1.3} />
      
      {/* Animated rings */}
      <AnimatedRing position={[0, 0, -12]} color="#00bcd4" size={4} />
      <AnimatedRing position={[-4, 2, -8]} color="#2dd4bf" size={2} />
      <AnimatedRing position={[3, -2, -15]} color="#f96854" size={3} />
    </>
  );
};

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
