let ctx = document.getElementById('pathologic').getContext('2d');

let board = [
  ['0', 'X', '0'],
  ['X', 'X', 'X'],
  ['0', 'X', '0'],
];

function draw(timestamp) {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let row in board) {
    for (let col in board) {
      ctx.fillRect(0, 0, 32, 32);
      ctx.translate(34, 0);
    }
    ctx.translate(-(board[0].length * 34), 34);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

window.requestAnimationFrame(draw);
