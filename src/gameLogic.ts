let canvas: HTMLCanvasElement;
let massField: HTMLDivElement;
let ctx: CanvasRenderingContext2D;

let mouseX: number;
let mouseY: number;

//----------------DETAILS----------------

const gameFieldWidth = 1920 * 3; // 5760
const gameFieldHeight = 945 * 5; // 4725

let blobs: Blob[] = [];
let blobsNearby: Blob[] = [];
const BLOB_SIZE = 7;
const blobsAmount = Math.floor(
  (gameFieldHeight * gameFieldWidth * 0.0025) /
    (Math.PI * BLOB_SIZE * BLOB_SIZE)
); // 0.25% of map is covered in food (blob radius - 7px)
const DEFAULT_BLOB_COLOR = "#31AFD4";
const DEFAULT_BLOB_OUTLINE_COLOR = "#EE5622";

class Blob {
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

  public draw(relX: number, relY: number): void {
    const newX = this.x - relX;
    const newY = this.y - relY;

    drawCircle(newX, newY, this.r, this.color, this.outlineColor, 2);
  }

  public floatAround(): void {
    this.x += this.sinCoef * Math.sin(this.sinDeg++ * (Math.PI / 180));
    this.y += this.cosCoef * Math.cos(this.cosDeg++ * (Math.PI / 180));

    this.sinDeg = this.sinDeg >= 360 ? 0 : this.sinDeg;
    this.cosDeg = this.cosDeg >= 360 ? 0 : this.cosDeg;
  }
}

function drawCircle(
  centerX: number,
  centerY: number,
  radius: number,
  color: string,
  outlineColor: string,
  outlineWidth: number
) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = outlineWidth;
  ctx.strokeStyle = outlineColor;
  ctx.stroke();
  ctx.closePath();
}

function maintainBlobsAmount() {
  while (blobs.length < blobsAmount) {
    const x = Math.floor(Math.random() * gameFieldWidth);
    const y = Math.floor(Math.random() * gameFieldHeight);
    const newBlob = new Blob(x, y);
    blobs.push(newBlob);
  }
}
//---------------------------------------

//----------------PLAYER-----------------

class Player {
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

  public translate(offsetX: number, offsetY: number) {
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

let player: Player;

//---------------------------------------

export function setup(
  newCanvas: HTMLCanvasElement,
  newMassField: HTMLDivElement
): void {
  canvas = newCanvas;
  massField = newMassField;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Setting right size of the canvas
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  // Adding mouse position tracking
  canvas.addEventListener("mousemove", function (event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  });

  // Game field works
  maintainBlobsAmount();

  const rand_x =
    canvas.width / 2 + Math.random() * (gameFieldWidth - canvas.width);
  const rand_y =
    canvas.height / 2 + Math.random() * (gameFieldHeight - canvas.height);

  player = new Player(rand_x, rand_y, "#ECA72C");
}

export function update(): boolean {
  // PLAYER
  const halfWidth = canvas.width / 2;
  const halfHeight = canvas.height / 2;

  const clampedX =
    (((mouseX - halfWidth) / halfWidth) * 10) / (halfHeight / halfWidth) || 0; // Adding proportion of screen to make correct speed
  const clampedY = ((mouseY - halfHeight) / halfHeight) * 10 || 0; // [-10; 10]

  const speedX = Math.abs(clampedX) > 3 ? 3 * Math.sign(clampedX) : clampedX;
  const speedY = Math.abs(clampedY) > 3 ? 3 * Math.sign(clampedY) : clampedY;

  player.translate(speedX, speedY);

  // BLOBS
  // Adding after eated
  maintainBlobsAmount();
  // Movement
  blobs.forEach((blob: Blob) => blob.floatAround());

  // Filtering nearest to render
  blobsNearby.length = 0;
  const bufferZone = 50; // 50px behind screen
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const x = blob.getX();
    const y = blob.getY();
    const playerX = player.getX();
    const playerY = player.getY();

    if (
      x > playerX - canvas.width / 2 - bufferZone &&
      x < playerX + canvas.width / 2 + bufferZone &&
      y > playerY - canvas.height / 2 - bufferZone &&
      y < playerY + canvas.height / 2 + bufferZone
    ) {
      const result: boolean = player.eat(blob);
      if (result) {
        blobs.splice(i, 1);
      } else {
        blobsNearby.push(blob);
      }
    }
  }

  return false;
}

export function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // BLOBS
  blobsNearby.forEach((blob) => {
    blob.draw(
      player.getX() - canvas.width / 2,
      player.getY() - canvas.height / 2
    );
  });

  // PLAYER
  drawCircle(
    canvas.width / 2,
    canvas.height / 2,
    player.getR(),
    "green",
    "brown",
    3
  );

  massField.innerHTML = "Current mass: " + player.getMass();
}
