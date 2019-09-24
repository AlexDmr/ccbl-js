"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmitterValue_1 = require("./EmitterValue");
class CCBLAbstractClock extends EmitterValue_1.CCBLEmitterValue {
    constructor() {
        super(undefined);
        this.timesForUpdate = [];
        this.endEmitter = new EmitterValue_1.CCBLEmitterValue(undefined);
    }
    now() {
        return undefined;
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
        this.timesForUpdate.push(ms);
        this.timesForUpdate.sort((a, b) => a - b);
        return this;
    }
}
exports.CCBLAbstractClock = CCBLAbstractClock;
class CCBLSystemClock extends CCBLAbstractClock {
    now() {
        return Date.now();
    }
}
exports.CCBLSystemClock = CCBLSystemClock;
class CCBLTestClock extends CCBLAbstractClock {
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
        }
        return this;
    }
}
exports.CCBLTestClock = CCBLTestClock;
//# sourceMappingURL=Clock.js.map