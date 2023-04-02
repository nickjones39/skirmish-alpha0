import { GameMap } from "./gamemap";
import { AsciiRenderer } from "migalib";

export class Entity {
  glyphChar: string;
  x: number;
  y: number;
  gameMap: GameMap;

  constructor(glyphChar: string, x: number, y: number, gameMap: GameMap) {
    this.glyphChar = glyphChar;
    this.x = x;
    this.y = y;
    this.gameMap = gameMap;
  }

  act(actFunction: Function) {
    actFunction();
    this.gameMap.turnEngine.nextEntity();
  }

  update() {
    // noop overwrite this
  }

  move(direction: "UP" | "DOWN" | "LEFT" | "RIGHT") {
    let newX = this.x;
    let newY = this.y;
    if (direction === "RIGHT") {
      newX++;
    } else if (direction === "LEFT") {
      newX--;
    } else if (direction === "DOWN") {
      newY++;
    } else if (direction === "UP") {
      newY--;
    }

    if (
      this.gameMap.tiles.get(`${newX},${newY}`) &&
      this.gameMap.tiles.get(`${newX},${newY}`) !== "#"
    ) {
      this.x = newX;
      this.y = newY;
    }
  }

  render(asciiRenderer: AsciiRenderer) {
    asciiRenderer.render(this.glyphChar, this.x, this.y);
  }
}
