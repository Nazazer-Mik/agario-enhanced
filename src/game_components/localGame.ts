import Blob from "./blob";
import { drawCircle } from "./draw_utils";
import Player from "./player";

type blobParams = [number, number, number, string, string];
type playersParams = [number, number, number, number, string, string, string];

export default class LocalGame {
  private blobs: Blob[] = [];
  private players: Player[] = [];

  public updateData(fieldDataJSON: string): void {
    this.blobs.length = 0;
    this.players.length = 0;

    const fieldData = JSON.parse(fieldDataJSON);
    fieldData.blobs.forEach((blob: blobParams) =>
      this.blobs.push(new Blob(...blob))
    );
    fieldData.players.forEach((player: playersParams) =>
      this.players.push(new Player(...player))
    );
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): Player {
    const currentUserId = localStorage.getItem("userId");
    const currentPlayer = this.players.filter(
      (player) => player.userId === currentUserId
    )[0];

    // const blobsNearby = this.blobs.filter((blob) =>
    //   this.proximityPredicate(blob, currentPlayer, canvas)
    // );

    this.blobs.forEach((blob) =>
      blob.draw(
        currentPlayer.x - canvas.width / 2,
        currentPlayer.y - canvas.height / 2,
        ctx
      )
    );
    this.players.forEach((player) => {
      if (player.userId === currentUserId) {
        drawCircle(
          canvas.width / 2,
          canvas.height / 2,
          player.r,
          player.color,
          "brown",
          3,
          ctx
        );
      } else {
        player.draw(currentPlayer.x, currentPlayer.y, ctx);
      }
    });

    return currentPlayer;
  }

  private proximityPredicate(
    elem: Blob | Player,
    player: Player,
    canvas: HTMLCanvasElement
  ) {
    const bufferZone = 100; // 100px behind screen

    const x = elem.getX();
    const y = elem.getY();
    const playerX = player.getX();
    const playerY = player.getY();

    if (
      x > playerX - canvas.width / 2 - bufferZone &&
      x < playerX + canvas.width / 2 + bufferZone &&
      y > playerY - canvas.height / 2 - bufferZone &&
      y < playerY + canvas.height / 2 + bufferZone
    ) {
      return true;
    } else {
      return false;
    }
  }
}
