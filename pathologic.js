const TILE_SIZE = 50;
const TILE_GAP = 2;
const TRANSLATE_SIZE = TILE_SIZE + TILE_GAP;

class Board {
  constructor(puzzle_json) {
    this.puzzle_json = puzzle_json;
  }

  draw(ctx) {
    for (let row_tiles of this.puzzle_json) {
      for (let tile of row_tiles) {
        if (tile === '0') {
          ctx.fillStyle = '#2a2a2a';
          ctx.fillRect(-TILE_GAP, -TILE_GAP, TILE_SIZE + (TILE_GAP * 2), TILE_SIZE + (TILE_GAP * 2));
        } else if (tile === ' ') {
          ctx.fillStyle = '#f1f1f1';
          ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        }
        ctx.translate(TRANSLATE_SIZE, 0);
      }
      ctx.translate(-(this.puzzle_json[0].length * TRANSLATE_SIZE), TRANSLATE_SIZE);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

// '0' - not part of puzzle
// ' ' - valid route
let puzzle_json = [
  '-0000000000-',
  '00        00',
  '00 000000 00',
  '            ',
  '00 000000 00',
  '00        00',
  '-0000000000-',
];
let board = new Board(puzzle_json);
let ctx = document.getElementById('pathologic').getContext('2d');

ctx.globalCompositeOperation = 'destination-over';
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
window.requestAnimationFrame(() => {
  board.draw(ctx);
});
