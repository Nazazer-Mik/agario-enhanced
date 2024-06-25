import Blob from "./game_components/blob";
import LocalGame from "./game_components/localGame";
import Player from "./game_components/player";
import { socket } from "./socket";

let canvas: HTMLCanvasElement;
let massField: HTMLDivElement;
let ctx: CanvasRenderingContext2D;
let setLeadersCallback: (leaders: Player[]) => void;

let mouseX: number;
let mouseY: number;

const localGame = new LocalGame();

//----------------DETAILS----------------

const gameFieldWidth = 1920 * 3; // 5760
const gameFieldHeight = 945 * 5; // 4725

//---------------------------------------

export function setup(
  newCanvas: HTMLCanvasElement,
  newMassField: HTMLDivElement,
  newSetLeadersCallback: (leaders: Player[]) => void
): void {
  canvas = newCanvas;
  massField = newMassField;
  setLeadersCallback = newSetLeadersCallback;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Setting right size of the canvas
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  // Adding mouse position tracking
  canvas.addEventListener("mousemove", function (event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  });

  // ------------ NETWORK STUFF ------------

  const getUserData = () => {
    return {
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
      playerColor: localStorage.getItem("playerColor"),
    };
  };

  socket.connect();

  socket.on("connect", () => {
    socket.emit("join", JSON.stringify(getUserData()));
  });

  socket.on("disconnect", () => {
    socket.emit("leave", JSON.stringify(getUserData()));
  });

  socket.on("generalData", (msg) => localGame.updateData(msg));
}

// Limiting to 60fps
let lastFrameTime = performance.now();
const targetFrameTime = 1000 / 60;

export function render(): void {
  const now = performance.now();
  const delta = now - lastFrameTime;
  let gameOver = false;

  if (delta >= targetFrameTime && localGame.gameLoaded()) {
    lastFrameTime = now - (delta % targetFrameTime);

    draw();
    update();
  }

  if (!gameOver) {
    window.requestAnimationFrame(render);
  }
}

export function update() {
  // PLAYER
  const halfWidth = canvas.width / 2;
  const halfHeight = canvas.height / 2;

  const clampedX =
    (((mouseX - halfWidth) / halfWidth) * 10) / (halfHeight / halfWidth) || 0; // Adding proportion of screen to make correct speed
  const clampedY = ((mouseY - halfHeight) / halfHeight) * 10 || 0; // [-10; 10]

  const speedX = Math.abs(clampedX) > 3 ? 3 * Math.sign(clampedX) : clampedX;
  const speedY = Math.abs(clampedY) > 3 ? 3 * Math.sign(clampedY) : clampedY;

  const userId = localStorage.getItem("userId");
  const dataToSend = { userId: userId, speedX: speedX, speedY: speedY };
  socket.emit("playerMove", JSON.stringify(dataToSend));
}

export function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const player: Player = localGame.draw(ctx, canvas);

  massField.innerHTML = "Current mass: " + player.mass;
  setLeadersCallback(localGame.getLeaders());
}
