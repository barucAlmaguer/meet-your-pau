import { useRecoilTransaction_UNSTABLE } from "recoil";
import {
  DirectionOption,
  gamePiecesState,
  PetOption,
  pieceImagesState,
  petChoiceState,
  pictureCountState,
  PictureCount,
  cardCountState,
  GamePieceImages,
  CardCount,
  pieceRotationState,
  RotationOption,
  shouldShuffleCardsState,
  shouldApplyRotationsState,
} from "./appAtoms";
import honey1 from "./assets/honey-1.png";
import honey2 from "./assets/honey-2.png";
import honey3 from "./assets/honey-xmas.png";
import vainilla1 from "./assets/vainilla-1.png";
import vainilla2 from "./assets/vainilla-2.png";
import vainilla3 from "./assets/vainilla-xmas.png";

interface PictureDescriptor {
  source: string;
  pet: Exclude<PetOption, "Vainihoney">;
}

const allPictures: PictureDescriptor[] = [
  {
    source: honey1,
    pet: "Honey",
  },
  {
    source: vainilla1,
    pet: "Vainilla",
  },
  {
    source: honey2,
    pet: "Honey",
  },
  {
    source: vainilla2,
    pet: "Vainilla",
  },
  {
    source: honey3,
    pet: "Honey",
  },
  {
    source: vainilla3,
    pet: "Vainilla",
  },
];

/**
 * ? Config options:
 *      amount of cards = 4 | 9 |  # ! NOT YET: 16
 *      difficulty (number of pictures) =
 *        4 => [2, 4]
 *        9 => [2, 12]
 *        16 => ???
 *      pets = Vainilla | Honey | Ambas
 *
 * ! App logic:
 * 1. config options
 * 2. press start
 * 3. pick random pictures by config
 * 4. generate random cards according to config, pics and game logic (overlap pictures with adjacent ones)
 * 5. shuffle Cards and apply random rotations to each one
 * 6. Start game! (Maybe some alert() thingy)
 * 7. validate correct match between cards based on position and rotation (validate same pic in touching edges)
 * 8. if the required amount of edges have a match, YOU HAVE WON!
 */

function getFilteredPictures(petChoice: PetOption): PictureDescriptor[] {
  return allPictures.filter((pic) => {
    switch (pic.pet) {
      case "Honey":
        return petChoice === "Honey" || petChoice === "Vainihoney";
      case "Vainilla":
        return petChoice === "Vainilla" || petChoice === "Vainihoney";
      default:
        return true;
    }
  });
}

