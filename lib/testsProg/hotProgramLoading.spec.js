import { AllenType } from "../AllenInterface";
import { getNewChannel } from "../Channel";
import { CCBLTestClock } from "../Clock";
import { CCBLEmitterValue } from "../EmitterValue";
import { CCBLEvent } from "../Event";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLProgramObject } from "../ProgramObject";
import { copyHumanReadableProgram, progEquivalent } from "../ProgramObjectInterface";
describe("hotLoading:: Initial loading and execution", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("progRoot", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const tempOutside = new CCBLEmitterValue(0);
    const mode = new CCBLEmitterValue('off');
    sourceEnv.register_CCBLEmitterValue("tempOutside", tempOutside);
    sourceEnv.register_CCBLEmitterValue("mode", mode);
    const Avatar = getNewChannel('red');
    const AvatarIntensity = getNewChannel(100);
    sourceEnv.register_Channel("Avatar", Avatar);
    sourceEnv.register_Channel("AvatarIntensity", AvatarIntensity);
    const evtBt = new CCBLEvent({
        eventName: "EvtMinus",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("bt", evtBt);
    const progDomus = {
        dependencies: {
            import: {
                channels: [
                    { name: "Avatar", type: "COLOR" },
                    { name: "AvatarIntensity", type: "number" },
                ],
                emitters: [
                    { name: "tempOutside", type: "number" },
                    { name: "mode", type: "string" },
                ],
                events: [
                    { name: "bt", type: "number" }
                ]
            }
        },
        localChannels: [
            { name: "nb", type: "number" }
        ],
        actions: [
            { channel: "nb", affectation: { value: "0" } }
        ],
        allen: {
            During: [
                { type: "STATE", contextName: "base", state: "not equal(mode, 'off')", actions: [
                        { channel: "Avatar", affectation: { value: "'black'" } }
                    ] },
                { type: "STATE", contextName: "subProgs" },
                { type: "STATE", contextName: "constraints", state: "equal(mode, 'secure')", actions: [
                        { channel: "AvatarIntensity", affectation: { type: "constraint", value: "min(value, 80)" } }
                    ] },
                { type: "EVENT", contextName: "evtBt", eventSource: "bt", actions: [
                        { channel: "nb", affectation: "nb + value" }
                    ] }
            ]
        }
    };
    const progExpe = {
        dependencies: {
            import: {
                channels: [
                    { name: "Avatar", type: "COLOR" },
                ]
            }
        },
        actions: [
            { channel: "Avatar", affectation: { value: "'EXPE'" } }
        ]
    };
    it("progDomus loading should be OK", () => {
        prog.loadHumanReadableProgram(progDomus, sourceEnv, {});
        const P = prog.toHumanReadableProgram();
        expect(progEquivalent(P, progDomus, false)).toBeTrue();
    });
    it("When started, we should have mode == 'off' and Avatar == 'red' and AvatarIntensity == 100 ", () => {
        prog.activate();
        prog.UpdateChannelsActions();
        expect(prog.getValue("Avatar")).toEqual("red");
        expect(prog.getValue("mode")).toEqual("off");
        expect(prog.getValue("AvatarIntensity")).toEqual(100);
    });
    it("mode <- 'secure', we should have mode == 'secure' and Avatar == 'black' and AvatarIntensity == 80 ", () => {
        mode.set('secure');
        prog.UpdateChannelsActions();
        expect(prog.getValue("Avatar")).toEqual("black");
        expect(prog.getValue("mode")).toEqual("secure");
        expect(prog.getValue("AvatarIntensity")).toEqual(80);
    });
    it("mode <- 'unsecure', we should have mode == 'unsecure' and Avatar == 'black' and AvatarIntensity == 100 ", () => {
        mode.set('unsecure');
        prog.UpdateChannelsActions();
        expect(prog.getValue("Avatar")).toEqual("black");
        expect(prog.getValue("mode")).toEqual("unsecure");
        expect(prog.getValue("AvatarIntensity")).toEqual(80);
    });
    it("should be able to increment nb to 1 when triggering bt event", () => {
        evtBt.trigger({ value: 1 });
        prog.UpdateChannelsActions();
        expect(prog.getValue("nb")).toEqual(1);
    });
    it("should be able to load and insert EXPE subprogram", () => {
        const copy = copyHumanReadableProgram(prog.toHumanReadableProgram());
        prog.appendSubProgram("EXPE", progExpe);
        copy.subPrograms = {
            EXPE: progExpe
        };
        expect(progEquivalent(copy, prog.toHumanReadableProgram(), true)).toBeTrue();
    });
    it("should be able to instanciate EXPE under context subProgs", () => {
        const copy = copyHumanReadableProgram(prog.toHumanReadableProgram());
        prog.plugSubProgramAs({
            programId: "EXPE",
            as: "expe",
            hostContextName: "subProgs",
            mapInputs: {},
            allen: AllenType.During
        });
        prog.UpdateChannelsActions();
        const SP = copy.allen.During[1];
        SP.allen = {
            During: [
                { programId: "EXPE", as: "expe" }
            ]
        };
        const P = prog.toHumanReadableProgram();
        expect(progEquivalent(copy, P, false)).withContext("prog equivalent").toBeTrue();
        expect(prog.getRootContext().getActive()).withContext("Programme still active").toBe(true);
        expect(prog.getValue("Avatar")).withContext("new prog set Avatar to 'EXPE'").toEqual("EXPE");
        expect(prog.getValue("nb")).withContext("nb keep the same value").toEqual(1);
    });
    it("should be able to unplug subprogram", () => {
        prog.unplugSubProgramInstance("expe");
        prog.UpdateChannelsActions();
        expect(prog.getValue("nb")).withContext("nb keep the same value 1").toEqual(1);
    });
});
//# sourceMappingURL=hotProgramLoading.spec.js.map