var ctx = document.getElementById('pathologic').getContext('2d');

function draw(timestamp) {
  ctx.globalCompositeOperation = 'destination-over';

  console.log(ctx.canvas.width);
  console.log(ctx.canvas.height);

  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

window.requestAnimationFrame(draw);
