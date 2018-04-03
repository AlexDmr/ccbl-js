"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = require("./Emitter");
const Context_1 = require("./Context");
const Serialiser_1 = require("./Serialiser");
const ContextEvent_1 = require("./ContextEvent");
const Event_1 = require("./Event");
const typeJSON = "CCBLContextState";
class CCBLContextState extends Context_1.CCBLContext {
    constructor(config) {
        super();
        this.active = false;
        this.emitter = new Emitter_1.CCBLEmitter();
        this.cbEventStart = (event) => {
            this.setJsonDirty();
            if (this.state) {
                this.state.listen(false);
                this.state.listen(true);
                this.updateActive(this.state.isEvaluatedTrue());
                if (this.getActive()) {
                    this.state.onChange(this.cbStateChange);
                }
            }
            else {
                this.updateActive(true);
            }
            this.msEventStart = event.ms;
        };
        this.cbEventFinish = (event) => {
            this.setJsonDirty();
            if (event.ms > this.msEventStart) {
                this.updateActive(false);
            }
        };
        this.cbStateChange = (event) => {
            this.updateActive(this.state.isEvaluatedTrue());
        };
        this.environment = config.environment;
        this.state = config.state;
        this.eventStart = config.eventStart;
        this.eventFinish = config.eventFinish;
        if (this.state) {
            this.state.jsonDirty.on(v => {
                if (v && this.jsonDirty === false) {
                    this.setJsonDirty();
                }
            });
        }
        this.eventContextStart = new ContextEvent_1.CCBLContextEvent(new Event_1.CCBLEvent({ env: this.environment, eventName: `start` }));
        this.eventContextEnd = new ContextEvent_1.CCBLContextEvent(new Event_1.CCBLEvent({ env: this.environment, eventName: `end` }));
    }
    toJSON() {
        if (this.jsonDirty) {
            return this.lastJSONState = Object.assign(super.toJSON(), {
                state: this.state ? this.state.toJSON() : null,
                eventStart: this.eventStart ? this.eventStart.toJSON() : null,
                eventFinish: this.eventFinish ? this.eventFinish.toJSON() : null,
                type: typeJSON
            });
        }
        else {
            return this.lastJSONState;
        }
    }
    getActive() { return this.activable && this.active; }
    getActivable() { return this.activable; }
    setActivable(value = true) {
        if (value !== this.activable) {
            super.setActivable(value);
            if (value) {
                if (this.eventStart) {
                    this.eventStart.on(this.cbEventStart);
                }
                else {
                    if (this.state) {
                        this.state.listen();
                        this.updateActive(this.state.isEvaluatedTrue());
                        this.state.onChange(this.cbStateChange);
                    }
                }
            }
            else {
                this.updateActive(false);
                if (this.state) {
                    this.state.listen(false);
                    this.state.offChange(this.cbStateChange);
                }
                if (this.eventStart) {
                    this.eventStart.off(this.cbEventStart);
                }
                if (this.eventFinish) {
                    this.eventFinish.off(this.cbEventFinish);
                }
            }
        }
        return this;
    }
    onceActiveUpdated(cb) {
        this.emitter.once(cb);
        return this;
    }
    onActiveUpdated(cb) {
        this.emitter.on(cb);
        return this;
    }
    offActiveUpdated(cb) {
        this.emitter.off(cb);
        return this;
    }
    appendChannelActions(...actions) {
        super.appendChannelActions(...actions);
        return this;
    }
    updateActive(value) {
        this.setJsonDirty();
        if (value !== this.active) {
            this.active = value;
            if (this.active) {
                this.eventContextStart.setPriority(this.getPriority());
                this.eventContextStart.setActivable(true);
                this.eventContextStart.getChannelActions().forEach(A => A.channel.commit());
                this.eventContextStart.event.trigger({ value: undefined });
                this.eventContextStart.setActivable(false);
            }
            this.channelActions.forEach(s => s.activate(this.active));
            const containingContext = this.getContainingStateContext();
            if (!this.active && containingContext && containingContext.getActive()) {
                this.eventContextEnd.setPriority(this.getPriority());
                this.eventContextEnd.setActivable(true);
                this.eventContextEnd.getChannelActions().forEach(A => A.channel.commit());
                this.eventContextEnd.event.trigger({ value: undefined });
                this.eventContextEnd.setActivable(false);
            }
            this.emitter.emit(value);
            if (this.active) {
                if (this.eventFinish) {
                    this.eventFinish.on(this.cbEventFinish);
                }
            }
            else {
                if (this.eventStart && this.state) {
                    this.state.listen(false);
                }
            }
        }
    }
}
exports.CCBLContextState = CCBLContextState;
Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
    let config = { environment: env };
    if (json.state) {
        config.state = Serialiser_1.Unserialize(json.state, env);
    }
    if (json.eventStart) {
        config.eventStart = Serialiser_1.Unserialize(json.eventStart, env);
    }
    if (json.eventFinish) {
        config.eventFinish = Serialiser_1.Unserialize(json.eventFinish, env);
    }
    let ccblContextState = new CCBLContextState(config);
    json.channelActions.forEach(actJSON => {
        ccblContextState.appendChannelActions(Serialiser_1.Unserialize(actJSON, env));
    });
    json.parentOfAllenRelationships.forEach(relJSON => {
        ccblContextState.appendParentOfAllenRelationships(Serialiser_1.Unserialize(relJSON, env));
    });
    return ccblContextState;
});
//# sourceMappingURL=ContextState.js.map