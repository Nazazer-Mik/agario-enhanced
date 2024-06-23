let canvas: HTMLCanvasElement;
let massField: HTMLDivElement;
let ctx: CanvasRenderingContext2D;

let mouseX: number;
let mouseY: number;

//----------------DETAILS----------------

const gameFieldWidth = 1920 * 3; // 5760
const gameFieldHeight = 945 * 5; // 4725

let blobs: Blob[] = [];
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
  }

  public getX = () => this.x;
  public getY = () => this.y;

  public draw(relX: number, relY: number): void {
    const newX = this.x - relX;
    const newY = this.y - relY;

    drawCircle(newX, newY, this.r, this.color, this.outlineColor, 2);
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

  public getMass = () => this.mass;

  public translate(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.y += offsetY;

    if (this.x < 0) this.x = 0;
    if (this.x > gameFieldWidth) this.x = gameFieldWidth;
    if (this.y < 0) this.y = 0;
    if (this.y > gameFieldHeight) this.y = gameFieldHeight;
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

  const clampedX = (mouseX - halfWidth) / halfWidth; // [-1; 1]
  const clampedY = (mouseY - halfHeight) / halfHeight;

  player.translate(clampedX * 3, clampedY * 3);

  // BLOBS
  maintainBlobsAmount();
  return false;
}

export function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // BLOBS
  blobs.forEach((blob) => {
    const x = blob.getX();
    const y = blob.getY();
    const playerX = player.getX();
    const playerY = player.getY();

    if (
      x > playerX - canvas.width / 2 &&
      x < playerX + canvas.width / 2 &&
      y > playerY - canvas.height / 2 &&
      y < playerY + canvas.height / 2
    ) {
      blob.draw(playerX - canvas.width / 2, playerY - canvas.height / 2);
    }
  });

  // PLAYER
  drawCircle(canvas.width / 2, canvas.height / 2, 50, "green", "brown", 3);

  massField.innerHTML = "Current mass: " + player.getMass();
}
