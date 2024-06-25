import { drawCircle } from "./draw_utils";

export default class Player {
  public readonly userId: string;
  public readonly userName: string;

  public readonly x: number;
  public readonly y: number;
  public readonly r: number;
  public readonly color: string;
  public readonly mass: number;

  public constructor(
    x: number,
    y: number,
    r: number,
    mass: number,
    userId: string,
    username: string,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.userId = userId;
    this.userName = username;
    this.mass = mass;
  }

  public getX = () => this.x;
  public getY = () => this.y;

  public draw(relX: number, relY: number, ctx: CanvasRenderingContext2D) {
    const newX = this.x - relX;
    const newY = this.y - relY;

    drawCircle(newX, newY, this.r, this.color, "brown", 3, ctx);

    ctx.font = "25px Courier lighter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ECA72C";
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = "#2F2723";
    ctx.fillText(this.userName, newX, newY);
    ctx.strokeText(this.userName, newX, newY);
  }
}
