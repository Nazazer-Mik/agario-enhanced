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
    this.sinCoef = 0.1 + Math.random() * 0.2;
    this.cosCoef = 0.1 + Math.random() * 0.2;
    this.sinDeg = Math.round(Math.random() * 360);
    this.cosDeg = Math.round(Math.random() * 360);
  }

  public getX = () => this.x;
  public getY = () => this.y;

  public floatAround(): void {
    this.x += this.sinCoef * Math.sin(this.sinDeg++ * (Math.PI / 180));
    this.y += this.cosCoef * Math.cos(this.cosDeg++ * (Math.PI / 180));

    this.sinDeg = this.sinDeg >= 360 ? 0 : this.sinDeg;
    this.cosDeg = this.cosDeg >= 360 ? 0 : this.cosDeg;
  }

  public getBlobParams(): [number, number, number, string, string] {
    return [this.x, this.y, this.r, this.color, this.outlineColor];
  }
}
