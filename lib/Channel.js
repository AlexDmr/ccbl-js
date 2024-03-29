import { CCBLEmitterValue } from "./EmitterValue";
import { registerUnserializer, Unserialize } from "./Serialiser";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
let channels = [];
export function getNewChannel(initialValue, valueEmitter) {
    valueEmitter = valueEmitter || new CCBLEmitterValue(initialValue);
    return new Channel(valueEmitter);
}
const typeJSON = "Channel";
export class Channel {
    constructor(valueEmitter) {
        this.valueEmitter = valueEmitter;
        this.dirty = false;
        this.dirtyJSON = true;
        this.actions = [];
        this.configActiveActionEvents = [];
        this.hasActiveAction = new CCBLEmitterValue(false);
        this.forceCommit = false;
        channels.push(this);
        this.cbEmitter = (data) => {
            this.forceCommit = true;
        };
        this.valueEmitter.onAvailabilityChange(() => this.dirtyJSON = true);
    }
    dispose() {
        channels = channels.filter(c => c !== this);
    }
    getValueEmitter() {
        return this.valueEmitter;
    }
    getChannelId() {
        return this.valueEmitter.get_Id();
    }
    toJSON() {
        this.lastJSON = this.dirtyJSON ? {
            available: this.isAvailable(),
            type: typeJSON,
            id: this.getChannelId(),
            valueEmitter: this.valueEmitter.toJSON()
        } : this.lastJSON;
        this.dirtyJSON = false;
        return this.lastJSON;
    }
    isAvailable() { return this.valueEmitter.isAvailable(); }
    setIsAvailable(available) {
        this.valueEmitter.setIsAvailable(available);
        return this;
    }
    append(channelAction) {
        let newChannelAction = this.actions.concat([channelAction]);
        this.update(newChannelAction);
    }
    remove(channelAction) {
        let newChannelAction = this.actions.filter(SA => SA !== channelAction);
        this.update(newChannelAction);
    }
    update(newStateActions) {
        newStateActions = newStateActions || this.actions;
        newStateActions.sort(fctContextOrder);
        this.actions = newStateActions;
        this.dirty = this.dirty || this.configChanged();
    }
    configChanged() {
        let nC = this.getConstraintsAndStateAction();
        let oC = this.lastActiveStateConfig;
        return !oC
            || nC.emitterValue !== oC.emitterValue
            || nC.channelActionState !== oC.channelActionState
            || nC.stateConstraints.length !== oC.stateConstraints.length
            || nC.stateConstraints.reduce((acc, sc, i) => {
                return acc || sc !== oC?.stateConstraints[i];
            }, false)
            || nC.channelActionEvents.length !== oC.channelActionEvents.length
            || nC.channelActionEvents.reduce((acc, sc, i) => {
                return acc || sc !== oC?.channelActionEvents[i];
            }, false);
    }
    getConstraintsAndStateAction() {
        let new_sa;
        let emitterValue;
        let stateConstraints = [];
        let channelActionEvents = [];
        for (let channelAction of this.actions) {
            if (channelAction.isChannelActionState()) {
                const chanActionState = channelAction;
                if (chanActionState.isValueGetterAConstraint()) {
                    stateConstraints.push(chanActionState);
                }
                else {
                    new_sa = chanActionState;
                    emitterValue = chanActionState.getValueGetter();
                    break;
                }
            }
            else if (channelAction.isChannelActionEvent()) {
                channelActionEvents.push(channelAction);
            }
        }
        return {
            stateConstraints: stateConstraints,
            channelActionEvents: channelActionEvents,
            channelActionState: new_sa,
            emitterValue: emitterValue
        };
    }
    UnlistenToContextEvents() {
        this.configActiveActionEvents.forEach(conf => {
            conf.channelActionEvent.getContextEvent().event.off(conf.cb);
            conf.channelActionEvent.getIsActivated().set(false);
        });
        this.configActiveActionEvents = [];
        return this;
    }
    ListenToContextEvents() {
        this.lastActiveStateConfig?.channelActionEvents.forEach(cae => {
            let conf = {
                channelActionEvent: cae,
                channel: this,
                cb: evt => {
                    this.overhideValue(cae.getValueGetter().instanciate({ value: evt.value, ms: evt.ms }));
                }
            };
            cae.getContextEvent().event.on(conf.cb);
            cae.getIsActivated().set(true);
            this.configActiveActionEvents.push(conf);
        });
        return this;
    }
    overhideValue(newValue) {
        this.lastActiveStateConfig?.channelActionState?.overrideWith(newValue);
        this.forceCommit = true;
        this.commit();
        return this;
    }
    ApplyConstraintsToValue(original) {
        let res;
        let stateConstraints = this.lastActiveStateConfig?.stateConstraints ?? [];
        let constraints = stateConstraints.map(sa => sa.getValueGetter());
        let fctConstraint;
        if (constraints.length) {
            const scope = {};
            if (this.lastActiveStateConfig) {
                const env = this.lastActiveStateConfig.stateConstraints[0].getEnvironment();
                const chanName = env.getNameOfChannel(this);
                scope[chanName] = original;
            }
            fctConstraint = x => constraints.reverse().reduce((result, f) => f.apply(result, scope), x);
            res = fctConstraint(original);
        }
        else {
            res = original;
        }
        return res;
    }
    updateValue(newValue) {
        if (this.valueEmitter.get() !== newValue) {
            this.valueEmitter.set(newValue);
        }
        return this;
    }
    shouldConsiderCommitting() {
        return this.dirty || this.forceCommit;
    }
    commit() {
        let valueChanged = false;
        if (this.forceCommit || (this.dirty && this.configChanged())) {
            this.forceCommit = false;
            this.UnlistenToContextEvents();
            if (this.lastActiveStateConfig && this.lastActiveStateConfig.emitterValue) {
                this.lastActiveStateConfig.emitterValue.off(this.cbEmitter);
                this.lastActiveStateConfig.channelActionState?.getIsActivated().set(false);
            }
            if (this.lastActiveStateConfig && this.lastActiveStateConfig.stateConstraints) {
                this.lastActiveStateConfig.stateConstraints.forEach(constraint => constraint.getIsActivated().set(false));
            }
            let lastConfig = this.getConstraintsAndStateAction();
            let { emitterValue: emitterValue } = this.lastActiveStateConfig = lastConfig;
            if (emitterValue) {
                let newValue = this.ApplyConstraintsToValue(emitterValue.forceEvaluationOnce());
                this.updateValue(newValue);
                emitterValue.on(this.cbEmitter);
                valueChanged = true;
                this.lastActiveStateConfig.channelActionState?.getIsActivated().set(true);
            }
            else {
                let newValue = this.ApplyConstraintsToValue(this.getValueEmitter().get());
                this.updateValue(newValue);
                valueChanged = true;
            }
            if (this.lastActiveStateConfig && this.lastActiveStateConfig.stateConstraints) {
                this.lastActiveStateConfig.stateConstraints.forEach(constraint => constraint.getIsActivated().set(true));
            }
            this.ListenToContextEvents();
        }
        this.dirty = false;
        this.hasActiveAction.set(this.lastActiveStateConfig?.channelActionState !== undefined);
        return valueChanged;
    }
}
registerUnserializer(typeJSON, ((json, env) => {
    let { id: id, valueEmitter: VE } = json;
    let res;
    let chan = env.get_Channel_FromId(id);
    if (chan) {
        res = chan;
    }
    else {
        res = new Channel(Unserialize(VE, env));
        env.register_Channel(id, res);
    }
    return res;
}));
let Channels = [];
function fctContextOrder(c1, c2) {
    return c2.getPriority() - c1.getPriority();
}
export function UpdateChannelsActions(...channels) {
    if (channels.length === 0) {
        channels = Channels;
    }
    channels.forEach(c => c.update());
    commitStateActions(...channels);
}
export function commitStateActions(...channels) {
    let L = channels;
    if (L.length === 0) {
        channels = Channels;
        L = Channels.filter(chan => chan.shouldConsiderCommitting());
    }
    while (L.length > 0) {
        L.forEach(chan => {
            let nextConf = chan.getConstraintsAndStateAction();
            let doCommit = true;
            if (nextConf.emitterValue instanceof CCBLExpressionInExecutionEnvironment) {
                const exprInEnv = nextConf.emitterValue;
                const emitters = exprInEnv.getChannelDependencies();
                doCommit = emitters.reduce((acc, e) => acc && L.indexOf(e) === -1, true);
            }
            if (doCommit) {
                chan.commit();
            }
        });
        L = channels.filter(chan => chan.shouldConsiderCommitting());
    }
}
export function registerChannel(...channels) {
    channels.forEach(chan => {
        if (Channels.indexOf(chan) === -1) {
            Channels.push(chan);
        }
    });
}
export function createChannel(emitter) {
    let chan = new Channel(emitter);
    registerChannel(chan);
    return chan;
}
export function Activate(channelAction) {
    channelAction.getChannel().append(channelAction);
}
export function Desactivate(channelAction) {
    channelAction.getChannel().remove(channelAction);
}
//# sourceMappingURL=Channel.js.map