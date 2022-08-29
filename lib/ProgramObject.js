import { CCBLContextState } from "./ContextState";
import { CCBLEmitterValue } from "./EmitterValue";
import { Unserialize } from "./Serialiser";
import { CCBLEnvironmentExecution, emptyEnvExec } from "./ExecutionEnvironment";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { getNewChannel, registerChannel, UpdateChannelsActions } from "./Channel";
import { copyProgRef } from "./ProgramObjectInterface";
import { AllenType } from "./AllenInterface";
import { getAllenTypeName } from "./Allen";
import { ChannelActionState } from "./ChannelActionState";
import { CCBLConstraintValue } from "./ConstraintValue";
import { StructuralOrder } from "./ContextOrders";
import { CCBLEvent } from "./Event";
import { CCBLContextEvent } from "./ContextEvent";
import { ChannelActionEvent } from "./ChannelActionEvent";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
export class CCBLProgramObject {
    constructor(name, clock) {
        this.name = name;
        this.clock = clock;
        this.bindedEmittersAndEvents = [];
        this.localSubProgChannelsId = [];
        this.allChannelsForUpdates = [];
        this.localChannels = new Map();
        this.localChannelsId = [];
        this.inputChannelsId = [];
        this.outputChannelsId = [];
        this.localEmitters = new Map();
        this.inputEmittersId = [];
        this.outputEmittersId = [];
        this.localEventers = new Map();
        this.inputEventersId = [];
        this.outputEventersId = [];
        this.rootChannel = getNewChannel(false);
        this.subPrograms = new Map();
        this.environment = new CCBLEnvironmentExecution(clock);
        this.environment.register_Channel("rootState", this.rootChannel);
        this.rootContext = new CCBLContextState({
            contextName: `${name}__state`,
            environment: this.environment,
            rootOfProgramId: this.name,
            state: new CCBLStateInExecutionEnvironment({ stateName: `${name}__state`, env: this.environment, expression: "rootState" })
        });
    }
    dispose() {
        this.activate(false);
        this.subPrograms.forEach(sp => {
            sp.instances.forEach(pi => {
                pi.prog.dispose();
            });
        });
        this.bindedEmittersAndEvents.forEach(e => e.dispose());
        this.rootContext.dispose();
    }
    UpdateChannelsActions() {
        UpdateChannelsActions(...this.getChannels());
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
            return channel?.getValueEmitter();
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
        const context = eventcontext;
        actions.forEach((action) => {
            const eventTriggerAction = action;
            if (eventTriggerAction.eventer) {
                throw "HumanReadableEventTriggerAction NOT YET IMPLEMENTED !!!";
            }
            else {
                const { channel, affectation } = action;
                const chan = this.getChannel(channel);
                if (chan) {
                    const chanAction = new ChannelActionEvent(chan, this.getEnvironment(), affectation);
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
                affectation = new CCBLConstraintValue(this.getEnvironment(), action.affectation.value);
            }
            else {
                affectation = action.affectation.value;
            }
            const ccblAction = new ChannelActionState(channel, this.getEnvironment(), affectation);
            action.ccblAction = ccblAction;
            return ccblAction;
        });
        const context = stateContext;
        context.appendChannelActions(...chanActions);
        return this;
    }
    getProgramInstance(instanceName) {
        for (let progId of this.subPrograms.keys()) {
            const progInstance = this.subPrograms.get(progId)?.instances.find(P => P.as === instanceName);
            if (progInstance) {
                return progInstance.prog;
            }
        }
        return undefined;
    }
    getProgramInstances(progName) {
        if (this.subPrograms.has(progName)) {
            const SP = this.subPrograms.get(progName);
            return SP ? {
                program: SP.description,
                instances: SP.instances.map(instance => instance.prog)
            } : undefined;
        }
        return undefined;
    }
    unplugSubProgramInstance(instanceName) {
        for (let progId of this.subPrograms.keys()) {
            const SPD = this.subPrograms.get(progId);
            const progInstance = SPD?.instances.find(P => P.as === instanceName);
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
            this.subPrograms.get(programId)?.instances.forEach(P => P.prog.dispose());
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
    getStateContextNamed(name) {
        if (name === '') {
            return this.getRootContext();
        }
        else {
            const L = [];
            const nexts = [this.rootContext];
            while (nexts.length > 0) {
                const [next] = nexts.splice(0, 1);
                if (L.indexOf(next) === -1) {
                    L.push(next);
                    next.getParentOfAllenRelationships().forEach(r => r.getChildren().filter(c => c.getType() === 'CCBLContextState').forEach(c => nexts.push(c)));
                }
            }
            return L.find(c => c.getContextName() === name);
        }
    }
    plugSubProgramAs(config) {
        const { programId, as: asProgramId, mapInputs = {}, hostContextName, allen } = config;
        const hostContext = typeof hostContextName === "string" ? this.getStateContextNamed(hostContextName) : hostContextName;
        if (!hostContext) {
            throw `There is no host context identified by "${hostContextName}"`;
        }
        if (!this.subPrograms.has(programId)) {
            throw `There is no sub-program identified by "${programId}"`;
        }
        const { description: subProgamDescription, instances: subProgramInstances } = this.subPrograms.get(programId) ?? { description: {}, instances: [] };
        const subprog = new CCBLProgramObject(asProgramId, this.getClock());
        subprog.loadHumanReadableProgram(subProgamDescription, this.getEnvironment(), mapInputs);
        subprog.activate(true);
        const progVar = {};
        this.environment.registerProgInstance(asProgramId, progVar);
        subProgramInstances.push({ as: asProgramId, mapInputs, prog: subprog, progVar });
        const jsonAllen = {
            type: getAllenTypeName(allen),
            children: []
        };
        const allenRel = Unserialize(jsonAllen, emptyEnvExec);
        hostContext.appendParentOfAllenRelationships(allenRel);
        allenRel.appendChildren(subprog.getRootContext());
        subprog.parentProgram = this;
        function registerSubProgAtt(att, ve) {
            progVar[att] = ve;
        }
        const progName = config.as;
        const channelName = `${progName}.isOn`;
        this.localSubProgChannelsId.push(channelName);
        this.createLocalChannels({ name: channelName, type: "boolean", channel: subprog.getRootChannel() });
        registerSubProgAtt('isOn', subprog.getRootChannel().getValueEmitter());
        subprog.outputChannelsId.forEach(id => {
            const { name: chanName, channel, type } = subprog.getChannelDescription(id);
            this.createLocalChannels({ name: `${progName}.${chanName}`, type, channel });
            registerSubProgAtt(chanName, channel.getValueEmitter());
        });
        subprog.outputEmittersId.forEach(id => {
            const emitterDescr = subprog.getEmitterDescription(id);
            if (emitterDescr) {
                const { name: emitterName, type, emitter } = emitterDescr;
                this.createLocalEmitter({ name: `${progName}.${emitterName}`, type, emitter });
                registerSubProgAtt(emitterName, emitter);
            }
            else {
                const chanDescr = subprog.getChannelDescription(id);
                if (chanDescr) {
                    const { name: chanName, type, channel } = chanDescr;
                    this.createLocalEmitter({ name: `${progName}.${chanName}`, type, emitter: channel.getValueEmitter() });
                    registerSubProgAtt(chanName, channel.getValueEmitter());
                }
                else {
                    throw `SubProgram plug: There is no Emitter nor Channel identified by ${id}`;
                }
            }
        });
        subprog.outputEventersId.forEach(id => {
            const { name: eventerName, type, eventer } = subprog.getEventerDescription(id);
            this.createLocalEventer({ name: `${progName}.${eventerName}`, type, eventer });
        });
        this.updateStructuralOrder();
        return subprog;
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
                        return copyProgRef({
                            programId: instance.programClassName,
                            as: rootOfProgramId,
                            mapInputs: instance.mapInputs
                        });
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
            const LevtIds = [...this.inputEventersId, ...this.outputEventersId];
            const eventSource = LevtIds.find(id => this.localEventers.get(id)?.eventer === context.event);
            const eventContext = {
                type: "EVENT",
                contextName: context.getContextName(),
                eventSource: eventSource || context.event.getEventerSourceId() || context.event.getEventName() || "",
                actions: context.getChannelActions().map(actionToHumanReadable),
                ccblContext: context
            };
            if (context.event.getGuardExpression()) {
                eventContext.eventFilter = context.event.getGuardExpression();
            }
            if (context.event.getEventExpression()) {
                eventContext.eventExpression = context.event.getEventExpression();
            }
            return eventContext;
        };
        const eventTriggerToHumanReadable = evt => {
            const eventTrigger = !evt ? undefined : {
                eventName: evt.getEventName(),
                eventSource: evt.getEventerSourceId() || ""
            };
            if (evt && eventTrigger && evt.getGuardExpression()) {
                eventTrigger.eventFilter = evt.getGuardExpression();
            }
            if (evt && eventTrigger && evt.getEventExpression()) {
                eventTrigger.eventExpression = evt.getEventExpression();
            }
            return eventTrigger;
        };
        const stateContextToHumanReadable = context => {
            function getMeetChain(cStart) {
                const L = [];
                let next = cStart;
                while (next && L.indexOf(next) === -1) {
                    L.push(next);
                    const rels = next.getParentOfAllenRelationships().filter(r => r.getAllenType() === AllenType.Meet);
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
                    case AllenType.During:
                        relationships.During = relationships.During || [];
                        relationships.During.push(...rel.getChildren().map(contextToHumanReadable));
                        break;
                    case AllenType.Meet:
                        relationships.Meet = relationships.Meet || { contextsSequence: [], loop: 0 };
                        const res = getMeetChain(context);
                        const rels = res.L.map(c => c.getParentOfAllenRelationships().filter(r => r.getAllenType() === AllenType.Meet));
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
                    case AllenType.StartWith:
                        relationships.StartWith = relationships.StartWith || [];
                        relationships.StartWith.push(...rel.getChildren().map(contextToHumanReadable));
                        break;
                    case AllenType.EndWith:
                        relationships.EndWith = relationships.EndWith || [];
                        relationships.EndWith.push(...rel.getChildren().map(contextToHumanReadable));
                        break;
                    default:
                        throw `Unknown allen type "${getAllenTypeName(rel.getAllenType())}"`;
                }
            });
            const R = {
                type: "STATE",
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
            return R;
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
            subPrograms,
            ccblContext: this.getRootContext()
        };
        return hrp;
    }
    getHumanReadableDescription() {
        return this.humanReadableDescription;
    }
    loadHumanReadableProgram(descr, env, mapInputs) {
        this.activate(false);
        this.subPrograms.forEach(sp => {
            sp.instances.forEach(pi => {
                this.environment.unregisterProgInstance(pi.as);
                pi.prog.dispose();
            });
        });
        this.bindedEmittersAndEvents.forEach(e => e.dispose());
        this.subPrograms.clear();
        for (const id of this.localChannels.keys()) {
            this.environment.unregister_Channel(id);
        }
        const chanToBeDeleted = [...this.localChannels.keys()].filter(id => this.inputChannelsId.indexOf(id) === -1);
        for (const chanId of chanToBeDeleted) {
            const chan = this.localChannels.get(chanId);
            this.localChannels.delete(chanId);
            chan.channel.dispose();
        }
        this.localChannelsId = [];
        this.inputChannelsId = [];
        this.outputChannelsId = [];
        this.localChannels.clear();
        const emitterToBeDeleted = [...this.localEmitters.keys()].filter(id => this.inputEmittersId.indexOf(id) === -1);
        for (const emId of emitterToBeDeleted) {
            const em = this.localEmitters.get(emId);
            if (em?.emitter) {
                this.environment.unregister_CCBLEmitterValue(em.name);
                em?.emitter.dispose();
            }
        }
        this.inputEmittersId.forEach(em => this.environment.unregister_CCBLEmitterValue(em));
        this.localEmitters.clear();
        this.inputEmittersId = [];
        this.outputEmittersId = [];
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
        const dependencies = descr.dependencies ?? {};
        const imports = dependencies.import ?? {};
        const channelsImport = imports.channels || [];
        const emittersImport = imports.emitters || [];
        const eventsImport = imports.events || [];
        const exports = dependencies.export || {};
        const channelsExport = exports.channels || [];
        const emittersExport = exports.emitters || [];
        const eventsExport = exports.events || [];
        const getChannel = name => {
            const mapInputName = mapInputs[name] === undefined ? name : mapInputs[name];
            if (typeof mapInputName === 'string') {
                return this.getChannel(mapInputName, env);
            }
            else {
                return undefined;
            }
        };
        const getEmitter = name => {
            const mapInputName = mapInputs[name] === undefined ? name : mapInputs[name];
            if (typeof mapInputName === 'string') {
                return this.getEmitter(mapInputName, env);
            }
            else {
                return undefined;
            }
        };
        const getEvent = name => {
            const mapInputName = mapInputs[name] === undefined ? name : mapInputs[name];
            if (typeof mapInputName === 'string') {
                return this.getEventer(mapInputName, env);
            }
            else {
                return undefined;
            }
        };
        channelsImport
            .map(({ name, type }) => ({ name, type, channel: getChannel(name) }))
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
            .map(({ name, type }) => ({ name, type, emitter: getEmitter(name) }))
            .filter(emitDescr => {
            const { name, emitter } = emitDescr;
            if (emitter) {
                return true;
            }
            else {
                const exprStr = mapInputs[name];
                const expr = new CCBLExpressionInExecutionEnvironment({ env, expression: exprStr !== undefined ? exprStr : name });
                expr.setIsAvailable(true).listen();
                const LVmissing = expr.variableNames.filter(v => !getChannel(v) && !getEmitter(v));
                if (LVmissing.length > 0) {
                    expr.dispose();
                    throw `Emitter "${name}" does not exist in imported environment (dependencies ${LVmissing.join(", ")}) (exprStr = ${exprStr})`;
                }
                else {
                    emitDescr.emitter = expr;
                    this.bindedEmittersAndEvents.push(expr);
                    return true;
                }
            }
        })
            .map(({ name, type, emitter }) => ({ name, type, emitter: emitter }))
            .forEach(emitDescr => {
            this.createLocalEmitter(emitDescr);
            this.inputEmittersId.push(emitDescr.name);
        });
        eventsImport
            .map(({ name, type }) => ({ name, type, eventer: getEvent(name) }))
            .filter(eventDescr => {
            const { name, eventer } = eventDescr;
            if (eventer) {
                return true;
            }
            else {
                const eventTrigger = mapInputs[name];
                if (eventTrigger.eventSource !== undefined) {
                    const evt = new CCBLEvent({
                        eventName: eventTrigger.eventName,
                        env,
                        expressionFilter: eventTrigger.eventFilter,
                        eventerSourceId: eventTrigger.eventSource,
                        eventExpression: eventTrigger.eventExpression
                    });
                    this.bindedEmittersAndEvents.push(evt);
                    evt.setIsAvailable(true);
                    eventDescr.eventer = evt;
                    return true;
                }
                else {
                    throw `Eventer "${name}" does not exist in imported environment`;
                }
            }
        })
            .map(({ name, type, eventer }) => ({ name, type, eventer: eventer }))
            .forEach(eventerDescr => {
            this.createLocalEventer(eventerDescr);
            this.inputEventersId.push(eventerDescr.name);
        });
        channelsExport
            .map(({ name, type }) => ({ name, type }))
            .forEach(chanDescr => {
            this.createLocalChannelsFromVars(chanDescr);
            this.outputChannelsId.push(chanDescr.name);
        });
        emittersExport
            .map(({ name, type }) => ({ name, type }))
            .forEach(emitDescr => {
            this.createLocalChannelsFromVars(emitDescr);
            this.outputEmittersId.push(emitDescr.name);
        });
        eventsExport
            .map(({ name, type }) => ({ name, type, eventer: undefined }))
            .forEach(eventerDescr => {
            this.createLocalEventerFromVars(eventerDescr);
            this.outputEventersId.push(eventerDescr.name);
        });
        const localChannels = descr.localChannels || [];
        localChannels.forEach(chanDescr => {
            this.localChannelsId.push(chanDescr.name);
            this.createLocalChannelsFromVars(chanDescr);
        });
        this.loadHumanReadableContextState({
            type: "STATE",
            contextName: "",
            state: "",
            actions: descr.actions,
            allen: descr.allen
        }, this.rootContext);
        descr.ccblContext = this.rootContext;
        this.updateStructuralOrder();
        this.recomputeAllChannelsForUpdate();
        return this;
    }
    updateStructuralOrder() {
        if (this.parentProgram) {
            this.parentProgram.updateStructuralOrder();
        }
        else {
            StructuralOrder(this.rootContext);
            UpdateChannelsActions();
        }
    }
    createLocalEmitter(...emitters) {
        const L = emitters.map(({ name, emitter, type }) => ({
            emitter: emitter || new CCBLEmitterValue(undefined),
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
            type: getAllenTypeName(allen),
            children: []
        };
        const allenRel = Unserialize(jsonAllen, emptyEnvExec);
        const progRef = descr;
        if (progRef.programId) {
            const SP = this.plugSubProgramAs({
                programId: progRef.programId,
                as: progRef.as,
                mapInputs: progRef.mapInputs ?? {},
                allen: allen,
                hostContextName: hostContext
            });
            SP.activate(false);
            hostContext.onActiveUpdated(a => SP.activate(a));
        }
        else {
            hostContext.appendParentOfAllenRelationships(allenRel);
            const context = this.loadHumanReadableContext(descr);
            allenRel.appendChildren(context);
        }
    }
    loadHumanReadableContext(descr) {
        const stateContext = descr;
        if (stateContext.type === "STATE") {
            return this.loadHumanReadableContextState(stateContext);
        }
        else {
            return this.loadHumanReadableContextevent(descr);
        }
    }
    loadHumanReadableContextevent(descr) {
        const eventerDescr = this.localEventers.get(descr.eventSource);
        let eventContext;
        if (eventerDescr) {
            let event;
            if (descr.eventFilter) {
                event = new CCBLEvent({
                    env: this.getEnvironment(),
                    eventName: "",
                    eventExpression: descr.eventExpression,
                    expressionFilter: descr.eventFilter,
                    eventerSourceId: descr.eventSource
                });
            }
            else {
                event = eventerDescr.eventer;
            }
            eventContext = new CCBLContextEvent(descr.contextName, event);
        }
        else {
            if (descr.eventExpression) {
                const event = new CCBLEvent({
                    ...descr,
                    env: this.getEnvironment(),
                    eventName: ""
                });
                eventContext = new CCBLContextEvent(descr.contextName, event);
            }
            else {
                const msg = `Error loading event context, name "${descr.eventSource}" is not an event source and there is no eventExpression`;
                console.error(msg, descr);
                throw msg;
            }
        }
        this.appendEventActions(eventContext, ...(descr.actions || []));
        descr.ccblContext = eventContext;
        return eventContext;
    }
    loadHumanReadableContextState(descr, context) {
        if (context === undefined) {
            const contextConfig = {
                environment: this.getEnvironment()
            };
            if (descr.state && descr.state.trim()) {
                contextConfig.state = new CCBLStateInExecutionEnvironment({ env: this.getEnvironment(), expression: descr.state, stateName: "" });
            }
            if (descr.eventStart) {
                contextConfig.eventStart = new CCBLEvent({
                    eventName: descr.eventStart.eventName,
                    env: this.getEnvironment(),
                    expressionFilter: descr.eventStart.eventFilter,
                    eventerSourceId: descr.eventStart.eventSource,
                    eventExpression: descr.eventStart.eventExpression
                });
            }
            if (descr.eventFinish) {
                contextConfig.eventFinish = new CCBLEvent({
                    eventName: descr.eventFinish.eventName,
                    env: this.getEnvironment(),
                    expressionFilter: descr.eventFinish.eventFilter,
                    eventerSourceId: descr.eventFinish.eventSource,
                    eventExpression: descr.eventFinish.eventExpression
                });
            }
            if (descr.state === undefined && descr.eventStart === undefined && descr.eventFinish === undefined) {
                contextConfig.state = new CCBLStateInExecutionEnvironment({ env: this.getEnvironment(), expression: "true", stateName: "" });
            }
            context = new CCBLContextState({ ...contextConfig, contextName: descr.contextName });
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
        StartWith.forEach(d => this.loadContextOrProgram(AllenType.StartWith, context, d));
        During.forEach(d => this.loadContextOrProgram(AllenType.During, context, d));
        EndWith.forEach(d => this.loadContextOrProgram(AllenType.EndWith, context, d));
        if (allens.Meet) {
            const { contextsSequence: LC, loop } = allens.Meet;
            const contexts = LC.map(d => this.loadHumanReadableContext(d));
            contexts.reduce((C, NC) => {
                const jsonAllen = {
                    type: getAllenTypeName(AllenType.Meet),
                    children: []
                };
                const allenRel = Unserialize(jsonAllen, emptyEnvExec);
                C.appendParentOfAllenRelationships(allenRel);
                allenRel.appendChildren(NC);
                return NC;
            }, context);
            if (loop !== undefined) {
                const index = Math.floor(loop % (contexts.length + 1));
                const jsonAllen = {
                    type: getAllenTypeName(AllenType.Meet),
                    children: []
                };
                const allenRel = Unserialize(jsonAllen, emptyEnvExec);
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
    createLocalChannelsFromVars(...vars) {
        const L = vars.map(({ name, type }) => {
            const channel = getNewChannel(undefined);
            this.bindedEmittersAndEvents.push(channel);
            return { channel, type, name };
        });
        return this.createLocalChannels(...L);
    }
    createLocalChannels(...channels) {
        channels.forEach(({ channel, type, name }) => {
            this.environment.register_Channel(name, channel);
            this.localChannels.set(name, { channel, type, name });
            registerChannel(channel);
        });
        return channels;
    }
    createLocalEventerFromVars(...vars) {
        const L = vars.map(({ name, type }) => {
            const eventer = new CCBLEvent({ eventName: name, env: this.getEnvironment() });
            this.bindedEmittersAndEvents.push(eventer);
            return { eventer, type, name };
        });
        return this.createLocalEventer(...L);
    }
    createLocalEventer(...eventers) {
        eventers.forEach(({ eventer, type, name }) => {
            this.environment.registerCCBLEvent(name, eventer);
            this.localEventers.set(name, { eventer, type, name });
        });
        return eventers;
    }
    getSubProgramIdentifiedBy(instanceName) {
        const progNames = this.subPrograms.keys();
        for (const progName of progNames) {
            const descr = this.subPrograms.get(progName);
            const instance = descr?.instances.find(inst => inst.as === instanceName);
            if (instance) {
                return {
                    ...instance,
                    programClassName: progName
                };
            }
        }
        return undefined;
    }
}
//# sourceMappingURL=ProgramObject.js.map