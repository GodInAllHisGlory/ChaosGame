import Konva from 'konva';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Layer, Stage } from 'react-konva';
import './Game.css';

function Game(){
  const [totalCorners, updateTotalCorners] = useState(3);
  const [nodes, addNode] = useState([]);
  const [cornersList, setCornersList] = useState([]);
  const [chosen, updateChosen] = useState(0);
  const [scale, updateScale] = useState(1);
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
  }, [totalCorners, scale, centerX, centerY, cornerOffset, chosen]);

  //Resets canvas
  useEffect(() => {
    for (let node of nodes) {
      node.destroy();
    }
    addNode([]);

    const chosenCorners = new Array(chosen);
    const startPoint = getRandomCorner(chosenCorners);
    const pointer = { x: startPoint.x, y: startPoint.y };
    const timer = setInterval(() => { //Draws the points
      const nextPoint = getRandomCorner(chosenCorners);
      chosenCorners.push(nextPoint);
      if(chosenCorners.length > chosen) {chosenCorners.shift();}
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

  function getRandomCorner(corners){
    if (cornersList.length === 0) {
      return { x: centerX, y: centerY };
    }

    let corner = cornersList[Math.floor(Math.random() * cornersList.length)];
    while(corners.includes(corner)) {corner = cornersList[Math.floor(Math.random() * cornersList.length)];}
    return corner
  }

  return (
    <div>
      <div id='controls'>
        <label>Number of corners:
          <input type='number' value={totalCorners} onChange={(e) => {
            const value = e.target.value;
            if (value <= 2) {return}
            updateTotalCorners(value);
          }}></input>
        </label>
        <label>Corner can't be chosen:
          <input type='number' value={chosen} onChange={(e) => {
            const value = e.target.value;
            if (value < 0 || value > totalCorners - 1) {return;}
            console.log("Updated?");
            updateChosen(value);
          }}></input>
        </label>
      </div>
      <Stage width={width} height={height}>
        <Layer ref={layerRef}>
          {cornerCircles}
        </Layer>
      </Stage>
    </div>
  );
}

export default Game;