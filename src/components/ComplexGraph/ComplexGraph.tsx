'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { evaluate, complex, ComplexNumber } from 'mathjs';

// Fonction pour évaluer une équation complexe pour une valeur donnée
const evaluateComplexEquation = (equation: string, z: ComplexNumber): ComplexNumber | null => {
  try {
    // Remplacer 'z' dans l'équation par la valeur complexe
    const scope = { z };
    return evaluate(equation, scope);
  } catch (error) {
    console.error("Erreur lors de l'évaluation de l'équation:", error);
    return null;
  }
};

// Composant pour représenter un point dans l'espace 3D
const ComplexPoint = ({ position, color = 'red', size = 0.05 }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Composant pour représenter les axes
const Axes = ({ size = 5 }) => {
  return (
    <group>
      {/* Axe X - Rouge */}
      <line>
        <bufferGeometry attach="geometry" args={[new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-size, 0, 0),
          new THREE.Vector3(size, 0, 0)
        ])]} />
        <lineBasicMaterial attach="material" color="red" linewidth={2} />
      </line>
      <Text position={[size + 0.3, 0, 0]} fontSize={0.3} color="red">
        Re
      </Text>
      
      {/* Axe Y - Vert */}
      <line>
        <bufferGeometry attach="geometry" args={[new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -size, 0),
          new THREE.Vector3(0, size, 0)
        ])]} />
        <lineBasicMaterial attach="material" color="green" linewidth={2} />
      </line>
      <Text position={[0, size + 0.3, 0]} fontSize={0.3} color="green">
        Im
      </Text>
      
      {/* Axe Z - Bleu */}
      <line>
        <bufferGeometry attach="geometry" args={[new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, -size),
          new THREE.Vector3(0, 0, size)
        ])]} />
        <lineBasicMaterial attach="material" color="blue" linewidth={2} />
      </line>
      <Text position={[0, 0, size + 0.3]} fontSize={0.3} color="blue">
        |f(z)|
      </Text>
    </group>
  );
};

// Composant pour visualiser une équation complexe
const ComplexEquationVisualizer = ({ equation, parameter = 1 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  
  useEffect(() => {
    // Générer les points pour la visualisation
    const newPoints: THREE.Vector3[] = [];
    const gridSize = 20;
    const step = 0.2;
    
    // Équation par défaut si non spécifiée
    const equationToUse = equation || `${parameter}^z - z`;
    
    for (let x = -gridSize / 2; x <= gridSize / 2; x += step) {
      for (let y = -gridSize / 2; y <= gridSize / 2; y += step) {
        // Créer un nombre complexe z = x + yi
        const z = complex(x, y);
        
        // Évaluer l'équation pour ce z
        const result = evaluateComplexEquation(equationToUse, z);
        
        if (result) {
          // Utiliser le module du résultat comme hauteur (axe z)
          const magnitude = Math.sqrt(result.re * result.re + result.im * result.im);
          
          // Limiter la hauteur pour une meilleure visualisation
          const height = Math.min(magnitude, 5);
          
          newPoints.push(new THREE.Vector3(x, y, height));
        }
      }
    }
    
    setPoints(newPoints);
  }, [equation, parameter]);
  
  // Animation de rotation
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <>
      <Axes size={5} />
      
      {/* Points pour visualiser l'équation */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            count={points.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00ffff"
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>
      
      {/* Surface pour visualiser l'équation */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial
          color="#00aaff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

// Composant principal pour le graphique complexe
const ComplexGraph = ({ equation, parameter = 1 }) => {
  return (
    <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ComplexEquationVisualizer equation={equation} parameter={parameter} />
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

export default ComplexGraph;
