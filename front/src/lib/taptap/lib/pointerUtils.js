import { EventEmitter } from 'events';
export class PointerUtils {
    events = new EventEmitter();
    downTs;
    upTs;
    longPressDownTo;
    ignoredEls = [];
    isHooked = false;
    pageCoords;
    isPressed = false;
    isLongPress = false;
    isTouch = false;
    downPrevent = false;
    clickPrevent = false;
    doublePrevent = false;
    upPrevent = false;
    enterPrevent = false;
    leavePrevent = false;
    MovePrevent = false;
    CancelPrevent = false;
    outPrevent = false;
    overPrevent = false;
    lockChangePrevent = false;
    lockErrorPrevent = false;
    contextMenuPrevent = false;
    doubleClickTime = 250;
    longPressTime = 500;
    previousCoords = { x: 0, y: 0 };
    moveThreshold = 5;
    longPressOnUp = false;
    set ignore(el) {
        if (typeof el === 'string') {
            this.ignoredEls = [document.querySelector(el)];
        }
        else if (el instanceof HTMLElement) {
            this.ignoredEls = [el];
        }
        else if (Array.isArray(el)) {
            this.ignoredEls = el;
        }
        this.ignoredEls.forEach(el => {
            const children = el.querySelectorAll('*');
            for (let i = 0; i < children.length; i++) {
                this.ignoredEls.push(children[i]);
            }
        });
    }
    downCb = () => null;
    clickCb = () => null;
    doubleClickCb = () => null;
    longPressCb = () => null;
    upCb = () => null;
    enterCb = () => null;
    leaveCb = () => null;
    moveCb = () => null;
    cancelCb = () => null;
    outCb = () => null;
    overCb = () => null;
    lockChangeCb = () => null;
    lockErrorCb = () => null;
    contextMenuCb = () => null;
    downEl;
    clickEl;
    doubleClickEl;
    longPressEl;
    upEl;
    enterEl;
    leaveEl;
    moveEl;
    cancelEl;
    outEl;
    overEl;
    lockChangeEl;
    lockErrorEl;
    contextMenuEl;
    get currentElement() {
        return document.elementFromPoint(this.pageCoords.x, this.pageCoords.y);
    }
    get currentPath() {
        const path = [];
        let el = this.currentElement;
        while (el) {
            path.push(el);
            el = el.parentElement;
        }
        return path;
    }
    hook() {
        if (this.isHooked)
            return;
        this.isHooked = true;
        document.documentElement.addEventListener('pointerdown', this.pointerDownFn.bind(this), false);
        document.documentElement.addEventListener('pointerup', this.pointerUpFn.bind(this), false);
        document.documentElement.addEventListener('pointerenter', this.pointerEnterFn.bind(this), false);
        document.documentElement.addEventListener('pointerleave', this.pointerLeaveFn.bind(this), false);
        document.documentElement.addEventListener('pointermove', this.pointerMoveFn.bind(this), false);
        document.documentElement.addEventListener('pointercancel', this.pointerCancelFn.bind(this), false);
        document.documentElement.addEventListener('pointerout', this.pointerOutFn.bind(this), false);
        document.documentElement.addEventListener('pointerover', this.pointerOverFn.bind(this), false);
        document.documentElement.addEventListener('pointerlockchange', this.pointerLockChangeFn.bind(this), false);
        document.documentElement.addEventListener('pointerlockerror', this.pointerLockErrorFn.bind(this), false);
        document.documentElement.addEventListener('contextmenu', this.pointerContextMenuFn.bind(this), false);
    }
    pointerDownFn(e) {
        if (this.downPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.isLongPress = false;
        const prevTs = this.downTs;
        this.downTs = Date.now();
        this.longPressDownTo = setTimeout(() => {
            if (this.isPressed) {
                if (this.longPressEl && this.longPressEl !== e.target)
                    return;
                this.isLongPress = true;
                this.longPressCb(e);
                this.events.emit('longPress', e);
            }
        }, this.longPressTime);
        if (this.downTs - prevTs < this.doubleClickTime) {
            if (this.doubleClickEl && this.doubleClickEl !== e.target)
                return;
            if (this.doublePrevent) {
                e.preventDefault();
            }
            this.events.emit('doubleClick', e);
            this.doubleClickCb(e);
        }
        if (this.downEl && this.downEl !== e.target)
            return;
        this.isPressed = true;
        this.events.emit('pointerdown', e);
        this.downCb(e);
        return Promise.resolve(e);
    }
    pointerUpFn(e) {
        if (this.upPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        this.pageCoords = { x: e.pageX, y: e.pageY };
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        this.longPressDownTo && clearTimeout(this.longPressDownTo);
        this.longPressDownTo = null;
        this.upTs = Date.now();
        this.isPressed = false;
        if (e.pointerType === 'touch') {
            this.isTouch = true;
            if (this.upTs - this.downTs > 500) {
                if (this.contextMenuPrevent)
                    e.preventDefault();
            }
        }
        else {
            document.documentElement.releasePointerCapture(e.pointerId);
        }
        if (this.longPressOnUp && !this.isLongPress && this.upTs - this.downTs > this.longPressTime) {
            if (this.longPressEl && this.longPressEl !== e.target)
                return;
            this.longPressCb(e);
            this.events.emit('longPress', e);
        }
        if (this.upEl && this.upEl !== e.target)
            return;
        this.events.emit('pointerup', e);
        this.upCb(e);
        return Promise.resolve(e);
    }
    pointerEnterFn(e) {
        if (this.enterEl && this.enterEl !== e.target)
            return;
        if (this.enterPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('pointerenter', e);
        this.enterCb(e);
        return Promise.resolve(e);
    }
    pointerLeaveFn(e) {
        if (this.leaveEl && this.leaveEl !== e.target)
            return;
        if (this.leavePrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('pointerleave', e);
        this.leaveCb(e);
        return Promise.resolve(e);
    }
    pointerMoveFn(e) {
        if (this.moveEl && this.moveEl !== e.target)
            return;
        if (this.MovePrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        this.pageCoords = { x: e.pageX, y: e.pageY };
        if (!this.isLongPress && PointerUtils.getDistance(this.previousCoords, this.pageCoords) > this.moveThreshold) {
            clearTimeout(this.longPressDownTo);
            this.longPressDownTo = null;
            this.isLongPress = false;
        }
        document.documentElement.releasePointerCapture(e.pointerId);
        this.events.emit('pointermove', e);
        this.moveCb(e);
        return Promise.resolve(e);
    }
    pointerCancelFn(e) {
        if (this.cancelEl && this.cancelEl !== e.target)
            return;
        if (this.CancelPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('pointercancel', e);
        this.cancelCb(e);
        return Promise.resolve(e);
    }
    pointerOutFn(e) {
        if (this.outEl && this.outEl !== e.target)
            return;
        if (this.outPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('pointerout', e);
        this.outCb(e);
        return Promise.resolve(e);
    }
    pointerOverFn(e) {
        if (this.overEl && this.overEl !== e.target)
            return;
        if (this.overPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('pointerover', e);
        this.overCb(e);
        return Promise.resolve(e);
    }
    pointerLockChangeFn(e) {
        if (this.lockChangeEl && this.lockChangeEl !== e.target)
            return;
        if (this.lockChangePrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('pointerlockchange', e);
        this.lockChangeCb(e);
        return Promise.resolve(e);
    }
    pointerLockErrorFn(e) {
        if (this.lockErrorEl && this.lockErrorEl !== e.target)
            return;
        if (this.lockErrorPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        document.documentElement.releasePointerCapture(e.pointerId);
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('pointerlockerror', e);
        this.lockErrorCb(e);
        return Promise.resolve(e);
    }
    pointerContextMenuFn(e) {
        if (this.contextMenuEl && this.contextMenuEl !== e.target)
            return;
        if (this.contextMenuPrevent) {
            e.preventDefault();
        }
        if (this.ignoredEls.includes(e.target))
            return;
        e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
        if (e.pointerType != "touch") {
            document.documentElement.releasePointerCapture(e.pointerId);
        }
        this.pageCoords = { x: e.pageX, y: e.pageY };
        this.events.emit('contextmenu', e);
        this.contextMenuCb(e);
        return Promise.resolve(e);
    }
    destroy() {
        this.isHooked = false;
        document.documentElement.removeEventListener('pointerdown', this.pointerDownFn.bind(this), false);
        document.documentElement.removeEventListener('pointerup', this.pointerUpFn.bind(this), false);
        document.documentElement.removeEventListener('pointerenter', this.pointerEnterFn.bind(this), false);
        document.documentElement.removeEventListener('pointerleave', this.pointerLeaveFn.bind(this), false);
        document.documentElement.removeEventListener('pointermove', this.pointerMoveFn.bind(this), false);
        document.documentElement.removeEventListener('pointercancel', this.pointerCancelFn.bind(this), false);
        document.documentElement.removeEventListener('pointerout', this.pointerOutFn.bind(this), false);
        document.documentElement.removeEventListener('pointerover', this.pointerOverFn.bind(this), false);
        document.documentElement.removeEventListener('pointerlockchange', this.pointerLockChangeFn.bind(this), false);
        document.documentElement.removeEventListener('pointerlockerror', this.pointerLockErrorFn.bind(this), false);
        document.documentElement.removeEventListener('contextmenu', this.pointerContextMenuFn.bind(this), false);
    }
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    static getDistance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    static getAngle(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }
    static getAngleDeg(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    }
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    static map(value, min, max, newMin, newMax) {
        return newMin + (newMax - newMin) * (value - min) / (max - min);
    }
    static click(x, y) {
        const evt = new MouseEvent('click', {
            clientX: x,
            clientY: y
        });
        (document.elementFromPoint(x, y)).dispatchEvent(evt);
        return evt;
    }
    static mousedown(x, y) {
        const evt = new MouseEvent('mousedown', {
            clientX: x,
            clientY: y
        });
        (document.elementFromPoint(x, y)).dispatchEvent(evt);
        return evt;
    }
    static mouseup(x, y) {
        const evt = new MouseEvent('mouseup', {
            clientX: x,
            clientY: y
        });
        (document.elementFromPoint(x, y)).dispatchEvent(evt);
        return evt;
    }
    static mousemove(x, y) {
        const evt = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y
        });
        (document.elementFromPoint(x, y)).dispatchEvent(evt);
        return evt;
    }
    static mousewheel(x, y, delta) {
        const evt = new WheelEvent('wheel', {
            clientX: x,
            clientY: y,
            deltaY: delta
        });
        (document.elementFromPoint(x, y)).dispatchEvent(evt);
        return evt;
    }
    static changeEventCoords(e, pos) {
        const evt = new PointerEvent(e.type, {
            ...e,
            clientX: pos.x,
            clientY: pos.y,
            screenX: pos.x,
            screenY: pos.y
        });
        return Promise.resolve(evt);
    }
    static isScrollable(el) {
        const hasScrollableContent = el.scrollHeight > el.clientHeight;
        const overflowYStyle = window.getComputedStyle(el).overflowY;
        const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;
        return hasScrollableContent && !isOverflowHidden;
    }
    static getScrollableParent(el) {
        return !el || el === document.body
            ? document.body
            : PointerUtils.isScrollable(el)
                ? el
                : PointerUtils.getScrollableParent(el.parentElement);
    }
}
export default PointerUtils;
