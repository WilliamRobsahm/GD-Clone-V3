import { colors } from "../helpers/ColorHelper.js";
import { isValidListIndex } from "../helpers/helper.js";
import { ActivePageIndicatorModel } from "../ui/elements/models/ActivePageIndicator.js";
import { ButtonArrowModel } from "../ui/elements/models/ButtonArrow.js";
import { EditButtonModel } from "../ui/elements/models/EditButtonModel.js";
import { ObjectNavTabModel } from "../ui/elements/models/ObjectNavTabModel.js";
import { ObjectTypeSelectorModel } from "../ui/elements/models/ObjectTypeSelector.js";
import UIButton from "../ui/elements/uiButton.js";
import UIElement from "../ui/elements/uiElement.js";
import PageBase from "../ui/pages/PageBase.js";
import { ButtonPage } from "./ButtonPage.js";
import { tabManager } from "./TabManager.js";

const BUTTONS_PER_ROW = 7;
const BUTTON_ROW_COUNT = 2;
const BUTTONS_PER_PAGE = BUTTONS_PER_ROW * BUTTON_ROW_COUNT;

const BUTTON_SIZE = 64;
const BUTTON_MARGIN = 16;

const BUTTON_CONTAINER_WIDTH = (BUTTON_SIZE * BUTTONS_PER_ROW) + (BUTTON_MARGIN * (BUTTONS_PER_ROW + 1));
const BUTTON_CONTAINER_HEIGHT = (BUTTON_SIZE * BUTTON_ROW_COUNT) + (BUTTON_MARGIN * (BUTTON_ROW_COUNT + 1));

const CONTAINER_PROPS = {
    width: BUTTON_CONTAINER_WIDTH + "px",
    height: BUTTON_CONTAINER_HEIGHT + "px",
    centerX: true, centerY: true,
    backgroundColor: colors.black,
    childAlign: "COLUMN",
    visible: false,
}

const ROW_PROPS = {
    height: BUTTON_CONTAINER_HEIGHT / BUTTON_ROW_COUNT + "px", width: "100%",
    childSpacing: BUTTON_MARGIN,
}

export default class EditorUI extends PageBase {
    constructor(editor) {
        super(null, "LEVEL_EDITOR");
        this.editor = editor;
    }

	initialize() {
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

        this.objectNavTabContainer = new UIElement(null, this.lowerContainer, {
            position: "ABSOLUTE",
            selfAlignX: "CENTER",
            overflow: "STRETCH",
            centerX: true,
            offsetY: "-48px",
            childSpacing: "20px",
        });

        this.pageIndicator = new UIElement(null, this.lowerContainer, {
            position: "ABSOLUTE",
            centerX: true,
            floatY: "BOTTOM",
            offsetY: "16px",
            model: new ActivePageIndicatorModel(),
        });

        this.objectTypeSelectors = {};
        this.objectNavTabs = {};
        this.initializeObjectTabs();

        this.editBtns = {}
        this.initializeEditButtons();
        

		this.btnPageLeft = new UIButton(null, this.lowerContainer, {
			width: "80px", height: "120px", centerX: true, centerY: true,
			offsetX: -BUTTON_CONTAINER_WIDTH / 2 - 40,
			model: new ButtonArrowModel("LEFT", true),
			scaleOnHover: true,
			onClick: () => {
				this.navigatePages(-1);
				this.updatePageIndicator();
			}
		});

		this.btnPageRight = new UIButton(null, this.lowerContainer, {
			width: "80px", height: "120px", centerX: true, centerY: true,
			offsetX: BUTTON_CONTAINER_WIDTH / 2 + 40,
			model: new ButtonArrowModel("RIGHT", true),
			scaleOnHover: true,
			onClick: () => {
				this.navigatePages(1);
				this.updatePageIndicator();
			}
		});

		this.pageIndicator = new UIElement(null, this.lowerContainer, {
			position: "ABSOLUTE",
			centerX: true,
			floatY: "BOTTOM",
			offsetY: "16px",
			model: new ActivePageIndicatorModel(),
		});

        this.setMode("BUILD");
        this.selectObjectTab(tabManager.selectedObjectType);
		this.updatePageIndicator();
	}

