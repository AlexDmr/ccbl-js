import { CCBLEmitter } from "./Emitter";
import { registerUnserializer } from "./Serialiser";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
const typeJSON = "CCBL_EventJSON";
export class CCBLEvent {
    constructor({ eventExpression, eventName, expressionFilter, env, eventerSourceId }) {
        this.jsonDirty = new CCBLEmitterValue(true);
        this.available = true;
        this.emitter = new CCBLEmitter();
        this.env = env;
        this.eventName = eventName;
        this.eventExpression = eventExpression;
        this.setGuardExpression(expressionFilter ?? "");
        if (eventerSourceId) {
            this.eventerSourceId = eventerSourceId;
            this.cbEventerSource = evt => this.trigger(evt);
            this.eventerSource = env.getCCBLEvent(eventerSourceId);
            if (this.eventerSource) {
                this.eventerSource.on(this.cbEventerSource);
            }
            else {
                throw `No EmitterValue identified by ${eventerSourceId} in the environment`;
            }
        }
        else {
            if (eventExpression) {
                this.ccblExpression = new CCBLExpressionInExecutionEnvironment({ env, expression: eventExpression });
                this.ccblExpression.setIsAvailable(true);
                this.ccblExpression.listen();
                this.cbExpression = value => !!value ? this.trigger({ value }) : undefined;
                this.ccblExpression.on(this.cbExpression);
            }
        }
    }
    dispose() {
        if (this.eventerSource && this.cbEventerSource) {
            this.eventerSource.off(this.cbEventerSource);
        }
        if (this.ccblExpression && this.cbExpression) {
            this.ccblExpression.off(this.cbExpression);
        }
        if (this.expreInEnv) {
            this.expreInEnv.dispose();
        }
        if (this.ccblExpression) {
            this.ccblExpression.dispose();
        }
        if (this.emitter) {
            this.emitter.dispose();
        }
    }
    toJSON() {
        if (this.jsonDirty.get()) {
            this.jsonDirty.set(false);
            this.lastJSON = {
                available: this.isAvailable(),
                type: typeJSON,
                eventExpression: this.eventExpression ?? "",
                eventName: this.eventName,
                expressionFilter: this.getGuardExpression(),
                eventerSourceId: this.eventerSourceId
            };
        }
        return this.lastJSON;
    }
    evalEventExpression() {
        return this.ccblExpression?.forceEvaluationOnce();
    }
    getEventExpression() {
        return this.eventExpression;
    }
    getEventerSourceId() {
        return this.eventerSourceId;
    }
    getEventName() {
        return this.eventName;
    }
    getGuardExpression() {
        return this.expreInEnv?.getExpression() ?? "";
    }
    setGuardExpression(expr) {
        if (expr) {
            if (this.expreInEnv) {
                this.expreInEnv.setExpression(expr, ["event"]);
            }
            else {
                this.expreInEnv = new CCBLExpressionInExecutionEnvironment({
                    env: this.env,
                    expression: expr,
                    addedScope: ["event"]
                });
            }
        }
        else {
            if (this.expreInEnv) {
                this.expreInEnv.dispose();
                this.expreInEnv = undefined;
            }
        }
        return this;
    }
    onJsonDirty(cb) {
        const actualCB = () => cb();
        this.jsonDirty.on(actualCB);
        return actualCB;
    }
    offJsonDirty(actualCB) {
        this.jsonDirty.off(actualCB);
    }
    isAvailable() {
        return this.available;
    }
    setIsAvailable(available) {
        if (available !== this.available) {
            this.available = available;
            this.jsonDirty.set(true);
        }
        return this;
    }
    on(cb) {
        this.emitter.on(cb);
        return this;
    }
    off(cb) {
        this.emitter.off(cb);
        return this;
    }
    trigger(evt) {
        if (!this.expreInEnv || this.expreInEnv.forceEvaluationOnce({ event: evt })) {
            evt.ms = evt.ms || this.env.get_Clock().now();
            evt.source = evt.source || this;
            evt.name = evt.name || this.eventName;
            this.emitter.emit(evt);
        }
        return this;
    }
}
export function initEvent() {
    registerUnserializer(typeJSON, ((json, env) => {
        let { expressionFilter, eventName, eventerSourceId, eventExpression } = json;
        return new CCBLEvent({
            eventName,
            env,
            expressionFilter,
            eventerSourceId,
            eventExpression
        });
    }));
}
//# sourceMappingURL=Event.js.map