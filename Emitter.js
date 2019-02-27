"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CCBLEmitter {
    constructor() {
        this.cbs = [];
    }
    once(cb) {
        let cbOnce = (data) => {
            cb(data);
            this.off(cbOnce);
        };
        this.on(cbOnce);
        return this;
    }
    on(cb) {
        if (this.cbs.indexOf(cb) === -1) {
            this.cbs.push(cb);
        }
        return this;
    }
    off(cb) {
        this.cbs = this.cbs.filter(CB => CB !== cb);
        return this;
    }
    emit(evt) {
        this.cbs.slice().forEach(cb => cb(evt));
        return this;
    }
}
exports.CCBLEmitter = CCBLEmitter;
//# sourceMappingURL=Emitter.js.map