    initializeObjectTabs() {
        

        const getObjectTypeSelector = (rowElement, object) => {
            return new UIButton(null, rowElement, {
                width: BUTTON_SIZE, height: BUTTON_SIZE,
                centerY: true,
                model: new ObjectTypeSelectorModel(object, 0.8),
                onClick: () => this.selectObjectType(object.name)
            });
        }

        for(const tabname in tabManager.objectTabs) {

            const tab = tabManager.objectTabs[tabname];

            const navTab = new UIButton(null, this.objectNavTabContainer, {
                height: "48px", width: "100px",
                model: new ObjectNavTabModel(tab.iconObject),
                onClick: () => this.selectObjectTab(tabname)
            });
            
			const pages = [];
			let pageCount = Math.ceil(tab.objectList.length / BUTTONS_PER_PAGE);
			if(pageCount == 0) pageCount = 1;

			let objectIndex = 0;
			for(let i = 0; i < pageCount; i++) {
				const container = new UIElement(null, this.lowerContainer, CONTAINER_PROPS);

				const rowList = [];
				
				for(let y = 0; y < BUTTON_ROW_COUNT; y++) {
					const rowElement = new UIElement(null, container, ROW_PROPS);

					for(let x = 0; x < BUTTONS_PER_ROW; x++) {
						if(!isValidListIndex(tab.objectList, objectIndex)) break;
						let object = tab.objectList[objectIndex];
						this.objectTypeSelectors[object.name] = getObjectTypeSelector(rowElement, object);
						objectIndex++;
					}

					rowList.push(rowElement);
				}

                pages.push(new ButtonPage(container, rowList));
			}

            this.objectNavTabs[tabname] = navTab;
			tab.pages.setItems(pages);
        }
    }

    initializeEditButtons() {
        const BUTTON_LIST = {
            "moveLeft": () => { console.log("TODO Move selection left") },
            "moveUp": () => { console.log("TODO Move selection up") },
            "moveDown": () => { console.log("TODO Move selection down") },
            "moveRight": () => { console.log("TODO Move selection right") },
            "rotateCW": () => { console.log("TODO Rotate selection clockwise") },
            "rotateCCW": () => { console.log("TODO Rotate selection counterclockwise") },
        }

        const getEditButton = (row, type) => {
            return new UIButton(null, row, {
                width: BUTTON_SIZE, height: BUTTON_SIZE,
                centerY: true,
                model: new EditButtonModel(type),
                onClick: BUTTON_LIST[type]
            })
        }

        const getNewContainer = () => {
            return new UIElement(null, this.lowerContainer, CONTAINER_PROPS);
        }

        const getNewRow = () => {
            return new UIElement(null, pageList[pageIndex].container, ROW_PROPS);
        }

        let index = 0;
        let rowIndex = 0;
        let pageIndex = 0;

        let pageList = [
            new ButtonPage(getNewContainer(), [])
        ];

        let rowList = [
            getNewRow()
        ];
        
        for(const btnName in BUTTON_LIST) {
            console.log(btnName);

            // Check if row is full
            if(index - (rowIndex * BUTTONS_PER_ROW) >= BUTTONS_PER_ROW) {
                // Check if page is full
                if(index - (pageIndex * BUTTONS_PER_PAGE >= BUTTONS_PER_PAGE)) {
                    pageList[pageIndex].rows = rowList;
                    pageList.push(new ButtonPage(getNewContainer(), []));
                    pageIndex++;
                    rowList = [getNewRow()];
                    rowIndex = 0;
                } else {
                    rowList.push(getNewRow());
                    rowIndex++;
                }
            }

            let btn = getEditButton(rowList[rowIndex], btnName);
            this.editBtns[btnName] = btn;
            index++;
        }

        tabManager.tabs["EDIT"].setItems(pageList);
    }

    navigatePages(n) {
        tabManager.getActiveTab().shift(n);
    }

	updatePageIndicator() {
        this.pageIndicator.model.itemList = tabManager.getActiveTab();
	}

    // "BUILD", "EDIT", or "DELETE"
    setMode(mode) {
        if(this.editor.mode)
            this.modeButtons[this.editor.mode].backgroundColor = { h: 90, s: 85, l: 40 };

        this.editor.mode = mode;
        tabManager.getActiveContainer()?.setVisible(false);
        tabManager.activeTab = mode;
        tabManager.getActiveContainer()?.setVisible(true);

        this.modeButtons[this.editor.mode].backgroundColor = { h: 180, s: 95, l: 40 };

        let isBuildMode = mode === "BUILD"
		this.objectNavTabContainer.setVisible(isBuildMode);
		//objectTabManager.getActivePage().container.setVisible(isBuildMode);
    }

    selectObjectTab(tabname) {
        this.objectNavTabs[tabManager.selectedObjectType].model.selected = false;
        this.objectNavTabs[tabname].model.selected = true;
    
        tabManager.selectObjectTab(tabname);
		this.updatePageIndicator();
    }

	selectObjectType(typeName) {
		let prevType = this.editor.selectedObjectType;
		if(prevType) {
			this.objectTypeSelectors[prevType].model.selected = false; 
		}
		this.objectTypeSelectors[typeName].model.selected = true;
		this.editor.selectedObjectType = typeName;
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