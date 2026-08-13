import { useEffect, useRef, useState } from 'react';
import { Circle, Layer, Stage } from 'react-konva';

function Game(){
  const [totalCorners, updateTotalCorners] = useState(3);
  const [cornerOffset, updateCornerOffset] = useState(Math.PI/totalCorners);
  const [scale, updateScale] = useState(1);
  const stageRef = useRef(null);
  const width=window.innerWidth; 
  const height=window.innerHeight;
  const centerY = height/2;
  const centerX = width/2;

    useEffect(() => {
      stageRef.current.batchDraw();
    }, [totalCorners, cornerOffset]);

  function createCorners(corner, theta, radius){
      let angle = (theta * corner) + cornerOffset;
      let pointX = radius * Math.cos(angle) + centerX;
      let pointY = radius * Math.sin(angle) + centerY;
      return(
        <Circle
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
    <Stage ref={stageRef} width={width} height={height}>
      <Layer>
       {Array.from({ length: totalCorners }, (_, i) => {
        let theta = (Math.PI * 2) / totalCorners;
        let radius = 400 * scale //Radius of the ring the points get spaced out on
        return createCorners(i, theta, radius);
        })}
      </Layer>
    </Stage>
  );
}

export default Game;