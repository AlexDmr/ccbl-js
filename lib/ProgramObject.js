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
        this.name = name;
        this.clock = clock;
        this.localSubProgChannelsId = [];
        this.allChannelsForUpdates = [];
        this.localChannelsId = [];
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
            contextName: `${name}__state`,
            environment: this.environment,
            rootOfProgramId: this.name,
            state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({ stateName: `${name}__state`, env: this.environment, expression: "rootState" })
        });
        this.localStateContexts.set("", this.rootContext);
    }
    dispose() {
        this.activate(false);
        this.subPrograms.forEach(sp => {
            sp.instances.forEach(pi => {
                pi.prog.dispose();
            });
        });
        this.rootContext.dispose();
    }
    UpdateChannelsActions() {
        Channel_1.UpdateChannelsActions(...this.getChannels());
    }
    getChannels() {
        return this.allChannelsForUpdates;
    }
    recomputeAllChannelsForUpdate() {
        const LC = this.getEnvironment().getAllChannels();
        for (let sp of this.subPrograms.values()) {
            for (let instance of sp.instances) {
                LC.push(...instance.prog.getChannels());
            }
        }
        this.allChannelsForUpdates = LC.reduce((acc, c) => {
            if (acc.indexOf(c) === -1) {
                acc.push(c);
            }
            return acc;
        }, []);
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
                    action.ccblAction = chanAction;
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
            const ccblAction = new ChannelActionState_1.ChannelActionState(channel, this.getEnvironment(), affectation);
            action.ccblAction = ccblAction;
            return ccblAction;
        });
        const context = typeof stateContext === "string" ? this.localStateContexts.get(stateContext) : stateContext;
        context.appendChannelActions(...chanActions);
        return this;
    }
    getProgramInstance(instanceName) {
        for (let progId of this.subPrograms.keys()) {
            const progInstance = this.subPrograms.get(progId).instances.find(P => P.as === instanceName);
            if (progInstance) {
                return progInstance.prog;
            }
        }
        return undefined;
    }
    getProgramInstances(progName) {
        if (this.subPrograms.has(progName)) {
            const SP = this.subPrograms.get(progName);
            return {
                program: SP.description,
                instances: SP.instances.map(instance => instance.prog)
            };
        }
        return undefined;
    }
    unplugSubProgramInstance(instanceName) {
        for (let progId of this.subPrograms.keys()) {
            const SPD = this.subPrograms.get(progId);
            const progInstance = SPD.instances.find(P => P.as === instanceName);
            if (progInstance) {
                this.subPrograms.set(progId, {
                    description: SPD.description,
                    instances: SPD.instances.filter(inst => inst !== progInstance)
                });
                progInstance.prog.dispose();
                return;
            }
        }
        throw `There is no program instance identified by "${instanceName}"`;
    }
    removeSubProgram(programId) {
        if (this.subPrograms.has(programId)) {
            this.subPrograms.get(programId).instances.forEach(P => P.prog.dispose());
            this.subPrograms.delete(programId);
        }
        else {
            throw `No SubProgram identificator "${programId}" does exist`;
        }
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
        const progName = config.as;
        const channelName = `${progName}__isOn`;
        this.localSubProgChannelsId.push(channelName);
        this.createLocalChannels({ name: channelName, type: "boolean", channel: subprog.getRootChannel() });
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
        this.updateStructuralOrder();
        return this;
    }
    toHumanReadableProgram() {
        const channelsId = [
            ...this.localChannelsId,
            ...this.inputChannelsId,
            ...this.outputChannelsId,
            ...this.localSubProgChannelsId
        ];
        const findActualChannelForId = ccblChanId => {
            const actualId = channelsId.find(id => this.localChannels.get(id).channel.getChannelId() === ccblChanId);
            return actualId;
        };
        const actionToHumanReadable = action => {
            const json = action.toJSON();
            switch (json.type) {
                case "ChannelActionState":
                    const actionState = json;
                    let affectation;
                    switch (actionState.valueGetter.type) {
                        case "CCBLConstraintValue":
                            const constraint = actionState.valueGetter;
                            affectation = {
                                type: "constraint",
                                value: constraint.expression
                            };
                            break;
                        case "CCBLExpressionInExecutionEnvironment":
                            const exp = actionState.valueGetter;
                            affectation = {
                                type: "expression",
                                value: exp.originalExpression
                            };
                            break;
                        default:
                            throw `Unnown value type "${actionState.valueGetter.type}"`;
                    }
                    const ccblChannelActionStateId = actionState.channel.id;
                    return {
                        channel: findActualChannelForId(ccblChannelActionStateId),
                        affectation: affectation,
                        ccblAction: action
                    };
                case "ChannelActionEvent":
                    const actionEvent = json;
                    const ccblChannelActionEventId = actionEvent.channel.id;
                    return {
                        channel: findActualChannelForId(ccblChannelActionEventId),
                        affectation: actionEvent.expression,
                        ccblAction: action
                    };
                default:
                    throw `Unknown action type "${json.type}"`;
            }
        };
        const subPrograms = {};
        this.subPrograms.forEach((subP, Pname) => {
            subPrograms[Pname] = subP.description;
        });
        const contextToHumanReadable = context => {
            if (!context) {
                return undefined;
            }
            switch (context.getType()) {
                case "CCBLContextState":
                    const contextState = context;
                    const rootOfProgramId = contextState.rootOfProgramId;
                    if (rootOfProgramId) {
                        const instance = this.getSubProgramIdentifiedBy(rootOfProgramId);
                        return {
                            programId: instance.programClassName,
                            as: rootOfProgramId,
                            mapInputs: instance.mapInputs
                        };
                    }
                    else {
                        return stateContextToHumanReadable(contextState);
                    }
                case "CCBLContextEvent":
                    return eventContextToHumanReadable(context);
                default:
                    throw `Unknow context type "${context.getType()}"`;
            }
        };
        const eventContextToHumanReadable = context => {
            return {
                contextName: context.getContextName(),
                eventSource: context.event.getEventName(),
                actions: context.getChannelActions().map(actionToHumanReadable),
                ccblContext: context
            };
        };
        const eventTriggerToHumanReadable = evt => {
            return evt ? {
                eventName: evt.getEventName(),
                eventSource: evt.getEventerSourceId(),
                eventFilter: evt.getGuardExpression()
            } : undefined;
        };
        const stateContextToHumanReadable = context => {
            function getMeetChain(cStart) {
                const L = [];
                let next = cStart;
                while (next && L.indexOf(next) === -1) {
                    L.push(next);
                    const rels = next.getParentOfAllenRelationships().filter(r => r.getAllenType() === AllenInterface_1.AllenType.Meet);
                    if (rels.length) {
                        const rel = rels[0];
                        next = rel.getChildren()[0];
                    }
                    else {
                        next = undefined;
                    }
                }
                return { L, loop: !!next ? L.indexOf(next) : undefined };
            }
            const relationships = {};
            context.getParentOfAllenRelationships().forEach(rel => {
                switch (rel.getAllenType()) {
                    case AllenInterface_1.AllenType.During:
                        relationships.During = relationships.During || [];
                        relationships.During.push(...rel.getChildren().map(contextToHumanReadable));
                        break;
                    case AllenInterface_1.AllenType.Meet:
                        relationships.Meet = relationships.Meet || { contextsSequence: [], loop: 0 };
                        const res = getMeetChain(context);
                        const rels = res.L.map(c => c.getParentOfAllenRelationships().filter(r => r.getAllenType() === AllenInterface_1.AllenType.Meet));
                        relationships.Meet.loop = res.loop;
                        if (res.loop !== undefined) {
                            res.L.forEach((c, i) => c.removeParentOfAllenRelationships(...rels[i]));
                        }
                        const [, ...Lc] = res.L;
                        relationships.Meet.contextsSequence.push(...Lc.map(contextToHumanReadable).filter(c => !!c));
                        if (res.loop !== undefined) {
                            res.L.forEach((c, i) => c.appendParentOfAllenRelationships(...rels[i]));
                        }
                        break;
                    case AllenInterface_1.AllenType.StartWith:
                        relationships.StartWith = relationships.During || [];
                        relationships.StartWith.push(...rel.getChildren().map(contextToHumanReadable));
                        break;
                    case AllenInterface_1.AllenType.EndWith:
                        relationships.EndWith = relationships.During || [];
                        relationships.EndWith.push(...rel.getChildren().map(contextToHumanReadable));
                        break;
                    default:
                        throw `Unknown allen type "${Allen_1.getAllenTypeName(rel.getAllenType())}"`;
                }
            });
            return {
                contextName: context.getContextName(),
                state: context.state ? context.state.originalExpression : undefined,
                eventStart: eventTriggerToHumanReadable(context.eventStart),
                eventFinish: eventTriggerToHumanReadable(context.eventFinish),
                actionsOnStart: context.eventContextStart.getChannelActions().map(actionToHumanReadable),
                actionsOnEnd: context.eventContextEnd.getChannelActions().map(actionToHumanReadable),
                actions: context.getChannelActions().map(actionToHumanReadable),
                allen: relationships,
                ccblContext: context
            };
        };
        const rootContextHumanReadable = stateContextToHumanReadable(this.rootContext);
        rootContextHumanReadable.ccblContext = this.rootContext;
        const hrp = {
            dependencies: {
                import: {
                    channels: this.inputChannelsId.map(id => ({ name: id, type: this.localChannels.get(id).type })),
                    emitters: this.inputEmittersId.map(id => ({ name: id, type: this.localEmitters.get(id).type })),
                    events: this.inputEventersId.map(id => ({ name: id, type: this.localEventers.get(id).type }))
                },
                export: {
                    channels: this.outputChannelsId.map(id => ({ name: id, type: this.localChannels.get(id).type })),
                    emitters: this.outputEmittersId.map(id => ({ name: id, type: this.localEmitters.get(id).type })),
                    events: this.outputEventersId.map(id => ({ name: id, type: this.localEventers.get(id).type }))
                }
            },
            localChannels: this.localChannelsId.map(id => ({ name: id, type: this.localChannels.get(id).type })),
            actions: rootContextHumanReadable.actions,
            allen: rootContextHumanReadable.allen,
            subPrograms
        };
        return hrp;
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
            this.createLocalChannels(Object.assign(Object.assign({}, chanDescr), { channel: undefined }));
            this.outputChannelsId.push(chanDescr.name);
        });
        emittersExport
            .map(({ name, type }) => ({ name, type }))
            .forEach(emitDescr => {
            this.createLocalChannels(Object.assign(Object.assign({}, emitDescr), { channel: undefined }));
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
            this.localChannelsId.push(chanDescr.name);
            this.createLocalChannels(Object.assign(Object.assign({}, chanDescr), { channel: undefined }));
        });
        this.loadHumanReadableContextState({
            contextName: "",
            state: "",
            actions: descr.actions,
            allen: descr.allen
        }, this.rootContext);
        this.updateStructuralOrder();
        this.recomputeAllChannelsForUpdate();
        return this;
    }
    getStateContext(name) {
        return this.localStateContexts.get(name);
    }
    updateStructuralOrder() {
        if (this.parentProgram) {
            this.parentProgram.updateStructuralOrder();
        }
        else {
            ContextOrders_1.StructuralOrder(this.rootContext);
            Channel_1.UpdateChannelsActions();
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
        const eventContext = new ContextEvent_1.CCBLContextEvent(descr.contextName, eventer);
        if (this.localEventerContexts.has(descr.contextName)) {
            throw `CANNOT create multiple event context with the same name ${descr.contextName}`;
        }
        else {
            this.localEventerContexts.set(descr.contextName, eventContext);
            this.appendEventActions(eventContext, ...(descr.actions || []));
            descr.ccblContext = eventContext;
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
            context = new ContextState_1.CCBLContextState(Object.assign(Object.assign({}, contextConfig), { contextName: descr.contextName }));
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
        descr.ccblContext = context;
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
    getSubProgramIdentifiedBy(instanceName) {
        const progNames = this.subPrograms.keys();
        for (const progName of progNames) {
            const descr = this.subPrograms.get(progName);
            const instance = descr.instances.find(inst => inst.as === instanceName);
            if (instance) {
                return Object.assign(Object.assign({}, instance), { programClassName: progName });
            }
        }
        return undefined;
    }
}
exports.CCBLProgramObject = CCBLProgramObject;
//# sourceMappingURL=ProgramObject.js.map