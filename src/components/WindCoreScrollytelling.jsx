import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Quaternion, Vector3 } from "three";
import { storyBeats } from "../constants";
import usePinnedScrollProgress from "../hooks/usePinnedScrollProgress";

const COLORS = {
  cream: "#f4f0e6",
  navy: "#243443",
  sage: "#8fa58f",
  sageDark: "#5f7665",
  amber: "#d7a857",
  amberDark: "#b98140",
  rust: "#a66252",
  grid: "#c9c4b6",
};

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

const smooth = (start, end, value) => {
  const x = clamp01((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};

const materialProps = (color, opacity = 1) => ({
  color,
  transparent: opacity < 1,
  opacity,
  roughness: 0.72,
  metalness: 0.05,
});

const BlueprintLine = ({
  from = [0, 0, 0],
  to = [1, 0, 0],
  color = COLORS.navy,
  opacity = 1,
  radius = 0.018,
}) => {
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const direction = end.clone().sub(start);
    const lengthValue = direction.length();
    const lineQuaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction.normalize()
    );

    return {
      position: midpoint.toArray(),
      quaternion: lineQuaternion,
      length: lengthValue,
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial {...materialProps(color, opacity)} />
    </mesh>
  );
};

const WindTurbine = ({ position = [0, 0, 0], scale = 1, opacity = 1 }) => {
  const bladeRef = useRef(null);

  useFrame((_, delta) => {
    if (bladeRef.current) bladeRef.current.rotation.z += delta * 0.7;
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.24, 0.34, 0.16, 24]} />
        <meshStandardMaterial {...materialProps(COLORS.sageDark, opacity)} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 2.55, 18]} />
        <meshStandardMaterial {...materialProps(COLORS.sage, opacity)} />
      </mesh>
      <mesh position={[0.18, 2.72, -0.02]}>
        <boxGeometry args={[0.54, 0.2, 0.24]} />
        <meshStandardMaterial {...materialProps(COLORS.sageDark, opacity)} />
      </mesh>
      <group ref={bladeRef} position={[0.46, 2.72, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 24, 16]} />
          <meshStandardMaterial {...materialProps(COLORS.navy, opacity)} />
        </mesh>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((rotation) => (
          <mesh
            key={rotation}
            position={[
              Math.cos(rotation) * 0.38,
              Math.sin(rotation) * 0.38,
              0,
            ]}
            rotation={[0, 0, rotation - Math.PI / 2]}
          >
            <boxGeometry args={[0.1, 0.82, 0.035]} />
            <meshStandardMaterial {...materialProps(COLORS.sage, opacity)} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const GpuContainer = ({ position = [0, 0, 0], scale = 1, opacity = 1 }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.32, 0]}>
      <boxGeometry args={[1.55, 0.64, 0.78]} />
      <meshStandardMaterial {...materialProps(COLORS.amber, opacity)} />
    </mesh>
    <mesh position={[0, 0.67, -0.01]}>
      <boxGeometry args={[1.58, 0.05, 0.8]} />
      <meshStandardMaterial {...materialProps(COLORS.amberDark, opacity)} />
    </mesh>
    {[-0.58, -0.32, -0.06, 0.2, 0.46].map((x) => (
      <mesh key={x} position={[x, 0.33, -0.405]}>
        <boxGeometry args={[0.035, 0.54, 0.025]} />
        <meshStandardMaterial {...materialProps(COLORS.navy, opacity * 0.75)} />
      </mesh>
    ))}
    {[-0.36, 0.2, 0.58].map((x) => (
      <mesh key={x} position={[x, 0.73, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 24]} />
        <meshStandardMaterial {...materialProps(COLORS.navy, opacity * 0.85)} />
      </mesh>
    ))}
  </group>
);

const ProvenanceNode = ({ position = [0, 0, 0], opacity = 1, scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.34, 0.055, 16, 48]} />
      <meshStandardMaterial {...materialProps(COLORS.navy, opacity)} />
    </mesh>
    <mesh>
      <boxGeometry args={[0.34, 0.34, 0.12]} />
      <meshStandardMaterial {...materialProps(COLORS.cream, opacity)} />
    </mesh>
    <mesh position={[0.02, 0.02, 0.08]}>
      <boxGeometry args={[0.16, 0.16, 0.08]} />
      <meshStandardMaterial {...materialProps(COLORS.sage, opacity)} />
    </mesh>
    <mesh position={[0.18, -0.14, 0.08]}>
      <boxGeometry args={[0.12, 0.12, 0.08]} />
      <meshStandardMaterial {...materialProps(COLORS.amber, opacity)} />
    </mesh>
  </group>
);

const WindCoreUnit = ({
  position = [0, 0, 0],
  scale = 1,
  opacity = 1,
  wireOpacity = 1,
  containerOpacity = 1,
}) => (
  <group position={position} scale={scale}>
    <WindTurbine position={[-1.35, 0, 0]} opacity={opacity} />
    <BlueprintLine
      from={[-1.25, 0.12, 0]}
      to={[0.86, 0.12, 0]}
      color={COLORS.navy}
      opacity={wireOpacity}
      radius={0.02}
    />
    <GpuContainer position={[1.28, 0, 0]} opacity={containerOpacity} />
  </group>
);

