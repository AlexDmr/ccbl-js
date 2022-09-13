export class CCBLProgramWorker {
    constructor(W) {
        this.W = W;
        this.change = {
            program: { values: new Map(), Lcb: [] },
            channel: { values: new Map(), Lcb: [] },
            emitter: { values: new Map(), Lcb: [] },
            context: { values: new Map(), Lcb: [] },
            action: { values: new Map(), Lcb: [] },
        };
        W.addEventListener(m => {
            switch (m?.type) {
                case "program update":
                    console.log("program update");
                    this.change.program.values.set("root", m);
                    for (const cb of this.change.program.Lcb) {
                        cb(m);
                    }
                    break;
                case "channel update":
                    this.change.channel.values.set(m.channelId, m);
                    for (const cb of this.change.channel.Lcb) {
                        cb(m);
                    }
                    break;
                case 'exported emitter update':
                    this.change.emitter.values.set(m.emitterId, m);
                    for (const cb of this.change.emitter.Lcb) {
                        cb(m);
                    }
                    break;
                case "context update":
                    this.change.context.values.set(m.contextId, m);
                    for (const cb of this.change.context.Lcb) {
                        cb(m);
                    }
                    break;
                case "action update":
                    this.change.action.values.set(m.actionId, m);
                    for (const cb of this.change.action.Lcb) {
                        cb(m);
                    }
                    break;
                case undefined:
                    break;
                default:
                    console.error("unsupported message from thread:", m);
            }
        });
    }
    async loadHumanReadableProgram(program) {
        const res = await this.send({ type: "LoadRootProgram", program }, "promise");
        return res;
    }
    on(...[eventType, cb]) {
        const L = this.change[eventType].Lcb;
        if (!L.find(f => f === cb)) {
            L.push(cb);
            switch (eventType) {
                case "program":
                    const progUpdate = this.change[eventType].values.get("root") ?? {
                        type: "program update",
                        program: {},
                        subProgramInstances: [],
                        stateContexts: [],
                        eventContexts: [],
                        stateActions: [],
                        eventActions: []
                    };
                    cb(progUpdate);
                    break;
                case "action":
                    const actionsUpdate = {
                        type: "actions update",
                        list: []
                    };
                    for (const [actionsId, { active, overrided }] of this.change[eventType].values) {
                        actionsUpdate.list.push([actionsId, active, overrided]);
                    }
                    cb(actionsUpdate);
                    break;
                case "context":
                    const contextsUpdate = {
                        type: "contexts update",
                        list: []
                    };
                    for (const [contextId, { active }] of this.change[eventType].values) {
                        contextsUpdate.list.push([contextId, active]);
                    }
                    cb(contextsUpdate);
                    break;
                case "channel":
                    const channelsUpdate = {
                        type: "channels update",
                        list: []
                    };
                    for (const [channelId, { channelValue }] of this.change[eventType].values) {
                        channelsUpdate.list.push([channelId, channelValue]);
                    }
                    cb(channelsUpdate);
                    break;
                case "emitter":
                    const emittersUpdate = {
                        type: "exported emitters update",
                        list: []
                    };
                    for (const [emitterId, { emitterValue }] of this.change[eventType].values) {
                        emittersUpdate.list.push([emitterId, emitterValue]);
                    }
                    cb(emittersUpdate);
                    break;
                default:
                    throw `unknown eventType "${eventType}"`;
            }
        }
        return this;
    }
    off(...[eventType, cb]) {
        const L = this.change[eventType].Lcb;
        const pos = L.indexOf(cb);
        if (pos >= 0) {
            L.splice(pos, 1);
        }
        return this;
    }
    processMessage(msg) {
        return this.send(msg, "direct");
    }
    setEmitterValue(emitterId, emitterValue, mode) {
        return this.send({ type: "emitterUpdate", emitterId, emitterValue: JSON.stringify(emitterValue) }, mode);
    }
    activateSimulation(command, mode = "direct") {
        return this.send({ type: "SIMULATION", command }, mode);
    }
    send(payload, mode = "direct") {
        if (mode === "direct") {
            this.W.postMessage(payload);
            return this;
        }
        else {
            return this.W.promisePost(payload);
        }
    }
}
//# sourceMappingURL=ccbl-exec.js.map