import styled from "styled-components";
import { Game } from "./components";

const AppContainer = styled.div`
  display: grid;
  grid-template-areas: sidebar game;
  grid-template-columns: 200px 1fr;
  width: 100%;
  height: 100%;
  background-color: darkslateblue;
  color: white;
`;

const SidebarContainer = styled.nav`
  border: 1px solid pink;
`;

const GameContainer = styled.main`
  display: grid;
  place-items: center;
  border: 1px solid red;
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
