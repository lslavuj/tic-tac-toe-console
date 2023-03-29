export type Player = "X" | "O";
export type BoardFieldNumber =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
export type BoardField = Player | BoardFieldNumber;
export type BoardRow = [BoardField, BoardField, BoardField];
export type Board = [BoardRow, BoardRow, BoardRow];
