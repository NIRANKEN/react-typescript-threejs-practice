import React, { useRef, useState } from "react";
import {
  Canvas,
  MeshProps,
  Object3DNode,
  Vector3,
  extend,
  useFrame,
} from "@react-three/fiber";
import { BufferGeometry, Euler, Material, Mesh } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Center, OrbitControls, Text3D } from "@react-three/drei";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  HORIZONTAL_ANGULAR_MIN,
  HORIZONTAL_ANGULAR_MAX,
  VERTICAL_ANGULAR_MAX,
  VERTICAL_ANGULAR_MIN,
} from "./constants";
extend({ TextGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

export const SampleCanvas: React.FC = () => {
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
        <Canvas>
          <color attach="background" args={["whitesmoke"]} />
          <perspectiveCamera
            fov={60}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={100}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minAzimuthAngle={HORIZONTAL_ANGULAR_MIN} // よこふりむき開始角(みぎ)
            maxAzimuthAngle={HORIZONTAL_ANGULAR_MAX} // よこふりむき開始角(ひだり)
            minPolarAngle={VERTICAL_ANGULAR_MIN} // たてふりむき下限角 (真下0)
            maxPolarAngle={VERTICAL_ANGULAR_MAX} // たてふりむき上限角
          />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <ThreeBox boxMeshProps={{ position: [1.2, 0, -10] }} />
          <ThreeBox boxMeshProps={{ position: [-1.2, 0, -10] }} />
          <ThreeBox boxMeshProps={{ position: [1.2, 0, 10] }} />
          <ThreeBox boxMeshProps={{ position: [-1.2, 0, 10] }} />
          <BoundaryBox />
          <Board place="left" />
          <Board place="right" />
          <Board place="center" />
          <Board place="top" />
          <SampleText place="center" />
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

type BoardPlace = "left" | "right" | "center" | "top";

type BoardProps = {
  place: BoardPlace;
};

const getPosition = (place: BoardPlace): Vector3 => {
  const positionY: number = -2;
  switch (place) {
    case "left":
      return [-10, positionY, 2];
    case "right":
      return [10, positionY, 2];
    case "center":
      return [0, positionY, -3];
    case "top":
      return [0, positionY + 9, -3];
  }
};

const getRotation = (place: BoardPlace): Euler => {
  const angular = Math.PI / 4;
  switch (place) {
    case "left":
      return new Euler(0, angular, 0);
    case "right":
      return new Euler(0, -angular, 0);
    case "center":
      return new Euler(0, 0, 0);
    case "top":
      return new Euler(angular, 0, 0);
  }
};

const Board: React.FC<BoardProps> = ({ place }) => {
  return (
    <mesh position={getPosition(place)} rotation={getRotation(place)}>
      <boxGeometry args={[12, 8, 0.5]} />
      <meshStandardMaterial color="green" opacity={0.5} transparent />
    </mesh>
  );
};

const SampleText: React.FC<BoardProps> = ({ place }) => {
  // const font = new FontLoader().parse("/fonts/Yusei_Magic_Regular.json");
  // return (
  //   <mesh position={getPosition(place)} rotation={getRotation(place)}>
  //     {/* <boxGeometry args={[12, 8, 0.5]} /> */}
  //     <textGeometry args={["test", { font, size: 5, height: 1 }]} />
  //     <meshStandardMaterial color="black" />
  //   </mesh>
  // );
  const sampleTextMessage = "こんにちは世界\nわたしが支配者である！";
  return (
    <Center top>
      {/* <Text3D font="/fonts/Yusei_Magic_Regular.json"> */}
      {/* <Text3D font="/fonts/DotGothic16_Regular.json"> */}
      <Text3D
        font="/fonts/Yusei_Magic_Regular.json"
        position={[0, 0, -9]}
        size={0.5}
        letterSpacing={0.1}
      >
        {sampleTextMessage}
        <meshStandardMaterial color="black" />
      </Text3D>
    </Center>
  );
};
