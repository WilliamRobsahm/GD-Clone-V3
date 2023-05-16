import { GameManager } from "./game/GameManager.js";
import { canvas } from "./misc/global.js";
import { fadeOverlay } from "./ui/FadeOverlay.js";

window.onload = () => init();

const game = new GameManager();

function init() {
    setCanvasSize();
    window.onresize = () => {
        setCanvasSize();
        game.player.camera.realign();
    }

    game.initialize();

    setTimeout(() => {fadeOverlay.beginFadeIn()}, 200);

    window.requestAnimationFrame(gameLoop);
}

let previousTime = 0;

function gameLoop(timestamp) {
    // Calculate time since last frame
    const deltaTime = timestamp - previousTime
    previousTime = timestamp;

    game.update(deltaTime);
    game.render();
    window.requestAnimationFrame(gameLoop);
}

// Set canvas to cover whole screen
function setCanvasSize() {
    canvas.setAttribute("height", Math.round(window.innerHeight).toString());
    canvas.setAttribute("width", Math.round(window.innerWidth).toString());
}