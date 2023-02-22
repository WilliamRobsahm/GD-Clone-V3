import { GameManager } from "./game/GameManager.js";
import { canvas } from "./misc/global.js";

window.onload = () => init();

const game = new GameManager();

function init() {
    console.log("Starting game");

    setCanvasSize();
    window.onresize = () => setCanvasSize();

    game.initialize();
    window.requestAnimationFrame(renderLoop);
}

function renderLoop() {
    game.render();
    window.requestAnimationFrame(renderLoop);
}

// Set canvas to cover whole screen
function setCanvasSize() {
    canvas.setAttribute("height", Math.round(window.innerHeight).toString());
    canvas.setAttribute("width", Math.round(window.innerWidth).toString());
}