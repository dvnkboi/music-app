import { EventEmitter } from 'events';
import Link from './link';
import PointerUtils from './pointerUtils';
export class Draggable {
    //
    //
    //
    //! private properties
    //
    //
    //
    static draggables = new Map();
    parent;
    element;
    id;
    elementPosition;
    elementSelect;
    isPoint = false;
    eventType;
    handle;
    eventTarget;
    mPose = { y: 0, x: 0 };
    elementPos = { y: 0, x: 0 };
    mousePressed;
    boundingBox;
    offsetCoords = { top: 0, left: 0 };
    pageCoords = { x: 0, y: 0 };
    animationFrame;
    lastUpdatedTs;
    mouseDownTs;
    mouseUpTs;
    dragging;
    dragAllowed;
    options;
    scroll = { x: 0, y: 0 };
    initialScroll = {
        x: 0,
        y: 0
    };
    iterations = 0;
    waitTimeout;
    events = new EventEmitter();
    previousClasses = [];
    get calcPos() {
        return {
            x: this.round(Math.max(-this.initialOffset.x - this.initialScroll.x, Math.min(this.options.maxX - this.boundingBox.width, this.mPose.x - this.initialOffset.x + this.offsetCoords.left)), this.options.grid),
            y: this.round(Math.max(-this.initialOffset.y - this.initialScroll.y, Math.min(this.options.maxY - this.boundingBox.height, this.mPose.y - this.initialOffset.y + this.offsetCoords.top)), this.options.grid)
        };
    }
    attached = new Map();
    debugBoxEl;
    lastUpdate = 0;
    dropElements;
    initialized = false;
    links;
    disabled;
    mutationObserver;
    //
    //
    //
    //! Public getters
    //
    //
    //
    get isTouch() {
        return this.eventType === 'touchstart' || this.eventType === 'touchmove' || this.eventType === 'touchend';
    }
    get posError() {
        return {
            x: Math.abs(this.elementPos.x + this.initialOffset.x - this.mPose.x - this.offsetCoords.left),
            y: Math.abs(this.elementPos.y + this.initialOffset.y - this.mPose.y - this.offsetCoords.top)
        };
    }
    get interactionPos() {
        return this.mPose;
    }
    get transformCoords() {
        return {
            x: this.round(this.elementPos.x, this.options.grid),
            y: this.round(this.elementPos.y, this.options.grid)
        };
    }
    get boundaries() {
        return this.boundingBox;
    }
    get relativeOffset() {
        return {
            x: this.round(this.offsetCoords.left, this.options.grid),
            y: this.round(this.offsetCoords.top, this.options.grid)
        };
    }
    initialOffset = { x: 0, y: 0 };
    get elementCoords() {
        return {
            x: this.initialOffset.x + this.transformCoords.x + this.initialScroll.x,
            y: this.initialOffset.y + this.transformCoords.y + this.initialScroll.y
        };
    }
    get nonCorrectedPos() {
        return {
            x: this.round(this.mPose.x + this.initialOffset.x, this.options.grid),
            y: this.round(this.mPose.y + this.initialOffset.y, this.options.grid)
        };
    }
    get getElement() {
        return this.element;
    }
    //
    //
    //
    //! Constructor
    //
    //
    //
    constructor(element, options = {}) {
        this.options = {
            maxX: Infinity,
            maxY: Infinity,
            ease: true,
            holdTime: 10,
            maxIterations: 100,
            easeTime: 0.05,
            handle: null,
            grid: 1,
            frameRate: 120,
            dropEl: null,
            initialCoords: { x: -1, y: -1 },
            id: Date.now().toString(),
            ...options
        };
        this.element = element instanceof HTMLElement ? element : document.querySelector(element);
        this.element['__taptap'] = this;
        this.id = this.options.id;
        this.parent = PointerUtils.getScrollableParent(this.element);
        this.links = new Map();
        Draggable.draggables.set(this.id, this);
        this.initialScroll = {
            x: this.parent.scrollLeft,
            y: this.parent.scrollTop
        };
        if (this.options.dropEl instanceof Array && this.options.dropEl.every(el => el instanceof HTMLElement)) {
            this.dropElements = this.options.dropEl;
        }
        else if (this.options.dropEl instanceof HTMLElement) {
            this.dropElements = [this.options.dropEl];
        }
        else if (this.options.dropEl instanceof String) {
            this.dropElements = Array.from(document.querySelectorAll(this.options.dropEl));
        }
        this.getInitialDimentions()
            .then(this.initDoc.bind(this))
            .then(this.calculateoffsetCoords.bind(this))
            .then(this.getPos.bind(this))
            .then(this.setPos.bind(this))
            .then(this.initElement.bind(this))
            .then(this.hookEvents.bind(this))
            .then(this.hookDropEl.bind(this))
            .then(this.options.disabled ? this.disable.bind(this) : this.enable.bind(this))
            .then(this.hookMutationObserver.bind(this))
            .then(() => this.initialized = true)
            .then(this.emit.bind(this, 'initialized', this));
    }
    //
    //
    //
    //! Private methods
    //
    //
    //
    process(event) {
        return new Promise((resolve) => {
            if (Date.now() - this.lastUpdate > 1000 / this.options.frameRate) {
                this.lastUpdate = Date.now();
                if (this.options.ease) {
                    this.ease(event);
                }
                else {
                    this.setPos(event);
                }
                resolve(this);
            }
        });
    }
    initDoc() {
        return new Promise((resolve) => {
            this.pageCoords = {
                x: this.options.initialCoords.x,
                y: this.options.initialCoords.y
            };
            const mouseUpdateFn = (event) => {
                this.pageCoords = {
                    x: event.pageX,
                    y: event.pageY
                };
            };
            const touchUpdateFn = (event) => {
                this.pageCoords = {
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY
                };
            };
            document.addEventListener('mousemove', mouseUpdateFn.bind(this), { capture: false, passive: false });
            document.addEventListener('mouseenter', mouseUpdateFn.bind(this), { capture: false, passive: false });
            document.addEventListener('touchmove', touchUpdateFn.bind(this), { capture: false, passive: false });
            document.addEventListener('touchstart', touchUpdateFn.bind(this), { capture: false, passive: false });
            resolve(this);
        });
    }
    calculateMirrorDimensions() {
        return new Promise((resolve) => {
            const bounding = this.element.getBoundingClientRect();
            this.scroll = {
                x: this.parent.scrollLeft,
                y: this.parent.scrollTop
            };
            this.boundingBox = bounding;
            resolve(this);
        });
    }
    getInitialDimentions() {
        return new Promise((resolve) => {
            const display = window.getComputedStyle(this.element).display;
            this.element.style.display = 'block';
            const bounding = this.element.getBoundingClientRect();
            this.element.style.display = display;
            this.boundingBox = {
                x: bounding.x,
                y: bounding.y,
                width: bounding.width,
                height: bounding.height,
                left: bounding.left + this.initialScroll.x,
                right: bounding.right,
                top: bounding.top + this.initialScroll.y,
                bottom: bounding.bottom
            };
            this.initialOffset = {
                x: bounding.x,
                y: bounding.y
            };
            resolve(this);
        });
    }
    hookEvents() {
        return new Promise((resolve) => {
            if (!this.options.handle)
                this.handle = this.element;
            else
                this.handle = this.element.querySelector(this.options.handle);
            this.handle.addEventListener('mousedown', this.drag.bind(this), { capture: false, passive: false });
            this.handle.addEventListener('touchstart', this.drag.bind(this), { capture: false, passive: false });
            this.handle.addEventListener('touchmove', this.drag.bind(this), { capture: false, passive: false });
            this.handle.addEventListener('mousemove', this.drag.bind(this), { capture: false, passive: false });
            this.handle.addEventListener('mouseup', this.drag.bind(this), { capture: false, passive: false });
            this.element.addEventListener('mouseup', this.drag.bind(this), { capture: false, passive: false });
            this.handle.addEventListener('touchend', this.drag.bind(this), { capture: false, passive: false });
            this.element.addEventListener('mouseover', this.drag.bind(this), { capture: false, passive: false });
            resolve(this);
        });
    }
    calculateoffsetCoords(event) {
        return new Promise(async (resolve) => {
            await this.calculateMirrorDimensions();
            this.offsetCoords.left = this.boundingBox.left + (this.scroll.x - this.initialScroll.x) - this.mPose.x;
            this.offsetCoords.top = this.boundingBox.top + (this.scroll.y - this.initialScroll.y) - this.mPose.y;
            resolve(this);
        });
    }
    updateCycle(event) {
        const error = this.posError;
        if (!this.mousePressed && error.x <= this.options.grid && error.y <= this.options.grid || this.iterations > this.options.maxIterations) {
            this.emit('end', this);
            cancelAnimationFrame(this.animationFrame);
        }
        else {
            this.process(event)
                .then(this.draw.bind(this))
                .then(this.iterate.bind(this))
                .then(this.emit.bind(this, 'moving', this));
            this.animationFrame = requestAnimationFrame(this.updateCycle.bind(this));
        }
    }
    draw() {
        return new Promise((resolve) => {
            this.element.style.transform = `translate3d(${this.elementPos.x}px, ${this.elementPos.y}px, 0)`;
            this.lastUpdatedTs = Date.now();
            resolve(this);
        });
    }
    hookDropEl() {
        return new Promise((resolve) => {
            this.dropElements?.forEach((el) => {
                console.log('added drop');
            });
            resolve(this);
        });
    }
    initElement() {
        return new Promise((resolve) => {
            if (!this.elementPosition)
                this.elementPosition = getComputedStyle(this.element).position;
            this.element.style.position = 'absolute';
            if (this.elementPosition == 'absolute' || this.elementPosition == 'fixed') {
                // this.element.style.top = `0px`;
                // this.element.style.left = `0px`;
            }
            else {
                this.element.style.left = `${this.elementCoords.x}px`;
                this.element.style.top = `${this.elementCoords.y}px`;
            }
            this.element.style.transform = `translate3d(${this.transformCoords.x}px, ${this.transformCoords.y}px, 0)`;
            this.element.classList.add('taptap-elmnt');
            resolve(this);
        });
    }
    //
    //
    //
    //? utility and state management
    //
    //
    //
    ease(event) {
        return new Promise((resolve) => {
            const pos = this.calcPos;
            this.elementPos.x = this.lerp(this.elementPos.x, pos.x, this.options.easeTime);
            this.elementPos.y = this.lerp(this.elementPos.y, pos.y, this.options.easeTime);
            resolve(this);
        });
    }
    setPos(event) {
        return new Promise((resolve) => {
            const pos = this.calcPos;
            this.elementPos = { x: pos.x, y: pos.y };
            resolve(this);
        });
    }
    getPos(event) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.mPose.x = this.pageCoords.x;
                this.mPose.y = this.pageCoords.y;
                resolve(this);
            });
        });
    }
    lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }
    resetIterations() {
        return new Promise((resolve) => {
            this.iterations = 0;
            resolve(this);
        });
    }
    iterate() {
        return new Promise((resolve) => {
            if (!this.mousePressed)
                this.iterations++;
            resolve(this);
        });
    }
    wait(ms) {
        return new Promise((resolve) => {
            this.waitTimeout = setTimeout(() => {
                resolve(this);
            }, ms);
        });
    }
    allowDrag() {
        return new Promise((resolve) => {
            this.dragAllowed = true;
            resolve(this);
        });
    }
    disallowDrag() {
        return new Promise((resolve) => {
            clearTimeout(this.waitTimeout);
            this.dragAllowed = false;
            resolve(this);
        });
    }
    cycleClass(classes) {
        return new Promise((resolve) => {
            const classList = Array.isArray(classes) ? classes : [classes];
            this.element.classList.remove(...this.previousClasses);
            this.previousClasses = classList;
            this.element.classList.add(...classList);
            resolve(this);
        });
    }
    hookDocumentEvents(event) {
        return new Promise((resolve) => {
            document.onmouseup = document.ontouchend = () => {
                this.evtUp(event);
            };
            document.onmousemove = document.ontouchmove = () => {
                this.evtDragging(event);
            };
            resolve(this);
        });
    }
    unhookDocumentEvents() {
        return new Promise((resolve) => {
            document.onmouseup = null;
            document.onmousemove = null;
            resolve(this);
        });
    }
    async childAdded(mutations) {
        mutations.forEach(async (mutation) => {
            if (mutation.type == 'childList') {
                await this.calculateMirrorDimensions()
                    .then(this.resetIterations.bind(this))
                    .then(this.updateCycle.bind(this))
                    .then(this.updateLinkPositions.bind(this));
            }
        });
    }
    hookMutationObserver() {
        return new Promise((resolve) => {
            this.mutationObserver = new MutationObserver(async (mutations) => {
                await this.childAdded(mutations);
                console.log('mutation');
            });
            this.mutationObserver.observe(this.element, { childList: true, subtree: true });
            resolve(this);
        });
    }
    //
    //
    //
    //? link methods
    //
    //
    //
    receiveLink(sender, link) {
        return new Promise((resolve) => {
            const id = this.generateLinkId(sender);
            if (this.links.has(id))
                resolve(this);
            else {
                this.links.set(id, { link, index: this.links.size });
                this.attached.set(sender.id, sender);
                this.emit('linked', sender).then(resolve.bind(this, sender));
                this.updateLinkPositions();
            }
        });
    }
    attachTo(elmt, options = {}) {
        return new Promise(async (resolve) => {
            const id = this.generateLinkId(elmt);
            if (this.links.has(id) || elmt.links.has(id)) {
                resolve(elmt);
            }
            else {
                const link = new Link(options);
                this.links.set(id, { link, index: this.links.size });
                link.attachStart(this);
                link.attachEnd(elmt);
                elmt.receiveLink(this, link);
                this.attached.set(elmt.id, elmt);
                this.emit('linked', elmt).then(resolve.bind(this, elmt));
                this.updateLinkPositions();
            }
        });
    }
    generateLinkId(elmt) {
        const id = elmt instanceof Draggable ? elmt.id : elmt;
        if (typeof this.id == 'string' && typeof id == 'string')
            return id > this.id ? this.id + '-' + id : id + '-' + this.id;
        return id > this.id ? this.id + '-' + id : id + '-' + this.id;
    }
    updateLinkPositions() {
        this.links.forEach(async (linkMap) => {
            linkMap.link.forceUpdate = true;
            await linkMap.link.update();
            linkMap.link.forceUpdate = false;
        });
    }
    detachFrom(elmt) {
        return new Promise((resolve) => {
            const id = this.generateLinkId(elmt);
            if (this.links.has(id)) {
                const link = this.links.get(id).link;
                link.detach();
                this.links.delete(id);
                this.attached.delete(elmt.id);
                this.emit('unlinked', elmt).then(resolve.bind(this, elmt));
                this.updateLinkPositions();
            }
            else
                resolve(this);
        });
    }
    //
    //
    //
    //? event handlers
    //
    //
    //
    release() {
        this.evtUp(null);
    }
    emit(event, ...args) {
        return new Promise((resolve) => {
            this.events.emit(event, ...args);
            resolve(this);
        });
    }
    evtDown(event) {
        this.mousePressed = true;
        this.elementSelect = this.element.style.userSelect;
        this.element.style.userSelect = 'none';
        this.mouseDownTs = Date.now();
        this.hookDocumentEvents(event)
            .then(this.cycleClass.bind(this, 'taptap-hold'))
            .then(this.emit.bind(this, 'hold', this))
            .then(this.resetIterations.bind(this))
            .then(this.updateCycle.bind(this))
            .then(this.getPos.bind(this))
            .then(this.calculateoffsetCoords.bind(this))
            .then(this.wait.bind(this, this.options.holdTime))
            .then(this.allowDrag.bind(this))
            .then(this.getPos.bind(this))
            .then(this.cycleClass.bind(this, 'taptap-down'))
            .then(this.emit.bind(this, 'down', this));
    }
    evtDragging(event) {
        if (!this.dragAllowed)
            return;
        this.getPos(event);
        if (!this.dragging) {
            this.dragging = true;
            this.cycleClass('taptap-dragging')
                .then(this.emit.bind(this, 'dragging', this));
        }
    }
    evtUp(event) {
        this.dragging = false;
        this.mousePressed = false;
        document.onmouseup = null;
        document.onmousemove = null;
        this.unhookDocumentEvents()
            .then(this.disallowDrag.bind(this))
            .then(this.cycleClass.bind(this, 'taptap-up'))
            .then(this.emit.bind(this, 'up', this));
        this.once('end', () => {
            this.getPos(event)
                .then(this.calculateoffsetCoords.bind(this));
        });
        this.element.style.userSelect = this.elementSelect;
    }
    drag(event) {
        if (this.disabled)
            return;
        event.preventDefault();
        this.eventTarget = event.target;
        this.eventType = event.type;
        // start drag
        if (!this.mousePressed && (this.eventType == 'mousedown' || this.eventType == 'touchstart')) {
            this.evtDown(event);
        }
        // drag
        if (this.mousePressed && (this.eventType == 'mousemove' || this.eventType == 'touchmove')) {
            this.evtDragging(event);
        }
        // stop drag
        if (this.mousePressed && (this.eventType == 'mouseup' || this.eventType == 'touchend')) {
            this.evtUp(event);
        }
        if ((this.eventType == 'mouseover' || this.eventType == 'touchover')) {
        }
    }
    //
    //}
    //
    //!public methods
    //
    //
    //
    disable() {
        return new Promise((resolve) => {
            this.disabled = true;
            resolve(this);
        });
    }
    enable() {
        return new Promise((resolve) => {
            this.disabled = false;
            resolve(this);
        });
    }
    on(event, callback) {
        this.events.on(event, callback);
    }
    off(event, callback) {
        this.events.off(event, callback);
    }
    once(event, callback) {
        this.events.on(event, callback);
    }
    resetPosition() {
        return new Promise((resolve) => {
            this.element.style.position = this.elementPosition;
            resolve(this);
        });
    }
    round(x, n) {
        return Math.round((x + Number.EPSILON) / n) * n;
    }
    moveTo(x, y, easing = this.options.easeTime, noMaxIterations = false) {
        return new Promise((resolve) => {
            const ease = this.options.easeTime;
            const maxIterations = this.options.maxIterations;
            this.once('end', () => {
                resolve(this);
                this.options.easeTime = ease;
                this.options.maxIterations = maxIterations;
            });
            this.options.easeTime = easing;
            this.options.maxIterations = noMaxIterations && maxIterations < 250 ? 250 : maxIterations;
            this.mPose = {
                x: x,
                y: y
            };
            this.updateCycle(null);
        });
    }
    //get draggable from cursor position
    static getDraggableFromPoint(pos) {
        return new Promise((resolve) => {
            let elmt = document.elementFromPoint(pos.x, pos.y);
            while (elmt && !elmt.classList.contains('taptap-elmnt')) {
                elmt = elmt.parentElement;
            }
            resolve(elmt?.['__taptap']);
        });
    }
    static spawnPoint(pos, options = {}) {
        return new Promise(async (resolve) => {
            const el = document.createElement('div');
            el.style.width = '0px';
            el.style.height = '0px';
            el.style.position = 'absolute';
            el.style.left = '0px';
            el.style.top = '0px';
            document.body.appendChild(el);
            const draggable = new Draggable(el, {
                ...options,
                initialCoords: pos
            });
            draggable.isPoint = true;
            draggable.once('initialized', async () => {
                resolve(draggable);
            });
        });
    }
    static spawnActivePoint(pos, options = {}) {
        return new Promise(async (resolve) => {
            const el = document.createElement('div');
            el.style.width = '0px';
            el.style.height = '0px';
            el.style.position = 'absolute';
            el.style.left = '0px';
            el.style.top = '0px';
            document.body.appendChild(el);
            const draggable = new Draggable(el, {
                ...options,
                initialCoords: pos
            });
            draggable.isPoint = true;
            draggable.once('initialized', async () => {
                draggable.evtDown(PointerUtils.mousedown(pos.x, pos.y));
                resolve(draggable);
            });
            const handler = (event) => {
                draggable.evtUp(event);
                document.removeEventListener('mousedown', handler);
            };
            document.addEventListener('mousedown', handler, { passive: false });
        });
    }
    //
    //
    //
    //! desctructor
    //
    //
    //
    destroy() {
        for (const linkObj of this.links.values()) {
            linkObj.link?.destroy();
        }
        this.events.removeAllListeners('down');
        this.events.removeAllListeners('dragging');
        this.events.removeAllListeners('up');
        this.events.removeAllListeners('moving');
        this.events.removeAllListeners('hold');
        Draggable.draggables.delete(this.id);
        if (this.isPoint)
            this.element.remove();
        this.emit('destroy');
    }
    //
    //
    //
    //! debug methods
    //
    //
    //
    debugBox() {
        return new Promise((resolve) => {
            if (this.debugBoxEl)
                document.body.removeChild(this.debugBoxEl);
            this.debugBoxEl = document.createElement('div');
            this.debugBoxEl.style.position = 'absolute';
            this.debugBoxEl.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            this.debugBoxEl.style.border = '1px solid red';
            this.debugBoxEl.style.zIndex = '99999';
            this.debugBoxEl.style.pointerEvents = 'none';
            this.debugBoxEl.style.height = '20px';
            this.debugBoxEl.style.width = '20px';
            this.debugBoxEl.style.top = '0';
            this.debugBoxEl.style.left = '0';
            document.body.appendChild(this.debugBoxEl);
            resolve(this);
        });
    }
    debugBoxMove(coords) {
        return new Promise((resolve) => {
            this.debugBoxEl.style.left = `${coords.x}px`;
            this.debugBoxEl.style.top = `${coords.y}px`;
            resolve(this);
        });
    }
}
export default Draggable;
