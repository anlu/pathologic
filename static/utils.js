let utils = {
  // Computes the ratio of logical pixels to actual number of pixels on the screen.
  computePixelRatio: function() {
    let ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
  },

  // Create a canvas that is at the proper size for the dpi of the current browser
  // to prevent blurriness from upscaling. See https://stackoverflow.com/a/15666143
  createHiDPICanvas: function(w, h, ratio) {
      if (!ratio) { ratio = utils.computePixelRatio(); }
      let can = document.createElement("canvas");
      can.width = w * ratio;
      can.height = h * ratio;
      can.style.width = w + "px";
      can.style.height = h + "px";
      can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
      return can;
  }
};
