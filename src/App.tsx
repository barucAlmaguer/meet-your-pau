import styled from "styled-components";

const AppContainer = styled.div`
  display: grid;
  grid-template-areas: sidebar game;
  grid-template-columns: 200px 1fr;
  width: 100%;
  height: 100%;
  background-color: darkslateblue;
  color: white;
`;

function App() {
  return (
    <AppContainer>
      <div>sidebar</div>
      <div>Pau game goes here :nerd:</div>
    </AppContainer>
  );
}

export default App;
