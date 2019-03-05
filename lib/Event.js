"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = require("./Emitter");
const Serialiser_1 = require("./Serialiser");
const EmitterValue_1 = require("./EmitterValue");
const CCBLExpressionInExecutionEnvironment_1 = require("./CCBLExpressionInExecutionEnvironment");
const typeJSON = "CCBL_EventJSON";
class CCBLEvent {
    constructor({ eventName, expressionFilter, env, eventerSourceId }) {
        this.jsonDirty = new EmitterValue_1.CCBLEmitterValue(true);
        this.available = true;
        this.emitter = new Emitter_1.CCBLEmitter();
        this.env = env;
        this.eventName = eventName;
        this.setGuardExpression(expressionFilter);
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
    }
    dispose() {
        if (this.eventerSource && this.cbEventerSource) {
            this.eventerSource.off(this.cbEventerSource);
        }
    }
    toJSON() {
        if (this.jsonDirty.get()) {
            this.jsonDirty.set(false);
            this.lastJSON = {
                available: this.isAvailable(),
                type: typeJSON,
                eventName: this.eventName,
                expressionFilter: this.getGuardExpression(),
                eventerSourceId: this.eventerSourceId
            };
        }
        return this.lastJSON;
    }
    getGuardExpression() {
        return this.expreInEnv ? this.expreInEnv.getExpression() : "";
    }
    setGuardExpression(expr) {
        if (expr) {
            if (this.expreInEnv) {
                this.expreInEnv.setExpression(expr, ["event"]);
            }
            else {
                this.expreInEnv = new CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment({
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
exports.CCBLEvent = CCBLEvent;
function initEvent() {
    Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
        let { expressionFilter, eventName, eventerSourceId } = json;
        return new CCBLEvent({
            eventName,
            env,
            expressionFilter,
            eventerSourceId
        });
    });
}
exports.initEvent = initEvent;
//# sourceMappingURL=Event.js.map