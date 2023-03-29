import * as readline from "node:readline/promises";
import chalk from "chalk";
import { stdin as input, stdout as output } from "node:process";

import { Board, BoardField, BoardFieldNumber, BoardRow, Player } from "./types";

let board: Board = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

const tripleX = "XXX";
const tripleO = "OOO";
const fieldNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

let turnCounter = 1;
let activePlayer: BoardField | null = null;

const readlineInterface = readline.createInterface({
  input,
  output,
  terminal: false,
});

const colorizeBoardField = (input: BoardField): string => {
  if (input === "X") {
    return chalk.red(input);
  } else if (input === "O") {
    return chalk.blue(input);
  } else {
    return input;
  }
};

const prettifyBoardPrint = (): void => {
  console.log(
    board
      .map((row) => row.map(colorizeBoardField).join(" | "))
      .join("\n---------\n")
  );
};

const insertFieldIntoBoard = async (
  boardFieldNumber: BoardFieldNumber
): Promise<void> => {
  if (!fieldNumbers.includes(boardFieldNumber)) {
    console.log("Wrong Input, try again!");

    await playATurn();
  }

  const flatBoard = board.flatMap((boardRow) => boardRow);

  if (["X", "O"].includes(flatBoard[Number(boardFieldNumber) - 1])) {
    console.log("Position is already taken!");

    await playATurn();
  } else {
    flatBoard[Number(boardFieldNumber) - 1] = activePlayer as Player;

    board = [
      flatBoard.slice(0, 3) as BoardRow,
      flatBoard.slice(3, 6) as BoardRow,
      flatBoard.slice(6, 9) as BoardRow,
    ];
  }
};

const checkGameStatus = (): void => {
  const firstRow = board[0].join("");
  const secondRow = board[1].join("");
  const thirdRow = board[2].join("");
  const firstColumn = `${board[0][0]}${board[1][0]}${board[2][0]}`;
  const secondColumn = `${board[0][1]}${board[1][1]}${board[2][1]}`;
  const thirdColumn = `${board[0][2]}${board[1][2]}${board[2][2]}`;
  const leftCross = `${board[0][0]}${board[1][1]}${board[2][2]}`;
  const rightCross = `${board[0][2]}${board[1][1]}${board[2][0]}`;

  if (
    firstRow === tripleO ||
    firstRow === tripleX ||
    secondRow === tripleO ||
    secondRow === tripleX ||
    thirdRow === tripleO ||
    thirdRow === tripleX ||
    firstColumn === tripleO ||
    firstColumn === tripleX ||
    secondColumn === tripleO ||
    secondColumn === tripleX ||
    thirdColumn === tripleO ||
    thirdColumn === tripleX ||
    leftCross === tripleO ||
    leftCross === tripleX ||
    rightCross === tripleO ||
    rightCross === tripleX
  ) {
    console.log("\n");

    prettifyBoardPrint();

    console.log(
      `Game finished, Congratulations ${colorizeBoardField(
        activePlayer as Player
      )} you are the winner!`
    );

    readlineInterface.close();
    process.exit(0);
  } else if (turnCounter === 9) {
    console.log("\n");

    prettifyBoardPrint();

    console.log("Game finished, it is a draw!");

    readlineInterface.close();
    process.exit(0);
  }
};

const startGame = async () => {
  let answer = (await readlineInterface.question(
    `Who will start first, player ${colorizeBoardField(
      "X"
    )} or ${colorizeBoardField("O")}?\n`
  )) as Player;

  answer = answer.toUpperCase().trim() as Player;

  if (answer === "X" || answer === "O") {
    activePlayer = answer;

    await playATurn();
  } else {
    console.log("Invalid Input, try again!");

    await startGame();
  }
};

const playATurn = async () => {
  console.log("\n");

  prettifyBoardPrint();

  let boardFieldNumber = (await readlineInterface.question(
    `Player ${colorizeBoardField(
      activePlayer as BoardField
    )}, enter the number where you want to insert your ${colorizeBoardField(
      activePlayer as BoardField
    )}:\n`
  )) as BoardFieldNumber;

  boardFieldNumber = boardFieldNumber.trim() as BoardFieldNumber;

  await insertFieldIntoBoard(boardFieldNumber);

  checkGameStatus();

  turnCounter++;

  activePlayer = activePlayer === "X" ? "O" : "X";

  await playATurn();
};

startGame();
