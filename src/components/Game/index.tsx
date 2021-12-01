import styled, { css } from "styled-components";

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
  --shadow-color: 32deg 100% 18%;
  box-shadow: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.42),
    1.8px 3.5px 4.4px -0.4px hsl(var(--shadow-color) / 0.42),
    3.3px 6.7px 8.4px -0.7px hsl(var(--shadow-color) / 0.42),
    5.5px 11.1px 13.9px -1.1px hsl(var(--shadow-color) / 0.42),
    8.9px 17.8px 22.4px -1.4px hsl(var(--shadow-color) / 0.42),
    13.9px 27.8px 35px -1.8px hsl(var(--shadow-color) / 0.42),
    21.2px 42.4px 53.3px -2.1px hsl(var(--shadow-color) / 0.42),
    31.3px 62.5px 78.6px -2.5px hsl(var(--shadow-color) / 0.42);
`;

interface BoardPieceImageProps {
  $position: "top" | "right" | "bottom" | "left";
}

function getPositioningStyles({ $position }: BoardPieceImageProps) {
  switch ($position) {
    case "top":
      return css`
        background-color: red;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
      `;
    case "right":
      return css`
        background-color: green;
        transform: rotate(90deg);
        right: 0;
        top: 50%;
        transform: translate(50%, -50%) rotate(90deg);
      `;
    case "bottom":
      return css`
        background-color: blue;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
      `;
    case "left":
      return css`
        background-color: yellow;
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

const BoardPiece: React.FC = ({ children }) => {
  return (
    <BoardPieceContainer>
      <BoardPieceImage $position="top" />
      <BoardPieceImage $position="right" />
      <BoardPieceImage $position="bottom" />
      <BoardPieceImage $position="left" />
    </BoardPieceContainer>
  );
};

function Game() {
  const gameSize = 3;
  const gamePieces = new Array(gameSize * gameSize)
    .fill(0)
    .map((_, i) => <BoardPiece key={i} />);
  return <BoardContainer $size={gameSize}>{gamePieces}</BoardContainer>;
}

export { Game };
