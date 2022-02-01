import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLEmitter } from "./Emitter";
import { CCBLEvent } from "./Event";
import { registerUnserializer } from "./Serialiser";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
export class CCBLEventStateInExecutionEnvironment extends CCBLEvent {
    constructor(state, prefix, env) {
        super({ eventName: `${prefix} ${state.getName()}`, env });
        this.state = state;
    }
}
const typeJSON = "CCBLStateInExecutionEnvironment";
export class CCBLStateInExecutionEnvironment extends CCBLExpressionInExecutionEnvironment {
    constructor(config) {
        super(config);
        this.jsonDirty = new CCBLEmitterValue(true);
        this.active = false;
        this.emitterNewState = new CCBLEmitter();
        this.stateName = config.stateName;
        this.startEvent = new CCBLEventStateInExecutionEnvironment(this, `starting`, this.env);
        this.stopEvent = new CCBLEventStateInExecutionEnvironment(this, `stoping`, this.env);
        this.cbSuper = newActive => {
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
        this.cbSuper(super.get());
        super.on(this.cbSuper);
    }
    dispose() {
        this.startEvent.dispose();
        this.stopEvent.dispose();
        super.off(this.cbSuper);
        super.dispose();
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
            return this.lastJSON = {
                ...super.toJSON(),
                type: typeJSON,
                stateName: this.stateName,
                isActive: this.active,
                expression: this.getExpression() ?? ''
            };
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
export function initStateInExecutionEnvironment() {
    registerUnserializer(typeJSON, ((json, env) => {
        let { stateName, expression } = json;
        return new CCBLStateInExecutionEnvironment({
            stateName,
            env,
            expression
        });
    }));
}
//# sourceMappingURL=StateInExecutionEnvironment.js.map