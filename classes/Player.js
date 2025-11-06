export default class Player {

    constructor(context, name, steerLeft, steerRight, color, trailWidth, speed, startPoint, motocycleImageUrl, width, height, loops) {
        this.context = context;
        this.name = name;
        this.steerLeft = steerLeft;
        this.steerRight = steerRight;
        this.color = color;
        this.trailWidth = trailWidth;
        this.speed = speed;
        this.startPoint = startPoint;
        this.position = startPoint;
        this.angle = 0;
        this.trail = [];
        this.motocycleImage = new Image();
        this.motocycleImage.src = motocycleImageUrl;
        this.width = width;
        this.height = height;
        this.crashed = false;
        this.loops = loops;
    }

    checkCollision(innerPath, outerPath) {
        const innerPathCollision = this.context.isPointInPath(innerPath, this.position.x, this.position.y);
        const outerPathCollision = this.context.isPointInPath(outerPath, this.position.x, this.position.y);
        if (innerPathCollision || !outerPathCollision)
            return true;
        return false;
    }

    update() {
        this.newPosition = this.calculateNewPosition();
        this.drawTrailPiece();
    }

    draw() {
        this.trail.forEach((trailPiece, index) => {
            this.context.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${trailPiece.opacity})`;
            this.context.lineWidth = this.trailWidth;
            this.context.stroke(trailPiece.instance);
            trailPiece.opacity -= 0.005;
            if (trailPiece.opacity <= 0) {
                this.trail.splice(index, 1);
            }
        });
    }

    drawMotocycle() {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.degToRad(this.angle));
        this.context.translate(0, 0);
        this.context.drawImage(this.motocycleImage, - (this.width / 2), - (this.height / 2), this.width, this.height);
        this.context.restore();
    }

    drawTrailPiece() {
        const trailPiece = new Path2D();
        trailPiece.moveTo(this.position.x, this.position.y);
        trailPiece.lineTo(this.newPosition.x, this.newPosition.y);
        this.trail.push({
            instance: trailPiece,
            opacity: 1
        });

        this.position = this.newPosition;
    }

    calculateNewPosition() {
        const dX = this.speed * Math.cos(this.degToRad(this.angle));
        const dY = this.speed * Math.sin(this.degToRad(this.angle));
        return {
            x: this.position.x + dX,
            y: this.position.y + dY
        };
    }

    degToRad(degs) {
        return degs * (Math.PI / 180);
    }

    clear(loops) {
        this.position = this.startPoint;
        this.angle = 0;
        this.trail = [];
        this.crashed = false;
        this.loops = loops;
    }

}