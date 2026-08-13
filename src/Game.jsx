import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Circle, Layer, Stage } from 'react-konva';

function Game(){
  const [totalCorners, updateTotalCorners] = useState(3);
  const [cornerOffset, updateCornerOffset] = useState(Math.PI / 3);
  const [nodes, addNode] = useState([]);
  const [scale, updateScale] = useState(1);
  const cornersList = useRef([]);
  const layerRef = useRef(null);
  const width=window.innerWidth; 
  const height=window.innerHeight;
  const centerY = height/2;
  const centerX = width/2;

  useEffect(() => {
    cornersList.current = Array.from({ length: totalCorners }, () => null);
    updateCornerOffset(Math.PI / totalCorners);
  }, [totalCorners]);

  //Resets canvas
    useEffect(() => {
      for(let node of nodes){
        node.destroy();
      }
      addNode([]);

      const timer = setInterval(() => {
        const node = new Konva.Circle({
          x: Math.random() * 100,
          y: Math.random() * 100,
          radius: 4,
          fill: "green",
        });
        addNode(prev => [...prev, node])
        layerRef.current.add(node);
      }, 1000);
      return () => clearInterval(timer);
    }, [totalCorners, cornerOffset]);

  //creates initial points where the other points are drawn
  function createCorners(theta, corner, radius){
      let angle = (theta * corner) + cornerOffset;
      let pointX = radius * Math.cos(angle) + centerX;
      let pointY = radius * Math.sin(angle) + centerY;
      return(
        <Circle ref={(node) => {
          cornersList.current[corner] = node;
        }}
          x={pointX}
          y={pointY}
          radius={10}
          fill="green"
          key={`Corner-${corner}`}
          draggable
        />
      )
  }

  return (
    <div>
      <button onClick={() => updateTotalCorners(totalCorners => totalCorners + 1)}>Add One</button>
      <Stage width={width} height={height}>
        <Layer ref={layerRef}>
          {Array.from({ length: totalCorners }, (_, i) => {
            let theta = (Math.PI * 2) / totalCorners;
            let radius = 400 * scale //Radius of the ring the points get spaced out on
            return createCorners(theta, i, radius);
            })}
        </Layer>
    </Stage>
    </div>
  );
}

export default Game;