export function measureObjectDimensions(mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  return {
    length: +(size.z * 1000).toFixed(1),
    width: +(size.x * 1000).toFixed(1),
    thickness: +(size.y * 1000).toFixed(1),
  };
}
