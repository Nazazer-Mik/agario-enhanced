import { drawCircle } from "./draw_utils";

export default class Blob {
  private x: number;
  private y: number;
  private r: number;
  private color: string;
  private outlineColor: string;

  public constructor(
    x: number,
    y: number,
    r: number,
    color: string,
    outlineColor: string
  ) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.outlineColor = outlineColor;
  }

  public getX = () => this.x;
  public getY = () => this.y;

  public draw(relX: number, relY: number, ctx: CanvasRenderingContext2D): void {
    const newX = this.x - relX;
    const newY = this.y - relY;

    drawCircle(newX, newY, this.r, this.color, this.outlineColor, 2, ctx);
  }
}
