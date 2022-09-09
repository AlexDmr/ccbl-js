import { CCBLEmitter } from "./Emitter";
import { CCBLContext } from "./Context";
import { registerUnserializer, Unserialize } from "./Serialiser";
import { CCBLContextEvent } from "./ContextEvent";
import { CCBLEvent } from "./Event";
let idContextState = 0;
const typeJSON = "CCBLContextState";
export class CCBLContextState extends CCBLContext {
    constructor(config) {
        super();
        this.active = false;
        this.emitter = new CCBLEmitter();
        this.id = `contextState::${++idContextState}`;
        this.cbEventStart = (event) => {
            this.setJsonDirty();
            const wasAlreadyActive = this.active;
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
            if (!wasAlreadyActive) {
                this.msEventStart = event.ms;
            }
        };
        this.cbEventFinish = (event) => {
            this.setJsonDirty();
            this.msEventStart;
            if (event.ms > (this.msEventStart === undefined ? -1 : this.msEventStart)) {
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
        this.rootOfProgramId = config.rootOfProgramId;
        this.contextName = config.contextName;
        if (this.state) {
            this.state.jsonDirty.on(this.cb_jsonDirty = v => {
                if (v && this.jsonDirty === false) {
                    this.setJsonDirty();
                }
            });
        }
        this.eventContextStart = new CCBLContextEvent("starting event", new CCBLEvent({ env: this.environment, eventName: `start` }));
        this.eventContextEnd = new CCBLContextEvent("finishing event", new CCBLEvent({ env: this.environment, eventName: `end` }));
    }
    dispose() {
        this.setJsonDirty();
        this.setActivable(false);
        if (this.state) {
            this.state.jsonDirty.off(this.cb_jsonDirty);
        }
        this.eventContextStart.dispose();
        this.eventContextEnd.dispose();
        if (this.state) {
            this.state.dispose();
        }
        if (this.eventStart) {
            this.eventStart.dispose();
        }
        if (this.eventFinish) {
            this.eventFinish.dispose();
        }
        super.dispose();
    }
    getType() {
        return typeJSON;
    }
    toJSON() {
        if (this.jsonDirty) {
            return this.lastJSONState = Object.assign(super.toJSON(), {
                state: this.state?.toJSON(),
                eventStart: this.eventStart?.toJSON(),
                eventFinish: this.eventFinish?.toJSON(),
                actionsOnStart: this.eventContextStart.getChannelActions().map(ca => ca.toJSON()),
                actionsOnFinish: this.eventContextEnd.getChannelActions().map(ca => ca.toJSON()),
                type: typeJSON,
                rootOfProgramId: this.rootOfProgramId
            });
        }
        else {
            return this.lastJSONState;
        }
    }
    getChannelActionStates() {
        return [...this.channelActions.values()];
    }
    getActive() { return this.activable && this.active; }
    getActivable() { return this.activable; }
    setActivable(value = true) {
        if (value !== this.activable) {
            super.setActivable(value);
            if (value) {
                if (this.eventStart) {
                    if (!!this.eventStart.evalEventExpression()) {
                        this.updateActive(true);
                    }
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
            else {
                this.eventStart?.on(this.cbEventStart);
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
                this.eventFinish?.on(this.cbEventFinish);
            }
            else {
                if (this.eventStart && this.state) {
                    this.state.listen(false);
                }
            }
        }
    }
}
registerUnserializer(typeJSON, ((json, env) => {
    let config = { environment: env, contextName: "pipo" };
    if (json.state) {
        config.state = Unserialize(json.state, env);
    }
    if (json.eventStart) {
        config.eventStart = Unserialize(json.eventStart, env);
    }
    if (json.eventFinish) {
        config.eventFinish = Unserialize(json.eventFinish, env);
    }
    let ccblContextState = new CCBLContextState(config);
    json.channelActions.forEach(actJSON => {
        ccblContextState.appendChannelActions(Unserialize(actJSON, env));
    });
    json.parentOfAllenRelationships.forEach(relJSON => {
        ccblContextState.appendParentOfAllenRelationships(Unserialize(relJSON, env));
    });
    return ccblContextState;
}));
//# sourceMappingURL=ContextState.js.map