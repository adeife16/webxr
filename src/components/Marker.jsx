import { Sphere } from '@react-three/drei'

const Marker = ({ position }) => (
    <Sphere args={[0.01, 16, 16]} position={position}>
        <meshStandardMaterial color="red" />
    </Sphere>
)

export default Marker
