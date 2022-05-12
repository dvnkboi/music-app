export declare class PointerUtils {
    private events;
    private downTs;
    private upTs;
    private longPressDownTo;
    private ignoredEls;
    private isHooked;
    pageCoords: {
        x: number;
        y: number;
    };
    isPressed: boolean;
    isLongPress: boolean;
    isTouch: boolean;
    downPrevent: boolean;
    clickPrevent: boolean;
    doublePrevent: boolean;
    upPrevent: boolean;
    enterPrevent: boolean;
    leavePrevent: boolean;
    MovePrevent: boolean;
    CancelPrevent: boolean;
    outPrevent: boolean;
    overPrevent: boolean;
    lockChangePrevent: boolean;
    lockErrorPrevent: boolean;
    contextMenuPrevent: boolean;
    doubleClickTime: number;
    longPressTime: number;
    previousCoords: {
        x: number;
        y: number;
    };
    moveThreshold: number;
    longPressOnUp: boolean;
    set ignore(el: string | HTMLElement | HTMLElement[]);
    downCb: (e: PointerEvent) => unknown;
    clickCb: (e: PointerEvent) => unknown;
    doubleClickCb: (e: PointerEvent) => unknown;
    longPressCb: (e: PointerEvent) => unknown;
    upCb: (e: PointerEvent) => unknown;
    enterCb: (e: PointerEvent) => unknown;
    leaveCb: (e: PointerEvent) => unknown;
    moveCb: (e: PointerEvent) => unknown;
    cancelCb: (e: PointerEvent) => unknown;
    outCb: (e: PointerEvent) => unknown;
    overCb: (e: PointerEvent) => unknown;
    lockChangeCb: (e: PointerEvent) => unknown;
    lockErrorCb: (e: PointerEvent) => unknown;
    contextMenuCb: (e: PointerEvent) => unknown;
    downEl: HTMLElement;
    clickEl: HTMLElement;
    doubleClickEl: HTMLElement;
    longPressEl: HTMLElement;
    upEl: HTMLElement;
    enterEl: HTMLElement;
    leaveEl: HTMLElement;
    moveEl: HTMLElement;
    cancelEl: HTMLElement;
    outEl: HTMLElement;
    overEl: HTMLElement;
    lockChangeEl: HTMLElement;
    lockErrorEl: HTMLElement;
    contextMenuEl: HTMLElement;
    get currentElement(): HTMLElement;
    get currentPath(): HTMLElement[];
    hook(): void;
    private pointerDownFn;
    private pointerUpFn;
    private pointerEnterFn;
    private pointerLeaveFn;
    private pointerMoveFn;
    private pointerCancelFn;
    private pointerOutFn;
    private pointerOverFn;
    private pointerLockChangeFn;
    private pointerLockErrorFn;
    private pointerContextMenuFn;
    destroy(): void;
    static lerp(a: number, b: number, t: number): number;
    static getDistance(a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }): number;
    static getAngle(a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }): number;
    static getAngleDeg(a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }): number;
    static clamp(value: number, min: number, max: number): number;
    static map(value: number, min: number, max: number, newMin: number, newMax: number): number;
    static click(x: number, y: number): MouseEvent;
    static mousedown(x: number, y: number): MouseEvent;
    static mouseup(x: number, y: number): MouseEvent;
    static mousemove(x: number, y: number): MouseEvent;
    static mousewheel(x: number, y: number, delta: number): WheelEvent;
    static changeEventCoords(e: PointerEvent, pos: {
        x: number;
        y: number;
    }): Promise<PointerEvent>;
    static isScrollable(el: HTMLElement): boolean;
    static getScrollableParent(el: HTMLElement): HTMLElement;
}
export default PointerUtils;
//# sourceMappingURL=pointerUtils.d.ts.map