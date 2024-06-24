import Blob, { BLOB_SIZE } from "./blob";

const gameFieldWidth = 1920 * 3; // 5760
const gameFieldHeight = 945 * 5; // 4725
const blobsAmount = Math.floor(
  (gameFieldHeight * gameFieldWidth * 0.0025) /
    (Math.PI * BLOB_SIZE * BLOB_SIZE)
); // 0.25% of map is covered in food (blob radius - 7px)

export default class Game {
  private blobs: Blob[] = [];

  // Keep set amount of blobs
  private maintainBlobsAmount(): void {
    while (this.blobs.length < blobsAmount) {
      const x = Math.floor(Math.random() * gameFieldWidth);
      const y = Math.floor(Math.random() * gameFieldHeight);
      const newBlob = new Blob(x, y);
      this.blobs.push(newBlob);
    }
  }

  public update(): void {
    // BLOBS
    this.maintainBlobsAmount();
    this.blobs.forEach((blob: Blob) => blob.floatAround());
  }

  public getGeneralMPData() {
    return this.blobs;
  }
}
