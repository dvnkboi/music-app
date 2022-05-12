import Link from './link';
import LinkOptions from './linkOptions';
import DraggableOptions from './draggableOptions';
export declare class Draggable {
    static draggables: Map<string, Draggable>;
    private parent;
    private element;
    readonly id: string;
    private elementPosition;
    private elementSelect;
    private isPoint;
    private eventType;
    private handle;
    private eventTarget;
    private mPose;
    private elementPos;
    private mousePressed;
    private boundingBox;
    private offsetCoords;
    private pageCoords;
    private animationFrame;
    private lastUpdatedTs;
    private mouseDownTs;
    private mouseUpTs;
    private dragging;
    private dragAllowed;
    private options;
    private scroll;
    private initialScroll;
    private iterations;
    private waitTimeout;
    private events;
    private previousClasses;
    private get calcPos();
    attached: Map<string | number, Draggable>;
    private debugBoxEl;
    private lastUpdate;
    private dropElements;
    initialized: boolean;
    links: Map<string, {
        link: Link;
        index: number;
    }>;
    private disabled;
    private mutationObserver;
    get isTouch(): boolean;
    get posError(): {
        x: number;
        y: number;
    };
    get interactionPos(): {
        x: number;
        y: number;
    };
    get transformCoords(): {
        x: number;
        y: number;
    };
    get boundaries(): {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    get relativeOffset(): {
        x: number;
        y: number;
    };
    initialOffset: {
        x: number;
        y: number;
    };
    get elementCoords(): {
        x: number;
        y: number;
    };
    get nonCorrectedPos(): {
        x: number;
        y: number;
    };
    get getElement(): HTMLElement;
    constructor(element: HTMLElement | string, options?: DraggableOptions);
    private process;
    private initDoc;
    private calculateMirrorDimensions;
    private getInitialDimentions;
    private hookEvents;
    private calculateoffsetCoords;
    private updateCycle;
    private draw;
    private hookDropEl;
    private initElement;
    private ease;
    private setPos;
    private getPos;
    private lerp;
    private resetIterations;
    private iterate;
    private wait;
    private allowDrag;
    private disallowDrag;
    private cycleClass;
    private hookDocumentEvents;
    private unhookDocumentEvents;
    private childAdded;
    private hookMutationObserver;
    private receiveLink;
    attachTo(elmt: Draggable, options?: LinkOptions): Promise<Draggable>;
    generateLinkId(elmt: Draggable | string | number): string;
    updateLinkPositions(): void;
    detachFrom(elmt: Draggable): Promise<Draggable>;
    release(): void;
    private emit;
    private evtDown;
    private evtDragging;
    private evtUp;
    private drag;
    disable(): Promise<Draggable>;
    enable(): Promise<Draggable>;
    on(event: string, callback: (event: any) => void): void;
    off(event: string, callback: (event: any) => void): void;
    once(event: string, callback: (event: any) => void): void;
    resetPosition(): Promise<Draggable>;
    round(x: number, n: number): number;
    moveTo(x: number, y: number, easing?: number, noMaxIterations?: boolean): Promise<Draggable>;
    static getDraggableFromPoint(pos: {
        x: number;
        y: number;
    }): Promise<Draggable>;
    static spawnPoint(pos: {
        x: number;
        y: number;
    }, options?: DraggableOptions): Promise<Draggable>;
    static spawnActivePoint(pos: {
        x: number;
        y: number;
    }, options?: DraggableOptions): Promise<Draggable>;
    destroy(): void;
    debugBox(): Promise<Draggable>;
    debugBoxMove(coords: {
        x: number;
        y: number;
    }): Promise<Draggable>;
}
export default Draggable;
//# sourceMappingURL=draggable.d.ts.map