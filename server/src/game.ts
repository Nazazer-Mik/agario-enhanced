import Blob, { BLOB_SIZE } from "./blob";
import Player from "./player";

export const gameFieldWidth = 1920 * 3; // 5760
export const gameFieldHeight = 945 * 5; // 4725
const blobsAmount = Math.floor(
  (gameFieldHeight * gameFieldWidth * 0.0025) /
    (Math.PI * BLOB_SIZE * BLOB_SIZE)
); // 0.25% of map is covered in food (blob radius - 7px)

export interface UserData {
  userId: string;
  username: string;
  playerColor: string;
}

export default class Game {
  private blobs: Blob[] = [];
  private players: Player[] = [];

  // Keep set amount of blobs
  private maintainBlobsAmount(): void {
    while (this.blobs.length < blobsAmount) {
      const x = Math.floor(Math.random() * gameFieldWidth);
      const y = Math.floor(Math.random() * gameFieldHeight);
      const newBlob = new Blob(x, y);
      this.blobs.push(newBlob);
    }
  }

  public addPlayer(userData: UserData): void {
    const rand_x = 960 + Math.random() * (gameFieldWidth - 1920);
    const rand_y = 540 + Math.random() * (gameFieldHeight - 1080);

    const player = new Player(
      rand_x,
      rand_y,
      userData.playerColor,
      userData.userId,
      userData.username
    );
    this.players.push(player);
  }

  public findPlayerById(userId: string): Player | null {
    return this.players.find((player) => player.userId == userId) || null;
  }

  private checkEatable() {
    this.players.forEach((player: Player) => {
      let toBeDeleted = -1;

      for (let i = 0; i < this.blobs.length; i++) {
        if (player.eat(this.blobs[i])) {
          toBeDeleted = i;
          break;
        }
      }

      if (toBeDeleted !== -1) {
        this.blobs.splice(toBeDeleted, 1);
      }
    });
  }

  public update(): void {
    // BLOBS
    this.checkEatable();
    this.maintainBlobsAmount();
    this.blobs.forEach((blob: Blob) => blob.floatAround());
  }

  public getGeneralMPData() {
    let blobsParams: [number, number, number, string, string][] = [];
    let playersParams: [
      number,
      number,
      number,
      number,
      string,
      string,
      string
    ][] = [];

    this.blobs.forEach((blob: Blob) => blobsParams.push(blob.getBlobParams()));
    this.players.forEach((player: Player) =>
      playersParams.push(player.getPlayerParams())
    );

    return {
      players: playersParams,
      blobs: blobsParams,
    };
  }
}
