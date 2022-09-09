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
                    this.change.program.values.set("root", [m]);
                    for (const cb of this.change.program.Lcb) {
                        cb(m);
                    }
                    break;
                case "channel update":
                    this.change.channel.values.set(m.channelId, [m]);
                    for (const cb of this.change.channel.Lcb) {
                        cb(m);
                    }
                    break;
                case 'exported emitter update':
                    this.change.emitter.values.set(m.emitterId, [m]);
                    for (const cb of this.change.emitter.Lcb) {
                        cb(m);
                    }
                    break;
                case "context update":
                    this.change.context.values.set(m.contextId, [m]);
                    for (const cb of this.change.context.Lcb) {
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