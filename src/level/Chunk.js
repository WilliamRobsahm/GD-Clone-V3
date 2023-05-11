import PlayerCamera from "../player/Camera.js";

export default class Chunk {
    constructor(level, gridX, size) {
        this.level = level;
        this.gridX = gridX;
        this.size = size;
        this.objectList = []
    }

    // objectList stores the list index of all objects belonging to the chunk
    add(index) {
        this.objectList.push(index);
    }

    getHazardObjects() {
        const hazardObjects = [];
        this.objectList.forEach(objIndex => {
            let obj = this.level.getObject(objIndex);
            if(obj.isHazard()) {
                hazardObjects.push(obj);
            }
        });
        return hazardObjects;
    }

    getSolidObjects() {
        const solidObjects = [];
        this.objectList.forEach(objIndex => {
            let obj = this.level.getObject(objIndex);
            if(obj.isSolid()) {
                solidObjects.push(obj);
            }
        });
        return solidObjects;
    }

    // Return true if player is close enough to the chunk to check collision for all objects in it
    inCollisionRange(player) {
        let leeway = 32;
        return (this.gridX + this.size) * 64 > player.getX() - leeway &&
        this.gridX * 64 < player.getX() + player.getWidth() + leeway
    }

    /**
     * Return true if chunk is on screen and its objects should be rendered
     * @param {PlayerCamera} camera 
     */
    inRenderingRange(camera) {
        // Gives one extra tile of leeway on both ends, 
        // to prevent any larger objects (like saws) from popping in/out of existance.
        let leeway = 64;
        return (this.gridX + this.size) * 64 > camera.getX() - leeway &&
            this.gridX * 64 < camera.getX() + camera.getWidth() + leeway
    }

    /**
     * Once I introduce object layering, this will have to be changed.
     * @param {object} channels 
     */
    renderObjects(channels) {
        for(let i = 0; i < this.objectList.length; i++) {
            this.level.getObject(this.objectList[i]).render(channels);
        }
    }

    renderHitboxes() {
        for(let i = 0; i < this.objectList.length; i++) {
            this.level.getObject(this.objectList[i]).getHitbox()?.render();
        }
    }
}