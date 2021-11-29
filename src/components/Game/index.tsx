import styled from "styled-components";

const BoardContainer = styled.div<{ $size: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $size }) => $size}, 1fr);
  width: 600px;
  height: 600px;
  border: 1px solid green;
  background-color: white;
  color: black;
`;

const BoardPieceContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid gray;
`;

function Game() {
  const gameSize = 3;
  const gamePieces = new Array(gameSize * gameSize)
    .fill(0)
    .map((_, i) => (
      <BoardPieceContainer key={i}>piece #{i}</BoardPieceContainer>
    ));
  return <BoardContainer $size={gameSize}>{gamePieces}</BoardContainer>;
}

export { Game };
