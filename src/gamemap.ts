import * as ROT from "rot-js";
import { convertPositionStringToCoords } from "./utils";
import { AsciiRenderer } from "migalib";
import { Entity } from "./entity";
import { Player } from "./player";
import { TurnEngine } from "./turnengine";
import { TestEntity } from "./testentity";

export class GameMap {
  tiles: Map<string, string>;
  entities: Entity[] = [];
  turnEngine: TurnEngine;

  fov: any;

  player: Player;

  constructor(width: number, height: number) {
    this.tiles = this.createMap(width, height);
  }

  createMap(width: number, height: number): Map<string, string> {
    const map: Map<string, string> = new Map();
    let digger = null;

    const mapTypes = ["DUNGEON", "CAVE", "MAZE"];
    const mapType =
      mapTypes[parseInt(`${Math.random() * mapTypes.length}`, 10)];

    if (mapType === "DUNGEON") {
      digger = new ROT.Map.Digger(width, height, {
        corridorLength: [0, 1],
        roomWidth: [2, 12],
        roomHeight: [2, 12]
      });
      digger.create((x, y, contents) => {
        if (!contents) {
          map.set(`${x},${y}`, ".");
        } else {
          map.set(`${x},${y}`, "#");
        }
      });
    } else if (mapType === "CAVE") {
      digger = new (ROT.Map.Cellular as any)(width, height, {
        born: [4, 5, 6, 7, 8],
        survive: [2, 3, 4, 5]
      });
      digger.randomize(0.9);
      for (let i = 0; i < 50; i++) {
        digger.create();
      }
      digger.create((x, y, contents) => {
        if (!contents) {
          map.set(`${x},${y}`, ".");
        } else {
          map.set(`${x},${y}`, "#");
        }
      });
    } else if (mapType === "MAZE") {
      digger = new ROT.Map.DividedMaze(width, height);
      digger.create((x, y, contents) => {
        if (!contents) {
          map.set(`${x},${y}`, ".");
        } else {
          map.set(`${x},${y}`, "#");
        }
      });
    }
    console.log(mapType);

    /// cleanup map
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (
          map.get(`${x},${y}`) === "#" &&
          (map.get(`${x + 1},${y}`) === "#" ||
            map.get(`${x + 1},${y}`) === undefined) &&
          (map.get(`${x - 1},${y}`) === "#" ||
            map.get(`${x - 1},${y}`) === undefined) &&
          (map.get(`${x},${y + 1}`) === "#" ||
            map.get(`${x},${y + 1}`) === undefined) &&
          (map.get(`${x},${y - 1}`) === "#" ||
            map.get(`${x},${y - 1}`) === undefined) &&
          (map.get(`${x + 1},${y + 1}`) === "#" ||
            map.get(`${x + 1},${y + 1}`) === undefined) &&
          (map.get(`${x - 1},${y + 1}`) === "#" ||
            map.get(`${x - 1},${y + 1}`) === undefined) &&
          (map.get(`${x + 1},${y - 1}`) === "#" ||
            map.get(`${x + 1},${y - 1}`) === undefined) &&
          (map.get(`${x - 1},${y - 1}`) === "#" ||
            map.get(`${x - 1},${y - 1}`) === undefined)
        ) {
          map.delete(`${x},${y}`);
        }
      }
    }

    for (let i = 0; i < 31; i++) {
      let index = 0;
      let key = "";
      while (index === 0 || !key || map.get(key) !== ".") {
        index = Math.floor(ROT.RNG.getUniform() * map.size);
        key = Array.from(map.keys())[index];
      }
      if (i === 0) {
        const coords = convertPositionStringToCoords(key);
        const player = new Player(coords.x, coords.y, this);
        this.player = player;
        this.entities.push(player);
      } else if (i >= 1 && i <= 25) {
        const coords = convertPositionStringToCoords(key);
        this.entities.push(new TestEntity(coords.x, coords.y, this));
      } else {
        map.set(key, "*");
      }
    }
    this.turnEngine = new TurnEngine(this.entities);

    this.fov = new ROT.FOV.PreciseShadowcasting(
      (x, y) => map.get(`${x},${y}`) !== undefined
    );

    return map;
  }

  update() {
    if (this.turnEngine.currentIndex >= 0) {
      if (this.turnEngine.getCurrentEntity() instanceof Player) {
        this.turnEngine.getCurrentEntity().update();
      } else {
        while (
          !(this.turnEngine.getCurrentEntity() instanceof Player) &&
          this.turnEngine.getCurrentEntity()
        ) {
          this.turnEngine.getCurrentEntity().update();
        }
      }
    }
  }

  render(asciiRenderer: AsciiRenderer) {
    asciiRenderer.updateCamera(this.player.x, this.player.y);
    /*for (const [position, glyphChar] of Array.from(this.tiles.entries())) {
      const coords = convertPositionStringToCoords(position);
      asciiRenderer.render(glyphChar, coords.x, coords.y);
    }
    this.entities.forEach(entity => entity.render(asciiRenderer));*/
    this.fov.compute(
      this.player.x,
      this.player.y,
      20,
      (x: number, y: number) => {
        const tile = this.tiles.get(`${x},${y}`);
        if (tile) {
          asciiRenderer.render(this.tiles.get(`${x},${y}`), x, y);
          this.entities
            .filter(entity => entity.x === x && entity.y === y)
            .forEach(entity => entity.render(asciiRenderer));
        }
      }
    );

    asciiRenderer.flush();
  }
}
