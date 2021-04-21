"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEmitterValue = exports.CCBLEmitterValue = void 0;
const Emitter_1 = require("./Emitter");
const Serialiser_1 = require("./Serialiser");
let emiterId = 0;
const typeJSON = "CCBLEmitterValue";
class CCBLEmitterValue extends Emitter_1.CCBLEmitter {
    constructor(value, config = { constant: false }) {
        super();
        this.value = value;
        this.emitterAvailability = new Emitter_1.CCBLEmitter();
        this.constant = false;
        this.available = true;
        this.constant = !!config.constant;
        if (!this.constant) {
            this.id = config.id ? config.id : `Chan ${emiterId++}`;
        }
    }
    dispose() {
        this.emitterAvailability.dispose();
        super.dispose();
    }
    toJSON() {
        return {
            available: this.isAvailable(),
            type: typeJSON,
            id: this.id,
            constant: this.constant,
            initialValue: this.value,
            value: this.get()
        };
    }
    isAvailable() {
        return this.available;
    }
    setIsAvailable(available) {
        if (this.available !== available) {
            this.available = available;
            this.emitterAvailability.emit(available);
        }
        return this;
    }
    onAvailabilityChange(cb) {
        this.emitterAvailability.on(cb);
        return this;
    }
    offAvailabilityChange(cb) {
        this.emitterAvailability.off(cb);
        return this;
    }
    get() {
        return this.value;
    }
    set(v) {
        if (v !== this.value) {
            this.emit(this.value = v);
        }
        return this;
    }
    get_Id() {
        return this.id;
    }
}
exports.CCBLEmitterValue = CCBLEmitterValue;
function initEmitterValue() {
    Serialiser_1.registerUnserializer(typeJSON, ((json, env) => {
        let { id: id, initialValue: v, constant: c } = json;
        let res = env.get_CCBLEmitterValue_FromId(id);
        if (!res) {
            res = new CCBLEmitterValue(v, { constant: c });
        }
        return res;
    }));
}
exports.initEmitterValue = initEmitterValue;
//# sourceMappingURL=EmitterValue.js.map