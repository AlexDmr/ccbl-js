import { CCBLEmitter } from "./Emitter";
import { registerUnserializer } from "./Serialiser";
let emiterId = 0;
const typeJSON = "CCBLEmitterValue";
export class CCBLEmitterValue extends CCBLEmitter {
    constructor(value, config = { constant: false }) {
        super();
        this.value = value;
        this.emitterAvailability = new CCBLEmitter();
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
export function initEmitterValue() {
    registerUnserializer(typeJSON, ((json, env) => {
        let { id: id, initialValue: v, constant: c } = json;
        let res = env.get_CCBLEmitterValue_FromId(id);
        if (!res) {
            res = new CCBLEmitterValue(v, { constant: c });
        }
        return res;
    }));
}
//# sourceMappingURL=EmitterValue.js.map