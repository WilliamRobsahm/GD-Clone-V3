

export class PropertyClasses {
    static btnBack = {
        width: "100px",
        height: "100px",
        backgroundColor: { h: 220, s: 80, l: 40 },
        offsetX: "40px",
        offsetY: "40px",
        text: "<",
        font: "72px Arco",
        cornerRadius: "8px"
    }
    
    // ================
    //      EDITOR
    // ================

    static editorModeBtn = {
        width: "80%", height: "25%",
        cornerRadius: "10px",
        centerX: true,
        outlineWidth: 3,
        backgroundColor: { h: 90, s: 85, l: 40 },
        font: "32px Arco",
        textOutlineSize: 3,
    }

    static editorToggleBtn = {
        width: "44%", 
        height: "80%", 
        centerY: true, 
        cornerRadius: "10px",
        backgroundColor: { h: 90, s: 85, l: 40 },
        textOutlineSize: 3,
        outlineWidth: 3,
        font: "20px Arco",
    }

    static editorZoomBtn = {
        font: "48px Arco",
        textOutlineSize: 3,
        width: "80px", height: "80px",
        floatY: "BOTTOM", offsetY: "20px",
        centerX: true,
        cornerRadius: "40px",
        outlineWidth: 3,
        backgroundColor: { h: 90, s: 85, l: 40 },
    }
}