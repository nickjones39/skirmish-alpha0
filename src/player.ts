import { Entity } from "./entity";
import { GameMap } from "./gamemap";
import { Keyboard } from "migalib";

export class Player extends Entity {
  selectedEntity: Entity | null = null;

  constructor(x: number, y: number, gameMap: GameMap) {
    super("@", x, y, gameMap);
  }

  update() {
    if (Keyboard.pressed("ArrowRight") || Keyboard.pressed("d")) {
      this.act(() => this.move("RIGHT"));
    } else if (Keyboard.pressed("ArrowLeft") || Keyboard.pressed("a")) {
      this.act(() => this.move("LEFT"));
    } else if (Keyboard.pressed("ArrowDown") || Keyboard.pressed("s")) {
      this.act(() => this.move("DOWN"));
    } else if (Keyboard.pressed("ArrowUp") || Keyboard.pressed("w")) {
      this.act(() => this.move("UP"));
    } else if (Keyboard.pressed("Tab")) {
      console.log("tab");
      Keyboard.keys["Tab"] = false;
      const selectedEntity = this.selectNextEntity();
      if (selectedEntity) {
        this.selectedEntity = selectedEntity;
        this.gameMap.entities.forEach(
          entity =>
            (entity.glyphChar = entity.glyphChar.replace("-selected", ""))
        );
        this.selectedEntity.glyphChar = `${
          this.selectedEntity.glyphChar
        }-selected`;
      }
      console.log(this.selectedEntity);
    } else if (Keyboard.pressed("1")) {
      if (this.selectedEntity) {
        if (this.checkIfEntityIsInAttackRange(this.selectedEntity)) {
          this.act(() => console.log("attack"));
        } else {
          console.log("attack: out of range");
        }
      }
      Keyboard.keys["1"] = false;
    } else if (Keyboard.pressed("Escape")) {
      Keyboard.keys["Escape"] = false;
      this.gameMap.entities.forEach(
        entity => (entity.glyphChar = entity.glyphChar.replace("-selected", ""))
      );
      this.selectedEntity = null;
    } else if (Keyboard.pressed(" ")) {
      Keyboard.keys[" "] = false;
      this.act(() => console.log("skip turn"));
    }
  }

  checkIfEntityIsInAttackRange(entity) {
    const xDistance = Math.abs(this.x - entity.x);
    const yDistance = Math.abs(this.y - entity.y);
    return xDistance <= 1 && yDistance <= 1;
  }

  getEntitiesInRange() {
    const entitiesInRange = [];
    this.gameMap.fov.compute(this.x, this.y, 10, (x, y) => {
      const entity = this.gameMap.entities.find(
        entity =>
          entity.x === x &&
          entity.y === y &&
          !(entity instanceof Player) &&
          entity !== this.selectedEntity
      );
      if (entity) {
        entitiesInRange.push(entity);
      }
    });
    return entitiesInRange;
  }

  selectNextEntity() {
    let selectedEntity = null;
    for (const entity of this.getEntitiesInRange()) {
      selectedEntity = entity;
      break;
    }
    return selectedEntity;
  }
}
