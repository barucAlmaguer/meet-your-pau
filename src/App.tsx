import styled from "styled-components";
import { Game } from "./components";
import boardBackground from "./assets/background-wood.jpeg";

const AppContainer = styled.div`
  display: grid;
  grid-template-areas: sidebar game;
  grid-template-columns: 200px 1fr;
  /* grid-template-areas: game;
  grid-template-columns: 1fr; */
  width: 100%;
  height: 100%;
  background-color: brown;
  color: white;
`;

const SidebarContainer = styled.nav`
  /* border: 1px solid pink; */
`;

const GameContainer = styled.main`
  display: grid;
  place-items: center;
  background-image: url(${boardBackground});
`;

function App() {
  return (
    <AppContainer>
      <SidebarContainer>sidebar</SidebarContainer>
      <GameContainer>
        <Game />
      </GameContainer>
    </AppContainer>
  );
}

export default App;
