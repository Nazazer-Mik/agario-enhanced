import Blob from "./blob";

export default class Player {
  private x: number;
  private y: number;
  private r = 25;
  private color: string;
  private mass: number;

  public constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.mass = 50;
  }

  public getX = () => this.x;
  public getY = () => this.y;
  public getR = () => this.r;

  public getMass = () => this.mass;

  public translate(
    offsetX: number,
    offsetY: number,
    gameFieldWidth: number,
    gameFieldHeight: number
  ) {
    this.x += offsetX;
    this.y += offsetY;

    if (this.x < 0) this.x = 0;
    if (this.x > gameFieldWidth) this.x = gameFieldWidth;
    if (this.y < 0) this.y = 0;
    if (this.y > gameFieldHeight) this.y = gameFieldHeight;
  }

  public eat(blob: Blob): boolean {
    const distance = Math.sqrt(
      Math.pow(this.x - blob.getX(), 2) + Math.pow(this.y - blob.getY(), 2)
    );

    if (distance < this.r) {
      this.mass += 2;
      this.r = 25 + this.calculateGrow();

      return true;
    }

    return false;
  }

  private calculateGrow(): number {
    return Math.sqrt(20 * this.mass) - 31;
  }
}
