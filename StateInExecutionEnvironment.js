"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmitterValue_1 = require("./EmitterValue");
const Emitter_1 = require("./Emitter");
const Event_1 = require("./Event");
const Serialiser_1 = require("./Serialiser");
const CCBLExpressionInExecutionEnvironment_1 = require("./CCBLExpressionInExecutionEnvironment");
class CCBLEventStateInExecutionEnvironment extends Event_1.CCBLEvent {
    constructor(state, prefix, env) {
        super({ eventName: `${prefix} ${state.getName()}`, env });
        this.state = state;
    }
}
exports.CCBLEventStateInExecutionEnvironment = CCBLEventStateInExecutionEnvironment;
const typeJSON = "CCBLStateInExecutionEnvironment";
class CCBLStateInExecutionEnvironment extends CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment {
    constructor(config) {
        super(config);
        this.jsonDirty = new EmitterValue_1.CCBLEmitterValue(true);
        this.active = false;
        this.emitterNewState = new Emitter_1.CCBLEmitter();
        this.stateName = config.stateName;
        this.startEvent = new CCBLEventStateInExecutionEnvironment(this, `starting`, this.env);
        this.stopEvent = new CCBLEventStateInExecutionEnvironment(this, `stoping`, this.env);
        const cb = newActive => {
            if (this.active !== !!newActive) {
                this.active = !!newActive;
                this.emitterNewState.emit({
                    value: this.active,
                    source: this,
                    ms: this.env.get_Clock().now(),
                    name: this.stateName
                });
                if (newActive) {
                    this.startEvent.trigger({ value: true });
                }
                else {
                    this.stopEvent.trigger({ value: false });
                }
            }
        };
        cb(super.get());
        super.on(cb);
    }
    isEvaluatedTrue() {
        return this.isListening() && this.active;
    }
    getName() {
        return this.stateName;
    }
    toJSON() {
        if (this.jsonDirty.get()) {
            this.jsonDirty.set(false);
            return this.lastJSON = Object.assign({}, super.toJSON(), { type: typeJSON, stateName: this.stateName, isActive: this.active, expression: this.getExpression() });
        }
        else {
            return this.lastJSON;
        }
    }
    onChange(cb) {
        this.emitterNewState.on(cb);
        return this;
    }
    offChange(cb) {
        this.emitterNewState.off(cb);
        return this;
    }
}
exports.CCBLStateInExecutionEnvironment = CCBLStateInExecutionEnvironment;
Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
    let { stateName, expression } = json;
    return new CCBLStateInExecutionEnvironment({
        stateName,
        env,
        expression
    });
});
//# sourceMappingURL=StateInExecutionEnvironment.js.map