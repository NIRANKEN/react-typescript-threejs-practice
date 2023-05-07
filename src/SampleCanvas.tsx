import React, { useRef, useState } from "react";
import {
  Canvas,
  MeshProps,
  PointLightProps,
  useFrame,
} from "@react-three/fiber";
import {
  BufferGeometry,
  Euler,
  Material,
  Mesh,
  PerspectiveCamera,
} from "three";
import { OrbitControls } from "@react-three/drei";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const SampleCanvas: React.FC = () => {
  const [pointLightProps, setPointLightProps] = useState<PointLightProps>({
    position: [10, 10, 10],
  });
  const [threeBox1Props, setThreeBox1Props] = useState<MeshProps>({
    position: [-1.2, 0, -10],
  });
  const [threeBox2Props, setThreeBox2Props] = useState<MeshProps>({
    position: [1.2, 0, -10],
  });

  return (
    <Box component="div">
      <Box
        component="div"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <Typography variant="h3" sx={{ zIndex: 100 }}>
          React, Typescriptを用いたThree.jsのサンプルコードだよ
        </Typography>
      </Box>
      <Box
        component="div"
        height="75vh"
        width="75vw"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        margin="auto"
      >
        <Canvas
        // camera={
        //   new PerspectiveCamera(
        //     60,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     100
        //   )
        // }
        >
          <color attach="background" args={["whitesmoke"]} />
          <perspectiveCamera
            fov={90}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={100}
          />
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight />
          <pointLight position={pointLightProps.position} />
          <ThreeBox boxMeshProps={threeBox1Props} />
          <ThreeBox boxMeshProps={threeBox2Props} />
          <BoundaryBox />
        </Canvas>
      </Box>
    </Box>
  );
};

type ThreeBoxProps = {
  boxMeshProps: MeshProps;
};

const ThreeBox: React.FC<ThreeBoxProps> = ({
  boxMeshProps,
  // handleRotateMeshProps,
}) => {
  // This reference gives us direct access to the THREE.Mesh object
  // Hold state for hovered and clicked events
  const meshRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null);
  const [hovered, hover] = useState<boolean>(false);
  const [clicked, click] = useState<boolean>(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  // ここでsetStateするなって言われてるな？ でもReactのプラクティス的にuseRefするなって言ってる
  // => 「状態に応じてコンポーネントの描画を管理する場合は」useRefするなってことだけど、three.jsの場合は例外やね。
  useFrame(
    (_state, delta) => ((meshRef.current!.rotation! as Euler).x += delta)
  );
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...boxMeshProps}
      ref={meshRef}
      scale={clicked ? 1.5 : 1}
      onClick={(_event) => click(!clicked)}
      onPointerOver={(_event) => hover(true)}
      onPointerOut={(_event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

// color : https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/three/src/math/Color.d.ts#L10
const BoundaryBox: React.FC<{}> = () => {
  return (
    <mesh position={[0, 0, -10]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#9999ff" opacity={0.5} transparent />
    </mesh>
  );
};
