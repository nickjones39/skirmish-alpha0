import { Entity } from "./entity";

export class TurnEngine {
  entities: Entity[];
  currentIndex: number = 0;
  timeBetweenTurns = 85;

  constructor(entities: Entity[]) {
    this.entities = entities;
  }

  getCurrentEntity(): Entity {
    return this.entities[this.currentIndex];
  }

  nextEntity() {
    if (this.currentIndex + 1 > this.entities.length - 1) {
      // turn end
      this.currentIndex = -1;
      setTimeout(() => (this.currentIndex = 0), this.timeBetweenTurns);
    } else {
      this.currentIndex++;
    }
  }
}
