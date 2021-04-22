export class CCBLEmitter {
    constructor() {
        this.cbs = [];
    }
    dispose() {
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
//# sourceMappingURL=Emitter.js.map