import styled from "styled-components";
import Select from "react-select";
import {
  PetOption,
  CardCount,
  PictureCount,
  pictureCountState,
  cardCountState,
  petChoiceState,
  appState,
  shouldShuffleCardsState,
  shouldApplyRotationsState,
} from "../appAtoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGameInitialization } from "../gameLogic";

const SidebarContainer = styled.nav`
  display: flex;
  color: black;
  text-align: center;
  padding: 16px;
  gap: 16px;
  font-family: arial;
  flex-direction: column;
  & h1,
  span {
    color: white;
  }
  & input {
    border-radius: 4px;
    height: 40px;
    text-indent: 16px;
  }
  & button {
    height: 40px;
  }
`;

const petOptions: ReadonlyArray<PetOption> = [
  "Vainihoney",
  "Vainilla",
  "Honey",
];

const cardCountOptions: ReadonlyArray<CardCount> = [4, 9];

const picCountOptions: ReadonlyArray<PictureCount> = [2, 3, 4, 5, 6];

export const Sidebar: React.FC = () => {
  const [cardCount, setCardCount] = useRecoilState(cardCountState);
  const [pictureCount, setPictureCount] = useRecoilState(pictureCountState);
  const [petChoice, setPetChoice] = useRecoilState(petChoiceState);
  const [shouldShuffleCards, setShouldShuffleCards] = useRecoilState(
    shouldShuffleCardsState
  );
  const [shouldApplyRotations, setShouldApplyRotations] = useRecoilState(
    shouldApplyRotationsState
  );

  const setAppStatus = useSetRecoilState(appState);
  const startGame = useGameInitialization();

  return (
    <SidebarContainer>
      <h1>Configuración:</h1>
      <label>
        <span>cuantas cartas?</span>
        <Select
          value={{ label: cardCount, value: cardCount }}
          placeholder="Cuantas cartas?"
          options={cardCountOptions.map((p) => ({
            label: p,
            value: p,
          }))}
          onChange={(newValue) => setCardCount(newValue?.value ?? 4)}
        />
      </label>
      <label>
        <span>cuantas fotos?</span>
        <Select
          value={{ label: pictureCount, value: pictureCount }}
          placeholder="Cuantas fotos?"
          options={picCountOptions.map((p) => ({
            label: p,
            value: p,
          }))}
          onChange={(newValue) => setPictureCount(newValue?.value ?? 4)}
        />
      </label>
      <label>
        <span>fotitos de quien?</span>
        <Select
          value={{ label: petChoice, value: petChoice }}
          placeholder="Fotitos de quien?"
          options={petOptions.map((p) => ({ label: p, value: p }))}
          onChange={(newValue) => setPetChoice(newValue?.value ?? "Vainihoney")}
        />
      </label>
      <span style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={shouldShuffleCards}
          onChange={(e) => {
            setShouldShuffleCards(e.currentTarget.checked);
          }}
        />
        <span style={{ paddingLeft: 8 }}>revolver cartas?</span>
      </span>
      <span style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={shouldApplyRotations}
          onChange={(e) => {
            setShouldApplyRotations(e.currentTarget.checked);
          }}
        />
        <span style={{ paddingLeft: 8 }}>girar cartas?</span>
      </span>
      <button
        onClick={() => {
          setAppStatus("PLAYING");
          startGame();
        }}
      >
        INICIAR!
      </button>
    </SidebarContainer>
  );
};
