
/**
 * The rendered component of ParallaxElement objects.
 * Background and floor variants extends this.
 */
export default class ParallaxBase {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    getWidth() { return this.width }
    getHeight() { return this.height }

    getSegmentX(x, segmentNo) {
        return Math.floor(x) + this.getWidth() * segmentNo;
    }

    // Prepare colors and gradients, stuff which is universal for all background segments.
    renderInit(x, y, channels) {}

    // Render a segment of the background or floor. Multiple segments are rendered to make sure the whole screen is covered
    renderSegment(x, y, segmentNo) {}
}