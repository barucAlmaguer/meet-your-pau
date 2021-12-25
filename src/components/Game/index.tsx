import Draggable from "react-draggable";
import styled, { css } from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { RotateCw } from "react-feather";
import {
  DirectionOption,
  gamePiecesState,
  pieceImagesState,
  pieceOffsetState,
  pieceRotationState,
  RotationOption,
} from "../../appAtoms";

const nextRotation: Record<RotationOption, RotationOption> = {
  0: 90,
  90: 180,
  180: 270,
  270: 360,
  360: 90,
};

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
  $position: DirectionOption;
  $imgSource: string;
}

function getPositioningStyles({ $position }: BoardPieceImageProps) {
  // ! For full-width images:
  // ! transform: translate(-50%, -50%) rotate(45deg);
  switch ($position) {
    case "top":
      return css`
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      `;
    case "right":
      return css`
        transform: rotate(90deg);
        right: 0;
        top: 50%;
        transform: translate(50%, -50%) rotate(45deg);
      `;
    case "bottom":
      return css`
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%) rotate(45deg);
      `;
    case "left":
      return css`
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%) rotate(45deg);
      `;
  }
}

const BoardPieceImage = styled.img<BoardPieceImageProps>`
  position: absolute;
  background-size: contain;
  background-image: url(${({ $imgSource }) => $imgSource});
  width: 70%;
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
  const setOffset = useSetRecoilState(pieceOffsetState(position));
  const pieceImages = useRecoilValue(pieceImagesState(position));

  return (
    <Draggable
      cancel="button"
      grid={[20, 20]}
      onStop={(_, data) => {
        setOffset(data);
      }}
    >
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
          <BoardPieceImage $position="top" $imgSource={pieceImages.top} />
          <BoardPieceImage $position="right" $imgSource={pieceImages.right} />
          <BoardPieceImage $position="bottom" $imgSource={pieceImages.bottom} />
          <BoardPieceImage $position="left" $imgSource={pieceImages.left} />
        </BoardPieceContainer>
      </BoardPieceWrapper>
    </Draggable>
  );
};

function Game() {
  const gamePieces = useRecoilValue(gamePiecesState);
  // square root lol
  const gameSize = { 4: 2, 9: 3 }[gamePieces.length]!;
  return (
    <BoardContainer $size={gameSize}>
      {gamePieces.map((_, i) => (
        <BoardPiece key={i} position={i} />
      ))}
    </BoardContainer>
  );
}

export { Game };
