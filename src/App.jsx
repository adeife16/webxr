import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import Marker from './components/Marker'

const Measurer = () => {
  const { gl, camera } = useThree()
  const [points, setPoints] = useState([])

  useEffect(() => {
    gl.xr.enabled = true

    const button = ARButton.createButton(gl, {
      requiredFeatures: ['hit-test'],
    })
    document.body.appendChild(button)

    const handleSelect = () => {
      const xrCam = gl.xr.getCamera(camera)
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(xrCam.quaternion)
      const point = xrCam.position.clone().add(direction.multiplyScalar(0.3)) // 30 cm forward
      setPoints((prev) => [...prev, point])
    }

    const session = gl.xr.getSession()
    if (session) {
      session.addEventListener('select', handleSelect)
    } else {
      gl.xr.addEventListener('sessionstart', () => {
        gl.xr.getSession().addEventListener('select', handleSelect)
      })
    }
  }, [])

  useEffect(() => {
    if (points.length === 2) {
      const dist = points[0].distanceTo(points[1]) * 1000
      console.log(JSON.stringify({ length_mm: +dist.toFixed(2) }, null, 2))
    }
  }, [points])

  return points.map((point, index) => <Marker key={index} position={point} />)
}

export default function App() {
  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.xr.enabled = true
      }}
      camera={{ position: [0, 1.6, 0], fov: 70 }}
    >
      <ambientLight />
      <Measurer />
    </Canvas>
  )
}
