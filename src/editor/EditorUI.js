import { colors } from "../helpers/ColorHelper.js";
import { isValidListIndex } from "../helpers/helper.js";
import { ActivePageIndicatorModel } from "../ui/elements/models/ActivePageIndicator.js";
import { ButtonArrowModel } from "../ui/elements/models/ButtonArrow.js";
import { ObjectNavTabModel } from "../ui/elements/models/ObjectNavTabModel.js";
import { ObjectTypeSelectorModel } from "../ui/elements/models/ObjectTypeSelector.js";
import UIButton from "../ui/elements/uiButton.js";
import UIElement from "../ui/elements/uiElement.js";
import PageBase from "../ui/pages/PageBase.js";
import { objectTabManager } from "./ObjectTabManager.js";

const OBJECTS_PER_ROW = 7;
const OBJECT_ROW_COUNT = 2;
const OBJECTS_PER_PAGE = OBJECTS_PER_ROW * OBJECT_ROW_COUNT;

const OBJ_SELECTOR_SIZE = 64;
const OBJ_SELECTOR_MARGIN = 16;

const OBJECT_CONTAINER_WIDTH = (OBJ_SELECTOR_SIZE * OBJECTS_PER_ROW) + (OBJ_SELECTOR_MARGIN * (OBJECTS_PER_ROW + 1));
const OBJECT_CONTAINER_HEIGHT = (OBJ_SELECTOR_SIZE * OBJECT_ROW_COUNT) + (OBJ_SELECTOR_MARGIN * (OBJECT_ROW_COUNT + 1));

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

		this.objectTypeSelectors = {};

		// Set up object tabs and navigation
        for(const tabname in objectTabManager.tabs) {

			const tab = objectTabManager.getTab(tabname);

            const navTabElement = new UIButton(null, this.objectNavTabContainer, {
                height: "48px", width: "100px",
                model: new ObjectNavTabModel(tab.iconObject),
                onClick: () => {
                    this.selectObjectTab(tabname);
                }
            });

			const getObjectTypeSelector = (rowElement, object) => {
				return new UIButton(null, rowElement, {
					width: OBJ_SELECTOR_SIZE, height: OBJ_SELECTOR_SIZE,
					centerY: true,
					model: new ObjectTypeSelectorModel(object, 0.8),
					onClick: () => {
						this.selectObjectType(object.name);
					}
				});
			}


			const pages = [];
			let pageCount = Math.ceil(tab.objectList.length / OBJECTS_PER_PAGE);
			if(pageCount == 0) pageCount = 1;

			let objectIndex = 0;
			for(let i = 0; i < pageCount; i++) {
				let container = new UIElement(null, this.lowerContainer, {
					width: OBJECT_CONTAINER_WIDTH + "px",
					height: OBJECT_CONTAINER_HEIGHT + "px",
					centerX: true, centerY: true,
					backgroundColor: colors.black,
					childAlign: "COLUMN",
					visible: false,
				});

				const rowList = [];
				
				for(let y = 0; y < OBJECT_ROW_COUNT; y++) {
					const rowElement = new UIElement(null, container, {
						height: OBJECT_CONTAINER_HEIGHT / OBJECT_ROW_COUNT + "px",
						childSpacing: OBJ_SELECTOR_MARGIN,
						width: "100%",
					});

					for(let x = 0; x < OBJECTS_PER_ROW; x++) {
						if(!isValidListIndex(tab.objectList, objectIndex)) break;
						let object = tab.objectList[objectIndex];
						this.objectTypeSelectors[object.name] = getObjectTypeSelector(rowElement, object);
						objectIndex++;
					}

					rowList.push(rowElement);
				}

				console.log(rowList);

				pages.push({
					container: container,
					rows: rowList,
				})
			}

			const indicator = new UIElement(null, this.lowerContainer, {
				position: "ABSOLUTE",
				centerX: true,
				floatY: "BOTTOM",
				offsetY: "16px",
				model: new ActivePageIndicatorModel(pages.length),
			});

			tab.uiNavTab = navTabElement;
			tab.pages = pages;
			tab.pageIndicator = indicator;
        }

		this.objectPageLeft = new UIButton(null, this.lowerContainer, {
			width: "80px", height: "120px", centerX: true, centerY: true,
			offsetX: -OBJECT_CONTAINER_WIDTH / 2 - 40,
			model: new ButtonArrowModel("LEFT", true),
			scaleOnHover: true,
			onClick: () => {
				objectTabManager.getActiveTab().navigatePages(-1);
				this.updatePageIndicator();
			}
		});

		this.objectPageRight = new UIButton(null, this.lowerContainer, {
			width: "80px", height: "120px", centerX: true, centerY: true,
			offsetX: OBJECT_CONTAINER_WIDTH / 2 + 40,
			model: new ButtonArrowModel("RIGHT", true),
			scaleOnHover: true,
			onClick: () => {
				objectTabManager.getActiveTab().navigatePages(1);
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

        this.selectObjectTab(objectTabManager.activeTab);
        this.setMode("BUILD");
		this.updatePageIndicator();
	}

	updatePageIndicator() {
		this.pageIndicator.model.itemCount = objectTabManager.getCurrentPageCount();
		this.pageIndicator.model.activeItem = objectTabManager.getActiveTab().activePage;
	}

    // "BUILD", "EDIT", or "DELETE"
    setMode(mode) {
        if(this.editor.mode)
            this.modeButtons[this.editor.mode].backgroundColor = { h: 90, s: 85, l: 40 };

        this.editor.mode = mode;
        this.modeButtons[this.editor.mode].backgroundColor = { h: 180, s: 95, l: 40 };

		this.objectNavTabContainer.visible = (mode === "BUILD");
		objectTabManager.getActiveTabPage().visible = (mode === "BUILD");
		this.objectPageLeft.visible = (mode === "BUILD");
		this.objectPageRight.visible = (mode === "BUILD");
		objectTabManager.getActiveTab().pageIndicator.visible = (mode === "BUILD");
    }

    selectObjectTab(tabname) {
      	objectTabManager.getActiveTab().uiNavTab.model.selected = false;
		objectTabManager.getTab(tabname).uiNavTab.model.selected = true;
		objectTabManager.getActiveTabPage().visible = false;
		objectTabManager.getTab(tabname).getActivePage().visible = true;
        objectTabManager.activeTab = tabname;
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