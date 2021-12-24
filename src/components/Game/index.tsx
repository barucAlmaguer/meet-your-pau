import Draggable from "react-draggable";
import styled, { css } from "styled-components";
import { atomFamily, useRecoilState } from "recoil";
import { RotateCw } from "react-feather";
import honey1 from "../../assets/honey-1.png";
import honey2 from "../../assets/honey-2.png";
import honey3 from "../../assets/honey-xmas.png";
import vainilla1 from "../../assets/vainilla-1.png";
import vainilla2 from "../../assets/vainilla-2.png";
import vainilla3 from "../../assets/vainilla-xmas.png";

type RotationOption = 0 | 90 | 180 | 270 | 360;

const nextRotation: Record<RotationOption, RotationOption> = {
  0: 90,
  90: 180,
  180: 270,
  270: 360,
  360: 90,
};

const pieceRotationState = atomFamily<RotationOption, number>({
  key: "pieceRotation",
  default: 0,
});

const BoardContainer = styled.div<{ $size: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $size }) => $size}, 1fr);
  gap: 1px;
  width: 600px;
  height: 600px;
  background-color: transparent;
  color: black;
`;

const BoardPieceContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border: 1px solid gray;
  background-color: white;
  border-radius: 8px;
  transition: transform 200ms ease-in-out;
  --shadow-color: 32deg 100% 18%;
  box-shadow: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.42),
    1.8px 3.5px 4.4px -0.4px hsl(var(--shadow-color) / 0.42),
    3.3px 6.7px 8.4px -0.7px hsl(var(--shadow-color) / 0.42),
    5.5px 11.1px 13.9px -1.1px hsl(var(--shadow-color) / 0.42),
    8.9px 17.8px 22.4px -1.4px hsl(var(--shadow-color) / 0.42);
`;

interface BoardPieceImageProps {
  $position: "top" | "right" | "bottom" | "left";
}

function getPositioningStyles({ $position }: BoardPieceImageProps) {
  switch ($position) {
    case "top":
      return css`
        background-size: contain;
        background-image: url(${honey1});
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
      `;
    case "right":
      return css`
        background-size: contain;
        background-image: url(${honey2});
        transform: rotate(90deg);
        right: 0;
        top: 50%;
        transform: translate(50%, -50%) rotate(90deg);
      `;
    case "bottom":
      return css`
        background-size: contain;
        background-image: url(${honey3});
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
      `;
    case "left":
      return css`
        background-size: contain;
        background-image: url(${vainilla1});
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%) rotate(90deg);
      `;
  }
}

const BoardPieceImage = styled.img<BoardPieceImageProps>`
  position: absolute;
  width: 30%;
  height: 70%;
  ${getPositioningStyles}
`;

const RotationHandlerButton = styled.button`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #34a4ff;
  box-shadow: 2px 2px 4px grey;
  color: #2473b3;
  &:hover {
    background-color: #d6edff;
  }
  &:active {
    background-color: #aedbff;
  }
`;

const BoardPieceWrapper = styled.span`
  position: relative;
  &.react-draggable-dragging {
    z-index: 1;
  }
`;

const BoardPiece: React.FC<{ position: number }> = ({ children, position }) => {
  const [rotation, setRotation] = useRecoilState(pieceRotationState(position));
  return (
    <Draggable cancel="button" grid={[20, 20]}>
      {/* span to allow transforming the inner element freely without transformation clashes */}
      <BoardPieceWrapper>
        <RotationHandlerButton
          onClick={() => {
            setRotation((current) => nextRotation[current]);
          }}
        >
          <RotateCw width={16} height={16} />
        </RotationHandlerButton>
        <BoardPieceContainer style={{ transform: `rotate(${rotation}deg)` }}>
          <BoardPieceImage $position="top" />
          <BoardPieceImage $position="right" />
          <BoardPieceImage $position="bottom" />
          <BoardPieceImage $position="left" />
        </BoardPieceContainer>
      </BoardPieceWrapper>
    </Draggable>
  );
};

function Game() {
  const gameSize = 3;
  const gamePieces = new Array(gameSize * gameSize)
    .fill(0)
    .map((_, i) => <BoardPiece key={i} position={i} />);
  return <BoardContainer $size={gameSize}>{gamePieces}</BoardContainer>;
}

export { Game };
