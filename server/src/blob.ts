export const BLOB_SIZE = 7;
const DEFAULT_BLOB_COLOR = "#31AFD4";
const DEFAULT_BLOB_OUTLINE_COLOR = "#EE5622";

export default class Blob {
  private x: number;
  private y: number;
  private r: number;
  private color: string;
  private outlineColor: string;
  private sinDeg: number = 0;
  private sinCoef: number;
  private cosDeg: number = 0;
  private cosCoef: number;

  public constructor(
    x: number,
    y: number,
    r = BLOB_SIZE,
    color = DEFAULT_BLOB_COLOR,
    outlineColor = DEFAULT_BLOB_OUTLINE_COLOR
  ) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.outlineColor = outlineColor;
    this.sinCoef = Math.random() * 0.3;
    this.cosCoef = Math.random() * 0.3;
  }

  public getX = () => this.x;
  public getY = () => this.y;

  public floatAround(): void {
    this.x += this.sinCoef * Math.sin(this.sinDeg++ * (Math.PI / 180));
    this.y += this.cosCoef * Math.cos(this.cosDeg++ * (Math.PI / 180));

    this.sinDeg = this.sinDeg >= 360 ? 0 : this.sinDeg;
    this.cosDeg = this.cosDeg >= 360 ? 0 : this.cosDeg;
  }
}
