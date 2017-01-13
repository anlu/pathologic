const TILE_SIZE = 50;
const TILE_GAP = 2;
const TRANSLATE_SIZE = TILE_SIZE + TILE_GAP;

class Board {
  constructor(puzzleJson) {
    this.puzzleJson = puzzleJson;
  }

  draw(ctx) {
    for (let row_tiles of this.puzzleJson) {
      for (let tile of row_tiles) {
        if (tile === '0') {
          ctx.fillStyle = '#2a2a2a';
          ctx.fillRect(-TILE_GAP, -TILE_GAP, TILE_SIZE + (TILE_GAP * 2), TILE_SIZE + (TILE_GAP * 2));
        } else if (tile === ' ') {
          ctx.fillStyle = '#f1f1f1';
          ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        } else if (tile === 'S') {
          ctx.fillStyle = '#f1f1f1';
          ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

          ctx.fillStyle = '#b2f784';
          ctx.beginPath();
          ctx.moveTo(15, 11);
          ctx.lineTo(38, 25);
          ctx.lineTo(15, 39);
          ctx.fill();
        } else if (tile === 'E') {
          ctx.fillStyle = '#123456';
          ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        }
        ctx.translate(TRANSLATE_SIZE, 0);
      }
      ctx.translate(-(this.puzzleJson[0].length * TRANSLATE_SIZE), TRANSLATE_SIZE);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    let shortestPath = this.getShortestPath();
    for (let coord of shortestPath) {
      ctx.translate(coord['col'] * TRANSLATE_SIZE, coord['row'] * TRANSLATE_SIZE);
      ctx.fillStyle = '#dddddd';
      ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

      ctx.fillStyle = '#ebdf9c';
      ctx.beginPath();
      ctx.moveTo(15, 11);
      ctx.lineTo(38, 25);
      ctx.lineTo(15, 39);
      ctx.fill();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  getShortestPath() {
    let _getShortestPath = (start, end, visited) => {
      if (start['row'] === end['row'] && start['col'] === end['col']) {
        return [start];
      }

      let possibilities = [
        {'row': start['row'] + 1, 'col': start['col']},
        {'row': start['row'] - 1, 'col': start['col']},
        {'row': start['row'], 'col': start['col'] + 1},
        {'row': start['row'], 'col': start['col'] - 1}
      ].filter(coord => {
        return !visited[this._coordKey(coord)] && (
          this.puzzleJson[coord['row']][coord['col']] === ' ' ||
          this.puzzleJson[coord['row']][coord['col']] === 'E'
        );
      });

      var shortestPath = null;
      var shortestLength = Infinity;
      for (let coord of possibilities) {
        let newVisited = Object.assign({}, visited);
        newVisited[this._coordKey(coord)] = true;
        let path = _getShortestPath(coord, end, newVisited);
        if (path !== null && path.length < shortestLength) {
          shortestLength = path.length;
          shortestPath = path;
        }
      }

      // No valid paths found in each of the 4 directions
      if (shortestPath === null) {
        return null;
      }

      return [start].concat(shortestPath);
    };

    let starts = [];
    let ends = [];
    for (let row in this.puzzleJson) {
      for (let col in this.puzzleJson[row]) {
        row = parseInt(row);
        col = parseInt(col);
        if (this.puzzleJson[row][col] === 'S') {
          starts.push({'row': row, 'col': col});
        } else if (this.puzzleJson[row][col] === 'E') {
          ends.push({'row': row, 'col': col});
        }
      }
    }

    return _getShortestPath(starts[0], ends[0], [], {});
  }

  _coordKey(coord) {
    return coord['row'] + ',' + coord['col'];
  }
}

// '0' - not part of puzzle
// ' ' - valid route
let puzzleJson = [
  '-0000000000-',
  '00        00',
  '00 000000 00',
  'S          E',
  '00 000000 00',
  '00        00',
  '-0000000000-',
];
let board = new Board(puzzleJson);
let ctx = document.getElementById('pathologic').getContext('2d');

ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
board.draw(ctx);
