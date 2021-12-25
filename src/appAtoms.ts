import { atom } from "recoil";

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
