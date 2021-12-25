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
} from "../appAtoms";
import { useRecoilState } from "recoil";

const SidebarContainer = styled.nav`
  display: flex;
  color: black;
  text-align: center;
  padding: 16px;
  gap: 16px;
  font-family: arial;
  flex-direction: column;
  & h1 {
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
  const [appStatus, setAppStatus] = useRecoilState(appState);

  return (
    <SidebarContainer>
      <h1>Configuración:</h1>
      <Select
        value={{ label: cardCount, value: cardCount }}
        placeholder="Cuantas cartas?"
        options={cardCountOptions.map((p) => ({
          label: p,
          value: p,
        }))}
        onChange={(newValue) => setCardCount(newValue?.value ?? 4)}
      />
      <Select
        value={{ label: pictureCount, value: pictureCount }}
        placeholder="Cuantas fotos?"
        options={picCountOptions.map((p) => ({
          label: p,
          value: p,
        }))}
        onChange={(newValue) => setPictureCount(newValue?.value ?? 4)}
      />
      <Select
        value={{ label: petChoice, value: petChoice }}
        placeholder="Fotitos de quien?"
        options={petOptions.map((p) => ({ label: p, value: p }))}
        onChange={(newValue) => setPetChoice(newValue?.value ?? "Vainihoney")}
      />
      <button
        onClick={() => {
          setAppStatus(appStatus === "SETUP" ? "PLAYING" : "SETUP");
        }}
      >
        {appStatus === "SETUP" ? "INICIAR!" : "IR A MENU"}
      </button>
    </SidebarContainer>
  );
};
