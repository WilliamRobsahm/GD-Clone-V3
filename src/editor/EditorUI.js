import UIButton from "../ui/elements/uiButton.js";
import UIElement from "../ui/elements/uiElement.js";
import PageBase from "../ui/pages/PageBase.js";

export default class EditorUI extends PageBase {
    constructor(editor) {
        super(null, "LEVEL_EDITOR");
        this.editor = editor;

        this.topContainer = new UIElement(null, this.mainContent, {
            position: "ABSOLUTE",
            width: "100%", height: "10%",
        });

        this.lowerContainer = new UIElement(null, this.mainContent, {
            position: "ABSOLUTE",
            width: "100%", height: "25%",
            floatY: "BOTTOM",
            backgroundColor: { h: 0, s: 0, l: 0, a: 0.7 },
        });

        this.leftContainer = new UIElement(null, this.mainContent, {
            position: "ABSOLUTE",
            childAlign: "COLUMN",
            width: "8%", height: "65%",
            offsetY: "10%",
        });

        this.rightContainer = new UIElement(null, this.mainContent, {
            position: "ABSOLUTE",
            width: "8%", height: "65%",
            floatX: "RIGHT", offsetY: "10%",
        });

        this.zoomOutBtn = new UIButton(null, this.leftContainer, {
            text: "-",
            classList: ["editorZoomBtn"],
            onClick: () => { this.editor.updateZoom(-2) }
        });

        this.zoomInBtn = new UIButton(null, this.leftContainer, {
            text: "+",
            classList: ["editorZoomBtn"],
            onClick: () => { this.editor.updateZoom(2) }
        });

        this.modesContainer = new UIElement(null, this.lowerContainer, {
            position: "ABSOLUTE",
            height: "100%", width: "16%",
            childAlign: "COLUMN", childSpacing: "6.25%",
        }) 

        this.togglesContainer = new UIElement(null, this.lowerContainer, {
            position: "ABSOLUTE",
            childAlign: "COLUMN",
            floatX: "RIGHT",
            height: "100%", width: "16%",
        });

        this.togglesR1 = new UIElement(null, this.togglesContainer, { height: "50%", width: "100%" });
        this.togglesR2 = new UIElement(null, this.togglesContainer, { height: "50%", width: "100%" });

        this.modeButtons = {
            BUILD: new UIButton(null, this.modesContainer, {
                text: "Build",
                classList: ["editorModeBtn"],
                onClick: () => { this.setMode("BUILD") }
            }),

            EDIT: new UIButton(null, this.modesContainer, {
                text: "Edit",
                classList: ["editorModeBtn"],
                onClick: () => { this.setMode("EDIT") }
            }),

            DELETE: new UIButton(null, this.modesContainer, {
                text: "Delete",
                classList: ["editorModeBtn"],
                onClick: () => { this.setMode("DELETE") }
            }),
        }

        this.toggleButtons = {
            SWIPE: new UIButton(null, this.togglesR1, {
                classList: ["editorToggleBtn"],
                offsetY: "3%",
                text: "Swipe",
                onClick: () => { this.toggleSwipe() }
            }),

            ROTATE: new UIButton(null, this.togglesR1, {
                classList: ["editorToggleBtn"],
                offsetX: "6%", offsetY: "3%",
                text: "Rotate",
                onClick: () => { this.toggleRotate() }
            }),

            FREE_MOVE: new UIButton(null, this.togglesR2, {
                classList: ["editorToggleBtn"],
                offsetY: "-3%",
                text: "Free Move",
                font: "16px Arco",
                onClick: () => { this.toggleFreeMove() }
            }),

            SNAP: new UIButton(null, this.togglesR2, {
                classList: ["editorToggleBtn"],
                offsetX: "6%", offsetY: "-3%",
                text: "Snap",
                onClick: () => { this.toggleSnap() }
            }),
        }

        this.setMode("BUILD");
    }

    // "BUILD", "EDIT", or "DELETE"
    setMode(mode) {
        if(this.editor.mode)
            this.modeButtons[this.editor.mode].backgroundColor = { h: 90, s: 85, l: 40 };

        this.editor.mode = mode;
        this.modeButtons[this.editor.mode].backgroundColor = { h: 180, s: 95, l: 40 };
    }

    toggleSwipe() {
        let color = this.editor.swipeMode ? { h: 90, s: 85, l: 40 } : { h: 180, s: 95, l: 40 };
        this.toggleButtons.SWIPE.backgroundColor = color;
        this.editor.swipeMode = !this.editor.swipeMode;
    }

    toggleRotate() {
        let color = this.editor.rotateMode ? { h: 90, s: 85, l: 40 } : { h: 180, s: 95, l: 40 };
        this.toggleButtons.ROTATE.backgroundColor = color;
        this.editor.rotateMode = !this.editor.rotateMode;
    }

    toggleFreeMove() {
        let color = this.editor.freeMove ? { h: 90, s: 85, l: 40 } : { h: 180, s: 95, l: 40 };
        this.toggleButtons.FREE_MOVE.backgroundColor = color;
        this.editor.freeMove = !this.editor.freeMove;
    }

    toggleSnap() {
        let color = this.editor.snapMode ? { h: 90, s: 85, l: 40 } : { h: 180, s: 95, l: 40 };
        this.toggleButtons.SNAP.backgroundColor = color;
        this.editor.snapMode = !this.editor.snapMode;
    }

    update() {
        this.mainContent.recursiveUpdate();
    }

    render() {
        this.mainContent.recursiveRender();
    }
}