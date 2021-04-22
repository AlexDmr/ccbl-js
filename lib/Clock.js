import { CCBLEmitterValue } from "./EmitterValue";
export class CCBLAbstractClock extends CCBLEmitterValue {
    constructor() {
        super(undefined);
        this.timesForUpdate = [];
        this.endEmitter = new CCBLEmitterValue(undefined);
    }
    emitChange(ms) {
        this.emit(ms);
        this.endEmitter.emit(ms);
        return this;
    }
    onChange(cb, end = false) {
        if (end) {
            this.endEmitter.on(cb);
        }
        else {
            this.on(cb);
        }
        return this;
    }
    offChange(cb) {
        this.endEmitter.off(cb);
        return this.off(cb);
    }
    registerTimeForUpdate(ms) {
        if (isNaN(ms)) {
            throw 'registerTimeForUpdate cannot be called with NaN';
        }
        this.timesForUpdate.push(ms);
        this.timesForUpdate.sort((a, b) => a - b);
        return this;
    }
    unregisterTimeForUpdate(ms) {
        const pos = this.timesForUpdate.indexOf(ms);
        if (pos >= 0) {
            this.timesForUpdate.splice(pos, 1);
        }
        return this;
    }
    getTimesForUpdate() {
        return this.timesForUpdate.slice();
    }
    get nextForeseenUpdate() {
        return this.timesForUpdate[0];
    }
}
export class CCBLSystemClock extends CCBLAbstractClock {
    now() {
        return Date.now();
    }
}
export class CCBLTestClock extends CCBLAbstractClock {
    constructor() {
        super(...arguments);
        this.ms = 0;
    }
    now() {
        return this.ms;
    }
    forward(ms = 1) {
        return this.goto(this.ms + ms);
    }
    goto(ms) {
        this.registerTimeForUpdate(ms);
        while (this.timesForUpdate.length && this.timesForUpdate[0] <= ms) {
            const t = this.timesForUpdate.shift();
            this.ms = t;
            this.emitChange(t);
            super.set(ms);
        }
        return this;
    }
    set(ms) {
        return this.goto(ms);
    }
}
//# sourceMappingURL=Clock.js.map