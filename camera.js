var camera = {
    x: 0,
    y: 0,
    moved: false,
    zoom: 1,
    maxZoom: 16,
    w: false,
    a: false,
    s: false,
    d: false,
    update: function() {
        var lastX = this.x;
        var lastY = this.y;
        if (this.a) {
            this.x -= 1;
        }
        if (this.d) {
            this.x += 1;
        }
        if (this.w) {
            this.y -= 1;
        }
        if (this.s) {
            this.y += 1;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > 6 * gridSize * (this.zoom - 1) / this.zoom) {
            this.x = 6 * gridSize * (this.zoom - 1) / this.zoom;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > 6 * gridSize * (this.zoom - 1) / this.zoom) {
            this.y = 6 * gridSize * (this.zoom - 1) / this.zoom;
        }
        if (this.x - lastX != 0 || this.y - lastY != 0) {
            this.moved = true;
            brush.x += (this.x - lastX) / 6;
            brush.y += (this.y - lastY) / 6;
            brush.draw();
        }
    },
    changeZoom: function(newZoom) {
        var lastX = this.x;
        var lastY = this.y;
        this.x = Math.floor(brush.x * 6 * newZoom - (brush.x * 6 - this.x) * this.zoom) / newZoom;
        this.y = Math.floor(brush.y * 6 * newZoom - (brush.y * 6 - this.y) * this.zoom) / newZoom;
        this.zoom = newZoom;
        if (this.x - lastX != 0 || this.y - lastY != 0) {
            this.moved = true;
        }
        brush.draw();
        drawCanvas();
    },
    resetZoom: function() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.moved = true;
    },
};
// x and y are from 0 to 6 * gridSize
