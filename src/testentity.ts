import { Entity } from "./entity";
import { GameMap } from "./gamemap";

export class TestEntity extends Entity {
  constructor(x: number, y: number, gameMap: GameMap) {
    super("Z", x, y, gameMap);
  }

  update() {
    const directions = ["RIGHT", "LEFT", "UP", "DOWN"];
    const nextDirection =
      directions[parseInt(`${Math.random() * directions.length}`, 10)];
    this.act(() => this.move(nextDirection as any));
  }
}
