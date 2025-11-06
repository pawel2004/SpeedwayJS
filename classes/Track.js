export default class Track {

    constructor(context, width, height, trackPadding, patternImgUrl, boundWidth, boundColor, trackColor) {
        this.context = context;
        this.width = width;
        this.height = height;
        this.trackPadding = trackPadding;
        this.boundWidth = boundWidth;
        this.boundColor = boundColor;
        this.trackColor = trackColor;
        this.outerRadius = height / 2 - this.trackPadding;
        this.innerRadius = height / 8;
        this.patternImg = new Image();
        this.patternImg.src = patternImgUrl;
    }

    draw() {
        this.pattern = this.context.createPattern(this.patternImg, "repeat");
        this.context.beginPath();
        this.context.fillStyle = this.pattern;
        this.context.fillRect(0, 0, this.width, this.height);

        this.drawOuterPath();
        this.drawInnerPath();
    }

    drawInnerPath() {
        this.innerPath = new Path2D();
        this.innerPath.arc(this.outerRadius / 2 + this.innerRadius * 2, this.height / 2, this.innerRadius, 0.5 * Math.PI, 1.5 * Math.PI);
        this.innerPath.lineTo(this.width - (this.outerRadius / 2 + this.innerRadius * 2), this.height / 2 - this.innerRadius);
        this.innerPath.arc(this.width - (this.outerRadius / 2 + this.innerRadius * 2), this.height / 2, this.innerRadius, 1.5 * Math.PI, 0.5 * Math.PI);
        this.innerPath.lineTo(this.outerRadius / 2 + this.innerRadius * 2, this.height / 2 + this.innerRadius);
        this.context.lineWidth = this.boundWidth;
        this.context.strokeStyle = this.boundColor;
        this.context.fillStyle = this.pattern;
        this.context.stroke(this.innerPath);
        this.context.fill(this.innerPath);
    }

    drawOuterPath() {
        this.outerPath = new Path2D();
        this.outerPath.arc(this.outerRadius + this.trackPadding, this.height / 2, this.outerRadius, 0.5 * Math.PI, 1.5 * Math.PI);
        this.outerPath.lineTo(this.width - this.outerRadius - this.trackPadding, 2);
        this.outerPath.arc(this.width - this.outerRadius - this.trackPadding, this.height / 2, this.outerRadius, 1.5 * Math.PI, 0.5 * Math.PI);
        this.outerPath.lineTo(this.outerRadius + this.trackPadding, this.height - 2);
        this.context.lineWidth = this.boundWidth;
        this.context.strokeStyle = this.boundColor;
        this.context.fillStyle = this.trackColor;
        this.context.stroke(this.outerPath);
        this.context.fill(this.outerPath);
    }

}