import { Canvas, useThree } from '@react-three/fiber'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Marker from './components/Marker'

const Measurer = () => {
  const { camera, gl, scene } = useThree()
  const [points, setPoints] = useState([])
  const raycaster = useRef(new THREE.Raycaster())

  useEffect(() => {
    gl.xr.enabled = true
    document.body.appendChild(ARButton.createButton(gl, { requiredFeatures: ['hit-test'] }))

    const onClick = (event) => {
      const viewerPose = gl.xr.getCamera(camera)
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(viewerPose.quaternion)
      const origin = viewerPose.position

      const point = new THREE.Vector3().copy(origin).add(direction.multiplyScalar(0.3)) // 30 cm forward
      setPoints((prev) => [...prev, point])
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [gl, camera])

  useEffect(() => {
    if (points.length === 2) {
      const dist = points[0].distanceTo(points[1]) * 1000
      console.log("Measured JSON:", JSON.stringify({ length_mm: +dist.toFixed(2) }, null, 2))
    }
  }, [points])

  return <>
    {points.map((point, i) => (
      <Marker key={i} position={point} />
    ))}
  </>
}

export default function App() {
  return (
    <Canvas onCreated={({ gl }) => { gl.xr.enabled = true }}>
      <ambientLight />
      <Measurer />
    </Canvas>
  )
}
