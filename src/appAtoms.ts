import { atom, atomFamily } from "recoil";

export type DirectionOption = "top" | "right" | "bottom" | "left";
export type RotationOption = 0 | 90 | 180 | 270 | 360;

/**
 * TODO:
 * 1. Config options:
 *      amount of cards = 4 | 9 |  # ! NOT YET: 16
 *      difficulty (number of pictures) =
 *        4 => [2, 4]
 *        9 => [2, 12]
 *        16 => ???
 *      pets = Vainilla | Honey | Ambas
 */

export type AppStateOption = "SETUP" | "PLAYING";
export type CardCount = 4 | 9;
export type PictureCount = 2 | 3 | 4 | 5 | 6;
export type PetOption = "Vainilla" | "Honey" | "Vainihoney";

export const appState = atom<AppStateOption>({
  key: "pieceRotation",
  default: "SETUP",
});

export const cardCountState = atom<CardCount>({
  key: "cardCount",
  default: 4,
});

export const pictureCountState = atom<PictureCount>({
  key: "pictureCount",
  default: 4,
});

export const petChoiceState = atom<PetOption>({
  key: "petChoice",
  default: "Vainihoney",
});

export const shouldShuffleCardsState = atom<boolean>({
  key: "shouldShuffleCards",
  default: true,
});
export const shouldApplyRotationsState = atom<boolean>({
  key: "shouldApplyRotations",
  default: true,
});

// each piece has a configuration of its own:
export interface GamePieceImages {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export const pieceImagesState = atomFamily<GamePieceImages, number>({
  key: "pieceImages",
  default: {
    top: "",
    right: "",
    bottom: "",
    left: "",
  },
});

interface TranslateData {
  deltaX: number;
  deltaY: number;
}

// each piece has a translation (the amount of pixels the user moved it)
export const pieceOffsetState = atomFamily<TranslateData | undefined, number>({
  key: "pieceOffset",
  default: undefined,
});

export const pieceRotationState = atomFamily<RotationOption, number>({
  key: "pieceRotation",
  default: 0,
});

export const gamePiecesState = atom<number[]>({
  key: "gamePieces",
  default: [],
});
