"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContextState_1 = require("./ContextState");
const EmitterValue_1 = require("./EmitterValue");
const Serialiser_1 = require("./Serialiser");
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const StateInExecutionEnvironment_1 = require("./StateInExecutionEnvironment");
const Channel_1 = require("./Channel");
const AllenInterface_1 = require("./AllenInterface");
const Allen_1 = require("./Allen");
const ChannelActionState_1 = require("./ChannelActionState");
const ConstraintValue_1 = require("./ConstraintValue");
const ContextOrders_1 = require("./ContextOrders");
const Event_1 = require("./Event");
const ContextEvent_1 = require("./ContextEvent");
const ChannelActionEvent_1 = require("./ChannelActionEvent");
class CCBLProgramObject {
    constructor(name, clock) {
        this.clock = clock;
        this.localChannels = new Map();
        this.inputChannelsId = [];
        this.outputChannelsId = [];
        this.localEmitters = new Map();
        this.inputEmittersId = [];
        this.outputEmittersId = [];
        this.localEventers = new Map();
        this.inputEventersId = [];
        this.outputEventersId = [];
        this.rootChannel = Channel_1.getNewChannel(false);
        this.localEventerContexts = new Map();
        this.localStateContexts = new Map();
        this.subPrograms = new Map();
        this.environment = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
        this.environment.register_Channel("rootState", this.rootChannel);
        this.rootContext = new ContextState_1.CCBLContextState({
            environment: this.environment,
            state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({ stateName: `${name}__state`, env: this.environment, expression: "rootState" })
        });
        this.localStateContexts.set("", this.rootContext);
    }
    activate(v = true) {
        this.rootChannel.getValueEmitter().set(v);
        this.rootContext.setActivable(v);
        return this;
    }
    getEnvironment() {
        return this.environment;
    }
    getRootChannel() {
        return this.rootChannel;
    }
    getChannelDescription(id) {
        return this.localChannels.get(id);
    }
    getChannel(id, env) {
        env = env || this.environment;
        return env.get_Channel_FromId(id);
    }
    getEmitterDescription(id) {
        return this.localEmitters.get(id);
    }
    getEmitter(id, env) {
        env = env || this.environment;
        const emitter = env.get_CCBLEmitterValue_FromId(id);
        if (emitter) {
            return emitter;
        }
        else {
            const channel = env.get_Channel_FromId(id);
            return channel ? channel.getValueEmitter() : undefined;
        }
    }
    getEventerDescription(id) {
        return this.localEventers.get(id);
    }
    getEventer(id, env) {
        env = env || this.environment;
        return env.getCCBLEvent(id);
    }
    getValue(id) {
        const emitter = this.getEmitter(id);
        return emitter ? emitter.get() : undefined;
    }
    getClock() {
        return this.clock;
    }
    appendEventActions(eventcontext, ...actions) {
        const context = typeof eventcontext === "string" ? this.localEventerContexts.get(eventcontext) : eventcontext;
        actions.forEach((action) => {
            const eventTriggerAction = action;
            if (eventTriggerAction.eventer) {
                throw "HumanReadableEventTriggerAction NOT YET IMPLEMENTED !!!";
            }
            else {
                const { channel, affectation } = action;
                const chan = this.getChannel(channel);
                if (chan) {
                    const chanAction = new ChannelActionEvent_1.ChannelActionEvent(chan, this.getEnvironment(), affectation);
                    context.appendChannelActions(chanAction);
                }
                else {
                    throw `appendEventActions: Channel ${channel} does not exists in the execution environment`;
                }
            }
        });
        return this;
    }
    appendStateActions(stateContext, ...actions) {
        const chanActions = actions.map((action) => {
            let affectation;
            const channel = this.getChannel(action.channel);
            if (!channel) {
                throw `appendStateActions: Channel ${channel} does not exists in the execution environment`;
            }
            if (action.affectation.type === "constraint") {
                affectation = new ConstraintValue_1.CCBLConstraintValue(this.getEnvironment(), action.affectation.value);
            }
            else {
                affectation = action.affectation.value;
            }
            return new ChannelActionState_1.ChannelActionState(channel, this.getEnvironment(), affectation);
        });
        const context = typeof stateContext === "string" ? this.localStateContexts.get(stateContext) : stateContext;
        context.appendChannelActions(...chanActions);
        return this;
    }
    appendSubProgram(programId, description) {
        if (this.subPrograms.has(programId)) {
            throw "SubProgram identificator already in use";
        }
        else {
            this.subPrograms.set(programId, {
                description,
                instances: []
            });
        }
        return this;
    }
    plugSubProgramAs(config) {
        const { programId, as: asProgramId, mapInputs = {}, hostContextName, allen } = config;
        const hostContext = typeof hostContextName === "string" ? this.localStateContexts.get(hostContextName) : hostContextName;
        if (!hostContext) {
            throw `There is no host context identified by "${hostContextName}"`;
        }
        if (!this.subPrograms.has(programId)) {
            throw `There is no sub-program identified by "${programId}"`;
        }
        const { description: subProgamDescription, instances: subProgramInstances } = this.subPrograms.get(programId);
        const subprog = new CCBLProgramObject(asProgramId, this.getClock());
        subprog.loadHumanReadableProgram(subProgamDescription, this.getEnvironment(), mapInputs);
        subprog.activate(true);
        subProgramInstances.push({ as: asProgramId, mapInputs, prog: subprog });
        const jsonAllen = {
            type: Allen_1.getAllenTypeName(allen),
            children: []
        };
        const allenRel = Serialiser_1.Unserialize(jsonAllen, undefined);
        hostContext.appendParentOfAllenRelationships(allenRel);
        allenRel.appendChildren(subprog.getRootContext());
        subprog.parentProgram = this;
        this.updateStructuralOrder();
        const progName = config.as;
        this.createLocalChannels({ name: `${progName}__isOn`, type: "boolean", channel: subprog.getRootChannel() });
        subprog.outputChannelsId.forEach(id => {
            const { name: chanName, channel, type } = subprog.getChannelDescription(id);
            this.createLocalChannels({ name: `${progName}__${chanName}`, type, channel });
        });
        subprog.outputEmittersId.forEach(id => {
            const emitterDescr = subprog.getEmitterDescription(id);
            if (emitterDescr) {
                const { name: emitterName, type, emitter } = emitterDescr;
                this.createLocalEmitter({ name: `${progName}__${emitterName}`, type, emitter });
            }
            else {
                const chanDescr = subprog.getChannelDescription(id);
                if (chanDescr) {
                    const { name: chanName, type, channel } = chanDescr;
                    this.createLocalEmitter({ name: `${progName}__${chanName}`, type, emitter: channel.getValueEmitter() });
                }
                else {
                    throw `SubProgram plug: There is no Emitter nor Channel identified by ${id}`;
                }
            }
        });
        subprog.outputEventersId.forEach(id => {
            const { name: eventerName, type, eventer } = subprog.getEventerDescription(id);
            this.createLocalEventer({ name: `${progName}__${eventerName}`, type, eventer });
        });
        return this;
    }
    getHumanReadableDescription() {
        return this.humanReadableDescription;
    }
    loadHumanReadableProgram(descr, env, mapInputs) {
        this.humanReadableDescription = descr;
        const subPrograms = descr.subPrograms || {};
        for (let progName in subPrograms) {
            const P = subPrograms[progName];
            const name = progName;
            if (this.subPrograms.has(name)) {
                throw `Error: a subprogram identified by "${name} already exists`;
            }
            else {
                this.subPrograms.set(name, { description: P, instances: [] });
            }
        }
        const dependencies = descr.dependencies ? descr.dependencies : {};
        const imports = dependencies.import || {};
        const channelsImport = imports.channels || [];
        const emittersImport = imports.emitters || [];
        const eventsImport = imports.events || [];
        const exports = dependencies.export || {};
        const channelsExport = exports.channels || [];
        const emittersExport = exports.emitters || [];
        const eventsExport = exports.events || [];
        function getInputName(name) {
            return mapInputs[name] ? mapInputs[name] : name;
        }
        channelsImport
            .map(({ name, type }) => ({ name, type, channel: this.getChannel(getInputName(name), env) }))
            .filter(({ channel, name }) => { if (channel) {
            return true;
        }
        else {
            throw `Channel ${name} does not exist in imported environment`;
        } })
            .forEach(chanDescr => {
            this.createLocalChannels(chanDescr);
            this.inputChannelsId.push(chanDescr.name);
        });
        emittersImport
            .map(({ name, type }) => ({ name, type, emitter: this.getEmitter(getInputName(name), env) }))
            .filter(({ name, emitter }) => { if (emitter) {
            return true;
        }
        else {
            throw `Emitter ${name} does not exist in imported environment`;
        } })
            .forEach(emitDescr => {
            this.createLocalEmitter(emitDescr);
            this.inputEmittersId.push(emitDescr.name);
        });
        eventsImport
            .map(({ name, type }) => ({ name, type, eventer: this.getEventer(getInputName(name), env) }))
            .filter(({ name, eventer }) => { if (eventer) {
            return true;
        }
        else {
            throw `Eventer ${name} does not exist in imported environment`;
        } })
            .forEach(eventerDescr => {
            this.createLocalEventer(eventerDescr);
            this.inputEventersId.push(eventerDescr.name);
        });
        channelsExport
            .map(({ name, type }) => ({ name, type }))
            .forEach(chanDescr => {
            this.createLocalChannels(Object.assign({}, chanDescr, { channel: undefined }));
            this.outputChannelsId.push(chanDescr.name);
        });
        emittersExport
            .map(({ name, type }) => ({ name, type }))
            .forEach(emitDescr => {
            this.createLocalChannels(Object.assign({}, emitDescr, { channel: undefined }));
            this.outputEmittersId.push(emitDescr.name);
        });
        eventsExport
            .map(({ name, type }) => ({ name, type, eventer: undefined }))
            .forEach(eventerDescr => {
            this.createLocalEventer(eventerDescr);
            this.outputEventersId.push(eventerDescr.name);
        });
        const localChannels = descr.localChannels || [];
        localChannels.forEach(chanDescr => {
            this.createLocalChannels(Object.assign({}, chanDescr, { channel: undefined }));
        });
        this.loadHumanReadableContextState({
            contextName: "",
            state: "",
            actions: descr.actions,
            allen: descr.allen
        }, this.rootContext);
        this.updateStructuralOrder();
        return this;
    }
    updateStructuralOrder() {
        if (this.parentProgram) {
            this.parentProgram.updateStructuralOrder();
        }
        else {
            ContextOrders_1.StructuralOrder(this.rootContext);
            const activable = this.getRootContext().getActivable();
            this.getRootContext().setActivable(false);
            this.getRootContext().setActivable(activable);
        }
    }
    createLocalEmitter(...emitters) {
        const L = emitters.map(({ name, emitter, type }) => ({
            emitter: emitter || new EmitterValue_1.CCBLEmitterValue(undefined),
            type,
            name
        }));
        L.forEach(({ emitter, type, name }) => {
            this.environment.register_CCBLEmitterValue(name, emitter);
            this.localEmitters.set(name, { emitter, type, name });
        });
        return L;
    }
    loadContextOrProgram(allen, hostContext, descr) {
        const jsonAllen = {
            type: Allen_1.getAllenTypeName(allen),
            children: []
        };
        const allenRel = Serialiser_1.Unserialize(jsonAllen, undefined);
        hostContext.appendParentOfAllenRelationships(allenRel);
        const progRef = descr;
        if (progRef.programId) {
            this.plugSubProgramAs({
                programId: progRef.programId,
                as: progRef.as,
                mapInputs: progRef.mapInputs,
                allen: allen,
                hostContextName: hostContext
            });
        }
        else {
            const context = this.loadHumanReadableContext(descr);
            allenRel.appendChildren(context);
        }
    }
    loadHumanReadableContext(descr) {
        const stateContext = descr;
        if (stateContext.state) {
            return this.loadHumanReadableContextState(stateContext);
        }
        else {
            return this.loadHumanReadableContextevent(descr);
        }
    }
    loadHumanReadableContextevent(descr) {
        const { eventer } = this.localEventers.get(descr.eventSource);
        const eventContext = new ContextEvent_1.CCBLContextEvent(eventer);
        if (this.localEventerContexts.has(descr.contextName)) {
            throw `CANNOT create multiple event context with the same name ${descr.contextName}`;
        }
        else {
            this.localEventerContexts.set(descr.contextName, eventContext);
            this.appendEventActions(eventContext, ...(descr.actions || []));
        }
        return eventContext;
    }
    loadHumanReadableContextState(descr, context) {
        if (context === undefined) {
            const contextConfig = {
                environment: this.getEnvironment()
            };
            if (descr.state !== undefined) {
                contextConfig.state = new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({ env: this.getEnvironment(), expression: descr.state, stateName: "" });
            }
            if (descr.eventStart) {
                contextConfig.eventStart = new Event_1.CCBLEvent({
                    eventName: descr.eventStart.eventName || "start",
                    env: this.getEnvironment(),
                    expressionFilter: descr.eventStart.eventFilter,
                    eventerSourceId: descr.eventStart.eventSource
                });
            }
            if (descr.eventFinish) {
                contextConfig.eventFinish = new Event_1.CCBLEvent({
                    eventName: descr.eventFinish.eventName || "finish",
                    env: this.getEnvironment(),
                    expressionFilter: descr.eventFinish.eventFilter,
                    eventerSourceId: descr.eventFinish.eventSource
                });
            }
            context = new ContextState_1.CCBLContextState(contextConfig);
            if (this.localStateContexts.has(descr.contextName)) {
                throw `CANNOT create multiple state context with the same name ${descr.contextName}`;
            }
            else {
                this.localStateContexts.set(descr.contextName, context);
            }
            if (descr.actionsOnStart) {
                this.appendEventActions(context.eventContextStart, ...descr.actionsOnStart);
            }
            if (descr.actionsOnEnd) {
                this.appendEventActions(context.eventContextEnd, ...descr.actionsOnEnd);
            }
        }
        const allens = descr.allen || {};
        const During = allens.During || [];
        const StartWith = allens.StartWith || [];
        const EndWith = allens.EndWith || [];
        StartWith.forEach(d => this.loadContextOrProgram(AllenInterface_1.AllenType.StartWith, context, d));
        During.forEach(d => this.loadContextOrProgram(AllenInterface_1.AllenType.During, context, d));
        EndWith.forEach(d => this.loadContextOrProgram(AllenInterface_1.AllenType.EndWith, context, d));
        if (allens.Meet) {
            const { contextsSequence: LC, loop } = allens.Meet;
            const contexts = LC.map(d => this.loadHumanReadableContext(d));
            contexts.reduce((C, NC) => {
                const jsonAllen = {
                    type: Allen_1.getAllenTypeName(AllenInterface_1.AllenType.Meet),
                    children: []
                };
                const allenRel = Serialiser_1.Unserialize(jsonAllen, undefined);
                C.appendParentOfAllenRelationships(allenRel);
                allenRel.appendChildren(NC);
                return NC;
            }, context);
            if (loop !== undefined) {
                const index = Math.floor(loop % (contexts.length + 1));
                const jsonAllen = {
                    type: Allen_1.getAllenTypeName(AllenInterface_1.AllenType.Meet),
                    children: []
                };
                const allenRel = Serialiser_1.Unserialize(jsonAllen, undefined);
                const firstLoopingContext = index === 0 ? context : contexts[index - 1];
                const lastLoopingContext = contexts.length === 0 ? context : contexts[contexts.length - 1];
                lastLoopingContext.appendParentOfAllenRelationships(allenRel);
                allenRel.appendChildren(firstLoopingContext);
            }
        }
        this.appendStateActions(context, ...(descr.actions || []));
        return context;
    }
    getRootContext() {
        return this.rootContext;
    }
    createLocalChannels(...channels) {
        const L = channels.map(({ name, channel, type }) => ({
            channel: channel || Channel_1.getNewChannel(),
            type,
            name
        }));
        L.forEach(({ channel, type, name }) => {
            this.environment.register_Channel(name, channel);
            this.localChannels.set(name, { channel, type, name });
            Channel_1.registerChannel(channel);
        });
        return L;
    }
    createLocalEventer(...eventers) {
        const L = eventers.map(({ name, eventer, type }) => ({
            eventer: eventer || new Event_1.CCBLEvent({ eventName: name, env: this.getEnvironment() }),
            type,
            name
        }));
        L.forEach(({ eventer, type, name }) => {
            this.environment.registerCCBLEvent(name, eventer);
            this.localEventers.set(name, { eventer, type, name });
        });
        return L;
    }
}
exports.CCBLProgramObject = CCBLProgramObject;
//# sourceMappingURL=ProgramObject.js.map