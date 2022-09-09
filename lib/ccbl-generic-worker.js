import { CCBLTestClock } from "./Clock";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLProgramObject } from "./ProgramObject";
import { initCCBL } from "./main";
import { getNewChannel } from "./Channel";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLEvent } from "./Event";
initCCBL();
const clock = new CCBLTestClock();
const ccblProg = new CCBLProgramObject("progHouse", clock);
const sourceEnv = new CCBLEnvironmentExecution(clock);
const mapChannels = new Map();
const mapEmitters = new Map();
const mapEventers = new Map();
let elements = ccblProg.getCcblElements();
let initialized = false;
export function initWorker(W) {
    if (initialized)
        return;
    initialized = true;
    console.log("ccbl-generic-worker::initWorker");
    W.subscribe((M) => {
        let response = undefined;
        try {
            switch (M.msg.type) {
                case "LoadRootProgram":
                    console.log("Thread::LoadRootProgram");
                    for (const id of mapChannels.keys()) {
                        const chan = mapChannels.get(id);
                        sourceEnv.unregister_Channel(id);
                        chan.dispose();
                    }
                    mapChannels.clear();
                    for (const id of mapEmitters.keys()) {
                        const em = mapEmitters.get(id);
                        sourceEnv.unregister_CCBLEmitterValue(id);
                        em.dispose();
                    }
                    mapEmitters.clear();
                    for (const id of mapEventers.keys()) {
                        const ev = mapEventers.get(id);
                        sourceEnv.unregisterCCBLEvent(id);
                        ev.dispose();
                    }
                    mapEventers.clear();
                    const prog = M.msg.program;
                    for (const C of prog.dependencies?.import?.channels ?? []) {
                        console.log("\t- creating channel", C.name);
                        const chan = getNewChannel(undefined);
                        mapChannels.set(C.name, chan);
                        sourceEnv.register_Channel(C.name, chan);
                    }
                    for (const E of prog.dependencies?.import?.emitters ?? []) {
                        console.log("\t- creating emitter", E.name);
                        const em = new CCBLEmitterValue(undefined);
                        mapEmitters.set(E.name, em);
                        sourceEnv.register_CCBLEmitterValue(E.name, em);
                    }
                    for (const EV of prog.dependencies?.import?.events ?? []) {
                        console.log("\t- creating eventer", EV.name);
                        const ev = new CCBLEvent({ eventName: EV.name, env: sourceEnv });
                        mapEventers.set(EV.name, ev);
                        sourceEnv.registerCCBLEvent(EV.name, ev);
                    }
                    ccblProg.loadHumanReadableProgram(prog, sourceEnv, {});
                    for (const C of [...(prog.dependencies?.import?.channels ?? []), ...(prog.dependencies?.export?.channels ?? [])]) {
                        const chan = ccblProg.getChannel(C.name);
                        console.log("\t: subscribe to channel", C.name);
                        chan.getValueEmitter().on(v => {
                            console.log(C.name, "<-", v);
                            W.emit({
                                type: "ok",
                                idMsg: -1,
                                res: {
                                    type: "channel update",
                                    channelId: C.name,
                                    channelValue: JSON.stringify(v)
                                }
                            });
                        });
                    }
                    for (const E of prog.dependencies?.export?.emitters ?? []) {
                        const em = ccblProg.getEmitter(E.name);
                        console.log("\t: subscribe to emitter", E.name);
                        em.on(v => {
                            console.log(E.name, "->", v);
                            W.emit({
                                type: "ok",
                                idMsg: -1,
                                res: {
                                    type: "exported emitter update",
                                    emitterId: E.name,
                                    emitterValue: JSON.stringify(v)
                                }
                            });
                        });
                    }
                    for (const EV of prog.dependencies?.export?.events ?? []) {
                        const ev = ccblProg.getEventer(EV.name);
                        console.log("\t: subscribe to eventer", EV.name);
                        ev.on(v => {
                            console.log(EV.name, "->", v);
                            W.emit({
                                type: "ok",
                                idMsg: -1,
                                res: {
                                    type: "exported eventer update",
                                    eventerId: EV.name,
                                    eventerValue: JSON.stringify(v)
                                }
                            });
                        });
                    }
                    elements = ccblProg.getCcblElements();
                    for (const ctxt of Object.values(elements.stateContexts)) {
                        ctxt.onActiveUpdated(a => {
                            console.log(`${ctxt.id} (named "${ctxt.getContextName()}") becomes ${a ? 'active' : 'inactive'}`);
                            W.emit({
                                type: "ok",
                                idMsg: -1,
                                res: {
                                    type: "context update",
                                    contextId: ctxt.id,
                                    active: a
                                }
                            });
                        });
                    }
                    for (const act of Object.values(elements.stateActions)) {
                        const f = () => {
                            const activated = act.getIsActivated().get();
                            const overrided = act.getOverrideExpression();
                            const str = overrided !== undefined ? `overrided with "${overrided}"` : "";
                            console.log(`action ${act.id} ${activated ? '' : 'in'}activated ${str}`);
                            const update = {
                                type: "action update",
                                actionId: act.id,
                                active: activated,
                                overrided: overrided
                            };
                            W.emit({ type: "ok", idMsg: -1, res: update });
                        };
                        act.getIsActivated().on(f);
                        act.onOverride(f);
                    }
                    response = {
                        type: "program update",
                        program: ccblProg.toHumanReadableProgram(),
                        subProgramInstances: Object.keys(elements.subProgramInstances),
                        stateContexts: Object.keys(elements.stateContexts),
                        eventContexts: Object.keys(elements.eventContexts),
                        stateActions: Object.keys(elements.stateActions),
                        eventActions: Object.keys(elements.eventActions),
                    };
                    break;
                case "SIMULATION":
                    console.log("SIMULATION", M.msg.command);
                    ccblProg.activate(M.msg.command === "START");
                    if (M.msg.command === "START") {
                        clock.goto(Date.now());
                        ccblProg.UpdateChannelsActions();
                    }
                    break;
                case "emitterUpdate":
                    mapEmitters.get(M.msg.emitterId)?.set(M.msg.emitterValue);
                    break;
                default:
            }
            const R = {
                idMsg: M.idMsg,
                type: "ok",
                res: response
            };
            W.emit(R);
        }
        catch (err) {
            console.error(err);
            const R = {
                idMsg: M.idMsg,
                type: "error",
                res: `${err}`
            };
            W.emit(R);
        }
    });
}
//# sourceMappingURL=ccbl-generic-worker.js.map