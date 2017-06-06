const TILE_SIZE = 50;
const TRANSLATE_SIZE = TILE_SIZE;

class Board {
  constructor(puzzleJson, elem) {
    this.puzzleJson = puzzleJson;
    this.board = puzzleJson['board'];
    this.elem = elem;
    this.ctx = elem.getContext('2d');
    this.drawRoute = false;

    for (let i in this.board) {
      if (typeof this.board[i] === 'string') {
        this.board[i] = this.board[i].split('');
      }
    }

    elem.addEventListener('click', this._handleClick.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (let rowTiles of this.board) {
      for (let tile of rowTiles) {
        if (tile === 'X') {
          this.ctx.fillStyle = '#2a2a2a';
          this.ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        } else if (tile === ' ') {
          this.ctx.fillStyle = '#e1e1e1';
          this.ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
        } else if (tile === 'B') {
          this.ctx.fillStyle = '#444';
          this.ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
        } else if (tile === 'S') {
          this.ctx.fillStyle = '#e1e1e1';
          this.ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

          this.ctx.fillStyle = '#53c309';
          this.ctx.beginPath();
          this.ctx.moveTo(15, 11);
          this.ctx.lineTo(38, 25);
          this.ctx.lineTo(15, 39);
          this.ctx.fill();
        } else if (tile === 'E') {
          this.ctx.fillStyle = '#123456';
          this.ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
        }
        this.ctx.translate(TILE_SIZE, 0);
      }
      this.ctx.translate(-(this.board[0].length * TILE_SIZE), TILE_SIZE);
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.drawRoute) {
      let shortestPath = this.getShortestPath();
      if (shortestPath === null) {
        return;
      }

      for (let coord of shortestPath) {
        this.ctx.translate(coord['col'] * TILE_SIZE, coord['row'] * TILE_SIZE);
        this.ctx.fillStyle = '#dddddd';
        this.ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

        this.ctx.fillStyle = '#e1cf6b';
        this.ctx.beginPath();
        this.ctx.moveTo(15, 11);
        this.ctx.lineTo(38, 25);
        this.ctx.lineTo(15, 39);
        this.ctx.fill();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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
          this.board[coord['row']][coord['col']] === ' ' ||
          this.board[coord['row']][coord['col']] === 'E'
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
    for (let row in this.board) {
      for (let col in this.board[row]) {
        row = parseInt(row);
        col = parseInt(col);
        if (this.board[row][col] === 'S') {
          starts.push({'row': row, 'col': col});
        } else if (this.board[row][col] === 'E') {
          ends.push({'row': row, 'col': col});
        }
      }
    }

    return _getShortestPath(starts[0], ends[0], [], {});
  }

  _coordKey(coord) {
    return coord['row'] + ',' + coord['col'];
  }

  _handleClick(e) {
    let x = Math.floor(e.offsetX / TILE_SIZE);
    let y = Math.floor(e.offsetY / TILE_SIZE);

    if (y < this.board.length && x < this.board[0].length) {
      if (this.board[y][x] === ' ') {
        this.board[y][x] = 'B';
      } else if (this.board[y][x] === 'B') {
        this.board[y][x] = ' ';
      }
    }

    this.draw();
  }
}
