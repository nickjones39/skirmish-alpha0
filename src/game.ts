import { GameLoop, AsciiRenderer } from "migalib";
import { GameMap } from "./gamemap";

export class Game {
  asciiRenderer: AsciiRenderer;

  currentMap?: GameMap;

  width = 25;
  height = 14;

  playerX = 0;
  playerY = 0;

  constructor() {
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.asciiRenderer = new AsciiRenderer({
      displayColumns: this.width,
      displayRows: this.height,
      glyphs: [
        AsciiRenderer.createFromDefaultGlyph("@", "@", "#66D9EF"),
        AsciiRenderer.createFromDefaultGlyph("Z", "Z", "#F92672"),
        AsciiRenderer.createFromDefaultGlyph(
          "Z",
          "Z-selected",
          "#000",
          "#ae81ff"
        ),
        AsciiRenderer.createFromDefaultGlyph("*", "*", "#A6E22E"),
        AsciiRenderer.createFromDefaultGlyph(".", ".", "#090909"),
        AsciiRenderer.createFromDefaultGlyph("#", "#", "#272822")
      ],
      displayCssStyle: {
        width: "90vw"
      }
    });
    console.log("^");
  }

  async run() {
    console.log("run");
    await this.asciiRenderer.init();
    this.currentMap = new GameMap(40, 40);
    GameLoop.init({
      render: this.render,
      update: this.update
    });
    window.addEventListener("keydown", event => event.preventDefault());

    GameLoop.start();
  }

  update(delta) {
    if (this.currentMap) {
      this.currentMap.update();
    }
  }

  render() {
    if (this.currentMap) {
      this.currentMap.render(this.asciiRenderer);
    }
  }
}
