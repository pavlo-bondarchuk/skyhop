import { Color, ExtrudeGeometry, Group, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Shape, Vector3 } from 'three';

export class Clouds extends Group {
  constructor(radius: number) {
    super();
    this.name = 'stylized-clouds';
    const outline = new Shape();
    outline.moveTo(-0.42, -0.42);
    outline.lineTo(0.42, -0.42);
    outline.lineTo(0.42, 0.42);
    outline.lineTo(-0.42, 0.42);
    outline.closePath();
    const geometry = new ExtrudeGeometry(outline, { depth: 0.84, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 1, steps: 1, curveSegments: 1 });
    geometry.center();
    const material = new MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true });
    const blocks: { matrix: Matrix4; color: Color }[] = [];
    const up = new Vector3(0, 1, 0);
    for (let i = 0; i < 35; i++) {
      const direction = new Vector3(Math.sin(i * 4.1), Math.cos(i * 1.7), Math.cos(i * 3.3)).normalize();
      const origin = direction.clone().multiplyScalar(radius + 18 + i % 6);
      const orientation = new Quaternion().setFromUnitVectors(up, direction);
      orientation.multiply(new Quaternion().setFromAxisAngle(up, i * 2.4));
      const size = 1.25 + (i % 4) * 0.22;
      for (let x = -3; x <= 3; x++) {
        for (let z = -2; z <= 2; z++) {
          const distance = (x * x) / 11 + (z * z) / 5;
          const variation = Math.sin(i * 12.7 + x * 7.1 + z * 4.3) * 0.5 + 0.5;
          if (distance > 1.05 + variation * 0.24) continue;
          const height = size * (0.85 + Math.max(0, 1 - distance) * (1.6 + i % 3 * 0.4) + variation * 0.65);
          const position = new Vector3(x * size * 0.96, height * 0.5, z * size * 0.96).applyQuaternion(orientation).add(origin);
          blocks.push({ matrix: new Matrix4().compose(position, orientation, new Vector3(size * 0.96, height, size * 0.96)), color: new Color().setRGB(0.9 + variation * 0.1, 0.94 + variation * 0.06, 0.96 + variation * 0.04) });
        }
      }
    }
    const clouds = new InstancedMesh(geometry, material, blocks.length);
    clouds.name = 'beveled-cloud-blocks';
    blocks.forEach((block, index) => { clouds.setMatrixAt(index, block.matrix); clouds.setColorAt(index, block.color); });
    clouds.instanceMatrix.needsUpdate = true;
    if (clouds.instanceColor) clouds.instanceColor.needsUpdate = true;
    clouds.computeBoundingSphere();
    this.add(clouds);
  }
}
