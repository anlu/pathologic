const TILE_SIZE = 50;
const TRANSLATE_SIZE = TILE_SIZE;

class Board {
  constructor(puzzleJson) {
    this.puzzleJson = puzzleJson;
    this.drawRoute = false;
  }

  draw(ctx) {
    for (let row_tiles of this.puzzleJson) {
      for (let tile of row_tiles) {
        if (tile === 'X') {
          ctx.fillStyle = '#2a2a2a';
          ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        } else if (tile === ' ') {
          ctx.fillStyle = '#e1e1e1';
          ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
        } else if (tile === 'S') {
          ctx.fillStyle = '#e1e1e1';
          ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

          ctx.fillStyle = '#53c309';
          ctx.beginPath();
          ctx.moveTo(15, 11);
          ctx.lineTo(38, 25);
          ctx.lineTo(15, 39);
          ctx.fill();
        } else if (tile === 'E') {
          ctx.fillStyle = '#123456';
          ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
        }
        ctx.translate(TILE_SIZE, 0);
      }
      ctx.translate(-(this.puzzleJson[0].length * TILE_SIZE), TILE_SIZE);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.drawRoute) {
      let shortestPath = this.getShortestPath();

      for (let coord of shortestPath) {
        ctx.translate(coord['col'] * TILE_SIZE, coord['row'] * TILE_SIZE);
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

        ctx.fillStyle = '#ebdf9c';
        ctx.beginPath();
        ctx.moveTo(15, 11);
        ctx.lineTo(38, 25);
        ctx.lineTo(15, 39);
        ctx.fill();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
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
