const TILE_SIZE = 50;
const TRANSLATE_SIZE = TILE_SIZE;

class Board {
  constructor(puzzleJson, elem) {
    this.puzzleJson = puzzleJson;
    this.board = puzzleJson['board'];
    this.elem = elem;
    this.ctx = elem.getContext('2d');
    this.numPlacedBlocks = 0;

    for (let i in this.board) {
      if (typeof this.board[i] === 'string') {
        this.board[i] = this.board[i].split('');
      }
    }

    elem.addEventListener('click', this._handleClick.bind(this));
  }

  draw() {
    this.ctx.save();
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
    this.ctx.restore();

    this.ctx.font = '20px sans-serif';
    this.ctx.fillText(this.puzzleJson['maxBlocks'] - this.numPlacedBlocks, 700, 100);
  }

  animateShortestPath() {
    let DRAW_DELAY_MS = 30; // Interval to wait before drawing successive path blocks
    let shortestPath = this.getShortestPath();
    if (shortestPath === null) {
      return;
    }

    let drawPath = [];
    for (let i = 0;i < shortestPath.length - 1;i++) {
      // Rotation starts at positive x axis and goes downwards
      let cur = shortestPath[i], next = shortestPath[i+1];
      if (next['row'] > cur['row']) {
        cur['rotation'] = Math.PI / 2;
      } else if (next['row'] < cur['row']) {
        cur['rotation'] = -Math.PI / 2;
      } else if (next['col'] < cur['col']) {
        cur['rotation'] = Math.PI;
      } else {
        cur['rotation'] = 0;
      }
      drawPath.push(cur);
    }

    let _drawSquare = function(coord) {
      this.ctx.save();
      this.ctx.translate(coord['col'] * TILE_SIZE + TILE_SIZE / 2, coord['row'] * TILE_SIZE + TILE_SIZE / 2);
      this.ctx.rotate(coord['rotation']);
      this.ctx.translate(-(coord['col'] * TILE_SIZE + TILE_SIZE / 2), -(coord['row'] * TILE_SIZE + TILE_SIZE / 2));
      this.ctx.translate(coord['col'] * TILE_SIZE, coord['row'] * TILE_SIZE);
      this.ctx.fillStyle = '#dddddd';
      this.ctx.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

      this.ctx.fillStyle = '#e1cf6b';
      this.ctx.beginPath();
      this.ctx.moveTo(15, 11);
      this.ctx.lineTo(38, 25);
      this.ctx.lineTo(15, 39);
      this.ctx.fill();
      this.ctx.restore();
    };

    let _animate = function(step, reverse) {
      this.draw();

      let squaresToDraw;
      if (reverse) {
        squaresToDraw = drawPath.slice(step, drawPath.length);
      } else {
        squaresToDraw = drawPath.slice(0, step);
      }

      for (let coord of squaresToDraw) {
        _drawSquare.bind(this)(coord);
      }

      if (step === drawPath.length) {
        if (!reverse) {
          setTimeout(_animate.bind(this, 1, true), 1000);
        }
      } else {
        setTimeout(_animate.bind(this, step + 1, reverse), DRAW_DELAY_MS);
      }
    }
    _animate.bind(this)(1, false);
  }

  getShortestPath() {
    let _coordKey = function(coord) {
      return coord['row'] + ',' + coord['col'];
    };

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
        return !visited[_coordKey(coord)] && (
          this.board[coord['row']][coord['col']] === ' ' ||
          this.board[coord['row']][coord['col']] === 'E'
        );
      });

      var shortestPath = null;
      var shortestLength = Infinity;
      for (let coord of possibilities) {
        let newVisited = Object.assign({}, visited);
        newVisited[_coordKey(coord)] = true;
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

  _handleClick(e) {
    let x = Math.floor(e.offsetX / TILE_SIZE);
    let y = Math.floor(e.offsetY / TILE_SIZE);

    if (y < this.board.length && x < this.board[0].length) {
      if (this.board[y][x] === ' ' && this.numPlacedBlocks < this.puzzleJson['maxBlocks']) {
        this.board[y][x] = 'B';
        this.numPlacedBlocks += 1;
      } else if (this.board[y][x] === 'B') {
        this.board[y][x] = ' ';
        this.numPlacedBlocks -= 1;
      }
    }

    this.draw();
  }
}
