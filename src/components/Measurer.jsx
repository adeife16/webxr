import { useState, useRef } from 'react'
import { useXREvent } from '@react-three/xr'
import Marker from './Marker'
import * as THREE from 'three'

const MeasurementLogic = () => {
    const [points, setPoints] = useState([])
    const [distance, setDistance] = useState(null)
    const refSpace = useRef()
    const viewerRef = useRef()

    // Handle tap (select) events
    useXREvent('select', (event) => {
        const hit = event.target.inputSource.targetRaySpace
        const referenceSpace = event.target.session.requestReferenceSpace('local')

        Promise.all([referenceSpace]).then(([refSpace]) => {
            const frame = event.frame
            const hitTestSource = frame.getViewerPose(refSpace)
            if (!hitTestSource) return

            const pose = frame.getPose(hit, refSpace)
            if (!pose) return

            const pos = new THREE.Vector3(
                pose.transform.position.x,
                pose.transform.position.y,
                pose.transform.position.z
            )

            if (points.length < 2) {
                setPoints((prev) => [...prev, pos])
            }
        })
    })

    if (points.length === 2 && !distance) {
        const distMeters = points[0].distanceTo(points[1])
        setDistance(distMeters * 1000) // mm
        console.log("Distance JSON:", JSON.stringify({
            length_mm: +(distMeters * 1000).toFixed(2)
        }, null, 2))
    }

    return (
        <>
            {points.map((p, i) => <Marker key={i} position={p} />)}
        </>
    )
}

export default MeasurementLogic
