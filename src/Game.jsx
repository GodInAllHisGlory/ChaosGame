import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Circle, Layer, Stage } from 'react-konva';

function Game(){
  const [totalCorners, updateTotalCorners] = useState(3);
  const [nodes, addNode] = useState([]);
  const [scale, updateScale] = useState(1);
  const cornersList = useRef([]);
  const layerRef = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerY = height / 2;
  const centerX = width / 2;
  const cornerOffset = Math.PI / totalCorners;

  useEffect(() => {
    cornersList.current = Array.from({ length: totalCorners }, (_, corner) => {
      const theta = (Math.PI * 2) / totalCorners;
      const radius = 400 * scale;
      const angle = (theta * corner) + cornerOffset;

      return {
        x: radius * Math.cos(angle) + centerX,
        y: radius * Math.sin(angle) + centerY,
      };
    });
  }, [totalCorners, scale, centerX, centerY, cornerOffset]);

  //Resets canvas
  useEffect(() => {
    for (let node of nodes) {
      node.destroy();
    }
    addNode([]);

    const startPoint = getRandomCorner();
    const pointer = { x: startPoint.x, y: startPoint.y };
    const timer = setInterval(() => {
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
    }, 1);
    return () => clearInterval(timer);
  }, [totalCorners, cornerOffset]);

  // const updateCornerPosition = (e) => {
  //   e.target.x();
  //   e.target.y();
  // }
  //creates initial points where the other points are drawn
  function createCorners(theta, corner, radius){
    const angle = (theta * corner) + cornerOffset;
    const pointX = radius * Math.cos(angle) + centerX;
    const pointY = radius * Math.sin(angle) + centerY;

    return (
      <Circle
        x={pointX}
        y={pointY}
        radius={10}
        fill="green"
        key={`Corner-${corner}`}
        draggable
        // onDragEnd={updateCornerPosition}
      />
    );
  }


  function getRandomCorner(){
    if (cornersList.current.length === 0) {
      return { x: centerX, y: centerY };
    }

    return cornersList.current[Math.floor(Math.random() * cornersList.current.length)];
  }

  return (
    <div>
      <button onClick={() => updateTotalCorners(totalCorners => totalCorners + 1)}>Add One</button>
      <Stage width={width} height={height}>
        <Layer ref={layerRef}>
          {Array.from({ length: totalCorners }, (_, i) => {
            const theta = (Math.PI * 2) / totalCorners;
            const radius = 400 * scale;
            return createCorners(theta, i, radius);
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default Game;