function getRandomPick<T>(arr: T[]): T {
  const randomPosition = Math.floor(Math.random() * arr.length);
  const randomElement = arr[randomPosition];
  console.log({ randomPosition });
  return randomElement;
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function randomizePictures(
  pics: PictureDescriptor[],
  maxPics: PictureCount
): PictureDescriptor[] {
  let availablePics = [...pics];
  let randomizedPics: PictureDescriptor[] = [];
  new Array(maxPics).fill(0).forEach(() => {
    const randomPick = getRandomPick(availablePics);
    randomizedPics.push(randomPick);
    availablePics = availablePics.filter((p) => p.source !== randomPick.source);
    if (availablePics.length === 0) {
      // start over if needed (just precaution)
      availablePics = [...pics];
    }
  });
  return randomizedPics;
}

type CardPosition =
  | "topLeft"
  | "top"
  | "topRight"
  | "middleLeft"
  | "middle"
  | "middleRight"
  | "bottomLeft"
  | "bottom"
  | "bottomRight";

interface CardMetadata {
  row: number;
  column: number;
  position: CardPosition;
}

// get metadata about this specific card:
// which row / column and
// cualitative position:
function getCardMetadata(index: number, cardCount: CardCount): CardMetadata {
  // square root lol
  const boardSideSize = { 4: 2, 9: 3 }[cardCount];
  const firstRow = 0;
  const firstColumn = 0;
  const lastRow = boardSideSize - 1;
  const lastColumn = boardSideSize - 1;
  const column = index % boardSideSize;
  const row = Math.floor(index / boardSideSize);
  let position: CardPosition;
  // first check corners:
  if (row === firstRow && column === firstColumn) {
    position = "topLeft";
  } else if (row === firstRow && column === lastColumn) {
    position = "topRight";
  } else if (row === lastRow && column === firstColumn) {
    position = "bottomLeft";
  } else if (row === lastRow && column === lastColumn) {
    position = "bottomRight";
  }
  // then check borders:
  else if (row === firstRow) {
    position = "top";
  } else if (row === lastRow) {
    position = "bottom";
  } else if (column === firstColumn) {
    position = "middleLeft";
  } else if (column === lastColumn) {
    position = "middleRight";
  }
  // anything else should be "in the middle" (neighbors in all directions)
  else {
    position = "middle";
  }
  return { column, row, position };
}

const defaultGamePiece: GamePieceImages = {
  top: "", // placeholder "img source"
  right: "",
  bottom: "",
  left: "",
};
const directions: ReadonlyArray<DirectionOption> = [
  "top",
  "right",
  "bottom",
  "left",
] as const;

function getRandomPieces(
  pics: PictureDescriptor[],
  cardCount: CardCount
): GamePieceImages[] {
  // square root lol
  const boardSideSize = { 4: 2, 9: 3 }[cardCount];
  // ! Return value (To be populated):
  let randomizedPieces: GamePieceImages[] = [];
  new Array(cardCount).fill(0).forEach((_, currCardIndex) => {
    // * Loop for processing EACH piece to be generated
    const cardMetadata = getCardMetadata(currCardIndex, cardCount);
    const { position } = cardMetadata;
    // ! the fun part, generate a random piece based on the context (surrounding pieces):
    let availablePics = [...pics];
    // THIS gamePiece will be shaped with the correct images and appended to the final array:
    const currentGamePiece: GamePieceImages = { ...defaultGamePiece };
    if (position === "topLeft") {
      // ! first Card, we are free to pick any images without restriction
      directions.forEach((direction) => {
        // * Loop for processing the pic to be assigned to each piece direction (Top, right, bottom, left)
        const randomPick = getRandomPick(availablePics);
        currentGamePiece[direction] = randomPick.source;
        availablePics = availablePics.filter(
          (p) => p.source !== randomPick.source
        );
        if (availablePics.length === 0) {
          // start over if needed (just precaution)
          availablePics = [...pics];
        }
      });
    } else if (position === "top" || position === "topRight") {
      // ! for the TOP cards, the LEFT image should match the previous RIGHT image
      const leftNeighbor = randomizedPieces[currCardIndex - 1];
      currentGamePiece.left = leftNeighbor.right;
      // so, we filter-out that image from the pool:
      availablePics = availablePics.filter(
        (p) => p.source !== leftNeighbor.right
      );
      // THEN, we are free to pick other images:
      const remainingDirections: ReadonlyArray<DirectionOption> = [
        "top",
        "right",
        "bottom",
      ];
      remainingDirections.forEach((direction) => {
        // * Loop for processing the pic to be assigned to each piece direction (Top, right, bottom, left)
        const randomPick = getRandomPick(availablePics);
        currentGamePiece[direction] = randomPick.source;
        availablePics = availablePics.filter(
          (p) => p.source !== randomPick.source
        );
        if (availablePics.length === 0) {
          // start over if needed (just precaution)
          availablePics = [...pics];
        }
      });
    } else if (position === "middleLeft" || position === "bottomLeft") {
      // ! for the MIDDLE LEFT cards, the TOP image should match the previous BOTTOM image
      const topNeighbor = randomizedPieces[currCardIndex - boardSideSize]; // go up a card
      currentGamePiece.top = topNeighbor.bottom;
      // so, we filter-out that image from the pool:
      availablePics = availablePics.filter(
        (p) => p.source !== topNeighbor.bottom
      );
      // THEN, we are free to pick other images:
      const remainingDirections: ReadonlyArray<DirectionOption> = [
        "right",
        "bottom",
        "left",
      ];
      remainingDirections.forEach((direction) => {
        // * Loop for processing the pic to be assigned to each piece direction (Top, right, bottom, left)
        const randomPick = getRandomPick(availablePics);
        currentGamePiece[direction] = randomPick.source;
        availablePics = availablePics.filter(
          (p) => p.source !== randomPick.source
        );
        if (availablePics.length === 0) {
          // start over if needed (just precaution)
          availablePics = [...pics];
        }
      });
    } else if (
      position === "middle" ||
      position === "middleRight" ||
      position === "bottom" ||
      position === "bottomRight"
    ) {
      // ! for the MIDDLE and MIDDLE RIGHT cards, the TOP and LEFT images should match
      // ! the previous BOTTOM and LEFT images
      const leftNeighbor = randomizedPieces[currCardIndex - 1]; // go left a card
      const topNeighbor = randomizedPieces[currCardIndex - boardSideSize]; // go up a card
      currentGamePiece.left = leftNeighbor.right;
      currentGamePiece.top = topNeighbor.bottom;
      // so, we filter-out that image from the pool:
      availablePics = availablePics.filter(
        (p) =>
          p.source !== topNeighbor.bottom && p.source !== leftNeighbor.right
      );
      if (availablePics.length === 0) {
        // start over if needed (just precaution)
        availablePics = [...pics];
      }
      // THEN, we are free to pick other images:
      const remainingDirections: ReadonlyArray<DirectionOption> = [
        "right",
        "bottom",
      ];
      remainingDirections.forEach((direction) => {
        console.log({ availablePics });
        // * Loop for processing the pic to be assigned to each piece direction (Top, right, bottom, left)
        const randomPick = getRandomPick(availablePics);
        currentGamePiece[direction] = randomPick.source;
        availablePics = availablePics.filter(
          (p) => p.source !== randomPick.source
        );
        if (availablePics.length === 0) {
          // start over if needed (just precaution)
          availablePics = [...pics];
        }
      });
    }
    randomizedPieces.push(currentGamePiece);
  });
  return randomizedPieces;
}

export const useGameInitialization = () => {
  return useRecoilTransaction_UNSTABLE(
    ({ reset, get, set }) =>
      () => {
        const petChoice = get(petChoiceState);
        const picCount = get(pictureCountState);
        const cardCount = get(cardCountState);
        // ! first of all, reset all "game state"
        reset(gamePiecesState);
        new Array(cardCount).fill(0).forEach((_, i) => {
          reset(pieceImagesState(i));
          reset(pieceRotationState(i));
        });
        // ! then, run logic to get playable cards
        const shouldShuffleCards = get(shouldShuffleCardsState);
        const shouldApplyRotations = get(shouldApplyRotationsState);
        const filteredPictures = getFilteredPictures(petChoice);
        const randomizedPics = randomizePictures(filteredPictures, picCount);
        let randomizedPieces = getRandomPieces(randomizedPics, cardCount);
        // last but not least, shuffle the cards and their rotations:
        if (shouldShuffleCards) {
          randomizedPieces = shuffle([...randomizedPieces]);
        }
        set(
          gamePiecesState,
          randomizedPieces.map((_, i) => i)
        );
        randomizedPieces.forEach((piece, i) => {
          set(pieceImagesState(i), piece);
        });
        if (shouldApplyRotations) {
          randomizedPieces.forEach((piece, i) => {
            const rotationOptions = [0, 90, 180, 270] as RotationOption[];
            const selectedRotation = getRandomPick(rotationOptions);
            set(pieceRotationState(i), selectedRotation);
            console.log({ selectedRotation, i });
          });
        }
      },
    []
  );
};