const DataCampus = ({ position = [0, 0, 0], opacity = 1, scale = 1 }) => (
  <group position={position} scale={scale}>
    {[0, 0.52, 1.04].map((x, index) => (
      <mesh key={x} position={[x, 0.42, index % 2 ? 0.28 : -0.18]}>
        <boxGeometry args={[0.38, 0.84, 0.52]} />
        <meshStandardMaterial
          {...materialProps(index === 1 ? COLORS.amber : COLORS.amberDark, opacity)}
        />
      </mesh>
    ))}
    <BlueprintLine
      from={[-0.38, 0.06, 0]}
      to={[1.42, 0.06, 0]}
      color={COLORS.navy}
      opacity={opacity}
      radius={0.016}
    />
  </group>
);

const SceneCamera = ({ progress }) => {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const cameraTarget = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const pullback = smooth(0.72, 0.98, progress);
    target.set(0.4 + pullback * 1.7, 1.35 + pullback * 0.45, 0);
    cameraTarget.set(
      0.2 + pullback * 2.1,
      2.6 + pullback * 3.2,
      6.2 + pullback * 5.8
    );
    camera.position.lerp(cameraTarget, 0.08);
    camera.lookAt(target);
  });

  return null;
};

const WindCoreScene = ({ progress }) => {
  const wire = smooth(0.15, 0.3, progress);
  const container = smooth(0.28, 0.43, progress);
  const provenance = smooth(0.42, 0.58, progress);
  const farm = smooth(0.57, 0.78, progress);
  const overview = smooth(0.76, 0.98, progress);

  const farmUnits = [
    [-4.2, 0, -1.6, 0.64],
    [-4.1, 0, 1.35, 0.58],
    [-1.9, 0, -2.2, 0.54],
    [-1.45, 0, 1.9, 0.48],
    [0.7, 0, -2.3, 0.46],
  ];

  return (
    <>
      <color attach="background" args={[COLORS.cream]} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} />
      <directionalLight position={[-5, 4, -4]} intensity={0.9} />
      <SceneCamera progress={progress} />

      <group position={[-0.25, 0, 0]}>
        <gridHelper args={[13, 26, COLORS.grid, COLORS.grid]} position={[0, -0.01, 0]} />
        <WindCoreUnit
          opacity={1}
          wireOpacity={wire}
          containerOpacity={container}
        />
        <ProvenanceNode
          position={[0.2, 0.78, 0]}
          opacity={provenance}
          scale={1 + provenance * 0.08}
        />
        <BlueprintLine
          from={[0.54, 0.74, 0]}
          to={[1.05, 0.55, 0]}
          color={COLORS.amberDark}
          opacity={provenance}
          radius={0.014}
        />

        <group>
          {farmUnits.map(([x, y, z, unitScale]) => (
            <WindCoreUnit
              key={`${x}-${z}`}
              position={[x, y, z]}
              scale={unitScale}
              opacity={farm * 0.88}
              wireOpacity={farm * 0.75}
              containerOpacity={farm * 0.9}
            />
          ))}
        </group>

        <group position={[4.65, 0, 0.15]}>
          <ProvenanceNode
            position={[-0.65, 0.78, 0]}
            opacity={overview}
            scale={1.25}
          />
          <BlueprintLine
            from={[0, 0.2, 0]}
            to={[1.38, 0.2, 0]}
            color={COLORS.navy}
            opacity={overview}
            radius={0.024}
          />
          <DataCampus position={[1.92, 0, 0]} opacity={overview} scale={1.08} />
        </group>
      </group>
    </>
  );
};

const WindCoreScrollytelling = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const lastStoryState = useRef({ activeBeat: -1, progress: -1 });
  const [activeBeat, setActiveBeat] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  usePinnedScrollProgress({
    sectionRef,
    pinRef,
    frames: storyBeats.length,
    onUpdate: (nextProgress) => {
      const nextBeat = Math.min(
        Math.floor(nextProgress * storyBeats.length),
        storyBeats.length - 1
      );
      const last = lastStoryState.current;

      if (
        nextBeat === last.activeBeat &&
        Math.abs(nextProgress - last.progress) <= 0.002
      ) {
        return;
      }

      lastStoryState.current = {
        activeBeat: nextBeat,
        progress: nextProgress,
      };
      setActiveBeat(nextBeat);
      setScrollProgress(nextProgress);
    },
  });

  return (
    <section
      id="blueprint"
      className="scrolly"
      data-active-beat={activeBeat}
      data-progress={scrollProgress.toFixed(2)}
      ref={sectionRef}
    >
      <div className="scrolly-pin" ref={pinRef}>
        <div className="scrolly-canvas-shell">
          <Canvas
            className="scrolly-canvas"
            camera={{ position: [0.2, 2.6, 6.2], fov: 42 }}
            dpr={[1, 1.75]}
          >
            <WindCoreScene progress={scrollProgress} />
          </Canvas>
        </div>

        <div className="story-card" aria-live="polite">
          <span>{storyBeats[activeBeat].kicker}</span>
          <h2>{storyBeats[activeBeat].title}</h2>
          <p>{storyBeats[activeBeat].body}</p>
          <div className="story-progress">
            {storyBeats.map((beat, index) => (
              <i
                key={beat.title}
                className={index <= activeBeat ? "active" : ""}
              />
            ))}
          </div>
        </div>

        <div
          className={
            scrollProgress > 0.82 ? "overview-labels active" : "overview-labels"
          }
        >
          <p>Physical wind supply</p>
          <p>Compliance-grade compute</p>
          <p>Data and workload demand</p>
        </div>
      </div>
    </section>
  );
};

export default WindCoreScrollytelling;
