import Konva from 'konva';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Layer, Stage } from 'react-konva';

function Game(){
  const [totalCorners, updateTotalCorners] = useState(3);
  const [nodes, addNode] = useState([]);
  const [scale, updateScale] = useState(1);
  const [cornersList, setCornersList] = useState([]);
  const cornersRef = useRef([]);
  const layerRef = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerY = height / 2;
  const centerX = width / 2;
  const cornerOffset = Math.PI / totalCorners;

  const cornerCircles = useMemo(() => {
    const newCorners = Array.from({ length: totalCorners }, (_, corner) => {
      const theta = (Math.PI * 2) / totalCorners;
      const radius = 400 * scale;
      const angle = (theta * corner) + cornerOffset;

      return {
        x: radius * Math.cos(angle) + centerX,
        y: radius * Math.sin(angle) + centerY,
      };
    });
    cornersRef.current = newCorners;
    setCornersList(newCorners);

    return newCorners.map((corner, idx) => (
      <Circle
        key={`Corner-${idx}`}
        x={corner.x}
        y={corner.y}
        radius={10}
        fill="green"
        draggable
        onDragEnd={(e) => {
          cornersRef.current[idx] = { x: e.target.x(), y: e.target.y() };
          setCornersList([...cornersRef.current]);
        }}
      />
    ));
  }, [totalCorners, scale, centerX, centerY, cornerOffset]);

  //Resets canvas
  useEffect(() => {
    for (let node of nodes) {
      node.destroy();
    }
    addNode([]);

    const startPoint = getRandomCorner();
    const pointer = { x: startPoint.x, y: startPoint.y };
    const timer = setInterval(() => { //Draws the points
      const nextPoint = getRandomCorner();
      pointer.x += (nextPoint.x - pointer.x) / 2;
      pointer.y += (nextPoint.y - pointer.y) / 2;
      const node = new Konva.Circle({
        x: pointer.x,
        y: pointer.y,
        radius: 2,
        fill: "green",
      });
      addNode(prev => [...prev, node]);
      layerRef.current?.add(node);
    }, 1000);
    return () => clearInterval(timer);
  }, [totalCorners, cornerOffset, cornersList]);

  // const updateCornerPosition = (e) => {
  //   e.target.x();
  //   e.target.y();
  // }

  function getRandomCorner(){
    if (cornersList.length === 0) {
      return { x: centerX, y: centerY };
    }

    return cornersList[Math.floor(Math.random() * cornersList.length)];
  }

  return (
    <div>
      <button onClick={() => updateTotalCorners(totalCorners => totalCorners + 1)}>Add One</button>
      <Stage width={width} height={height}>
        <Layer ref={layerRef}>
          {cornerCircles}
        </Layer>
      </Stage>
    </div>
  );
}

export default Game;