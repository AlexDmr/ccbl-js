import { CCBLTestClock } from "./Clock";
import { CCBLProgramObject } from "./ProgramObject";
import { commitStateActions, getNewChannel } from "./Channel";
import { allenEquivalent, copyHumanReadableProgram, DependenciesEquivalents, progEquivalent, ProgramsEquivalents, stateActionsEquivalents, variablesEquivalents } from "./ProgramObjectInterface";
import { AllenType } from "./AllenInterface";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLEmitterValue } from "./EmitterValue";
import { AvatarProgDescr } from "./testsProg/progAvatar";
import { rootProgDescr_1 } from "./testsProg/rootProg_1";
import { rootProgDescr_2 } from "./testsProg/rootProg_2";
import { CCBLEvent } from "./Event";
import * as deepEqual from "deep-equal";
import { domicubePlus } from "./testsProg/DomicubeUsage";
import { EventInterpolation } from "./testsProg/EventInterpolation";
import { MultipleEvents } from "./testsProg/MultipleEvents";
import { Concurrency } from "./testsProg/MultipleTimers";
import { initCCBL } from "./main";
initCCBL();
describe("ProgramObject: Loading of programs:", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const BobLocation = new CCBLEmitterValue(undefined);
    const AliceLocation = new CCBLEmitterValue(undefined);
    const AliceAvailable = new CCBLEmitterValue(undefined);
    const lampAvatar = getNewChannel(undefined);
    sourceEnv.register_CCBLEmitterValue("BobLocation", BobLocation);
    sourceEnv.register_CCBLEmitterValue("AliceLocation", AliceLocation);
    sourceEnv.register_CCBLEmitterValue("AliceAvailable", AliceAvailable);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    it("Initiale values are OK for rootProg", () => {
        rootProg.loadHumanReadableProgram(rootProgDescr_1, sourceEnv, {});
        rootProg.activate();
        commitStateActions();
        expect(rootProg.getValue("BobAtHome")).toBe(false);
        expect(rootProg.getValue("AliceAtHome")).toBe(false);
        expect(rootProg.getValue("AliceAtBobHome")).toBe(false);
        expect(rootProg.getValue("AliceAvailable")).toBe(undefined);
        expect(rootProg.getValue("lampAvatar")).toEqual("off");
    });
    it("Values are correctly updated when Bob at home, Alice at home and available", () => {
        rootProg.getEmitter("BobLocation").set("Bob's home");
        rootProg.getEmitter("AliceLocation").set("Alice's home");
        rootProg.getEmitter("AliceAvailable").set(true);
        commitStateActions();
        expect(rootProg.getValue("BobAtHome")).toBe(true);
        expect(rootProg.getValue("AliceAtHome")).toBe(true);
        expect(rootProg.getValue("AliceAtBobHome")).toBe(false);
        expect(rootProg.getValue("AliceAvailable")).toBe(true);
    });
    it("Creating avatarProg in the context of rootProg", () => {
        rootProg.appendSubProgram("Avatar", AvatarProgDescr);
        commitStateActions();
        expect(rootProg.getValue("lampAvatar")).toEqual("off");
    });
    it("Plug avatarProg into rootProg", () => {
        rootProg.plugSubProgramAs({
            programId: "Avatar",
            as: "Avatar",
            mapInputs: {},
            allen: AllenType.During,
            hostContextName: ""
        });
        commitStateActions();
        expect(lampAvatar.getValueEmitter().get()).toEqual("green");
    });
    it("should be possible to turn off the Avatar program => lamp should be off", () => {
        const chanAvatar = rootProg.getChannel("Avatar.isOn");
        expect(chanAvatar).toBeDefined();
        if (chanAvatar) {
            chanAvatar.getValueEmitter().set(false);
            commitStateActions();
            expect(lampAvatar.getValueEmitter().get()).toEqual("off");
        }
    });
    it("Should be possible to add a state action to turn on Avatar program", () => {
        rootProg.appendStateActions(rootProg.getRootContext(), {
            channel: "Avatar.isOn",
            affectation: {
                type: "expression",
                value: "true"
            }
        });
        rootProg.activate(false);
        rootProg.activate(true);
        commitStateActions();
        expect(lampAvatar.getValueEmitter().get()).toEqual("green");
    });
});
describe("ProgramObject: progRoot2 all integrated:", () => {
    const clock = new CCBLTestClock();
    const rootProg2 = new CCBLProgramObject("rootProg2", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const BobLocation = new CCBLEmitterValue(undefined);
    const AliceLocation = new CCBLEmitterValue(undefined);
    const AliceAvailable = new CCBLEmitterValue(undefined);
    const lampAvatar = getNewChannel(undefined);
    const btToggleAvatarOnOff = new CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_CCBLEmitterValue("BobLocationXXX", BobLocation);
    sourceEnv.register_CCBLEmitterValue("AliceLocationXXX", AliceLocation);
    sourceEnv.register_CCBLEmitterValue("AliceAvailableXXX", AliceAvailable);
    sourceEnv.register_Channel("lampAvatarXXX", lampAvatar);
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOffXXX", btToggleAvatarOnOff);
    it("Initiale values are OK for rootProg2", () => {
        rootProg2.loadHumanReadableProgram(rootProgDescr_2, sourceEnv, {
            BobLocation: "BobLocationXXX",
            AliceLocation: "AliceLocationXXX",
            AliceAvailable: "AliceAvailableXXX",
            lampAvatar: "lampAvatarXXX",
            btToggleAvatarOnOff: "btToggleAvatarOnOffXXX"
        });
        rootProg2.activate();
        commitStateActions();
        expect(rootProg2.getValue("BobAtHome")).toBe(false);
        expect(rootProg2.getValue("AliceAtHome")).toBe(false);
        expect(rootProg2.getValue("AliceAtBobHome")).toBe(false);
        expect(rootProg2.getValue("AliceAvailable")).toBe(undefined);
        expect(rootProg2.getValue("lampAvatar")).toEqual("off");
        expect(rootProg2.getValue("AvatarAlice.isOn")).toEqual(true);
    });
    it("Values are correctly updated when Bob at home, Alice at home and available", () => {
        rootProg2.getEmitter("BobLocation").set("Bob's home");
        rootProg2.getEmitter("AliceLocation").set("Alice's home");
        rootProg2.getEmitter("AliceAvailable").set(true);
        commitStateActions();
        expect(rootProg2.getValue("BobAtHome")).toBe(true);
        expect(rootProg2.getValue("AliceAtHome")).toBe(true);
        expect(rootProg2.getValue("AliceAtBobHome")).toBe(false);
        expect(rootProg2.getValue("AliceAvailable")).toBe(true);
        expect(rootProg2.getValue("lampAvatar")).toEqual("green");
    });
    it("btToggleAvatarOnOff event should turn off AvatarAlice subprogram", () => {
        btToggleAvatarOnOff.trigger({ value: "press" });
        commitStateActions();
        expect(rootProg2.getValue("AvatarAlice.isOn")).toEqual(false);
        expect(rootProg2.getValue("lampAvatar")).toEqual("off");
    });
    it("btToggleAvatarOnOff event should turn on AvatarAlice subprogram", () => {
        btToggleAvatarOnOff.trigger({ value: "press" });
        commitStateActions();
        expect(rootProg2.getValue("AvatarAlice.isOn")).toEqual(true);
        expect(rootProg2.getValue("lampAvatar")).toEqual("green");
    });
});
describe("Serialization and deserialisztion to HumanReadableProgram is OK", () => {
    const clock = new CCBLTestClock();
    const rootProg3 = new CCBLProgramObject("rootProg2", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const BobLocation = new CCBLEmitterValue(undefined);
    const AliceLocation = new CCBLEmitterValue(undefined);
    const AliceAvailable = new CCBLEmitterValue(undefined);
    const lampAvatar = getNewChannel(undefined);
    const btToggleAvatarOnOff = new CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_CCBLEmitterValue("BobLocation", BobLocation);
    sourceEnv.register_CCBLEmitterValue("AliceLocation", AliceLocation);
    sourceEnv.register_CCBLEmitterValue("AliceAvailable", AliceAvailable);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", btToggleAvatarOnOff);
    const rootProgDescr_2_copy = copyHumanReadableProgram(rootProgDescr_2);
    rootProgDescr_2_copy.dependencies.export = {
        channels: [],
        emitters: [],
        events: []
    };
    rootProg3.loadHumanReadableProgram(rootProgDescr_2_copy, sourceEnv, {});
    const progSerialization = rootProg3.toHumanReadableProgram();
    it("Imports are the same", () => {
        const originalInputs = rootProgDescr_2_copy.dependencies.import;
        const serializedInputs = progSerialization.dependencies.import;
        expect(deepEqual(originalInputs, serializedInputs)).toBe(true);
    });
    it("Exports are the same", () => {
        const originalOutputs = rootProgDescr_2_copy.dependencies.export;
        const serializedOutputs = progSerialization.dependencies.export;
        expect(deepEqual(originalOutputs, serializedOutputs)).toBe(true);
    });
    it("Local channels are the same", () => {
        const originalLocals = rootProgDescr_2_copy.localChannels;
        const serializedLocals = progSerialization.localChannels;
        expect(deepEqual(originalLocals, serializedLocals)).toBe(true);
    });
    it("Actions are the same", () => {
        const originalActions = rootProgDescr_2_copy.actions;
        const serializedActions = progSerialization.actions;
        expect(stateActionsEquivalents(originalActions, serializedActions, false)).toBe(true);
    });
    it("Allen are the same", () => {
        const originalAllens = rootProgDescr_2_copy.allen;
        const serializedAllens = progSerialization.allen;
        expect(allenEquivalent(originalAllens, serializedAllens, false)).toBe(true);
    });
    it("Subprograms names are the same", () => {
        const originalSubProgs = Object.keys(rootProgDescr_2_copy.subPrograms);
        const serializedSubProgs = Object.keys(progSerialization.subPrograms);
        expect(deepEqual(originalSubProgs, serializedSubProgs)).toBe(true);
    });
    it("Subprograms values are the same", () => {
        const originalSubProgs = rootProgDescr_2_copy.subPrograms;
        const serializedSubProgs = progSerialization.subPrograms;
        expect(deepEqual(originalSubProgs, serializedSubProgs)).toBe(true);
    });
    it("human readable serialization equivalence", () => {
        const equi = progEquivalent(rootProgDescr_2_copy, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialisztion to HumanReadableProgram is OK", () => {
    const clock = new CCBLTestClock();
    const progDomicubePlus = new CCBLProgramObject("domicubePlus", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    sourceEnv.register_CCBLEmitterValue("gyro", new CCBLEmitterValue(undefined));
    sourceEnv.register_CCBLEmitterValue("acc", new CCBLEmitterValue(undefined));
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", new CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("resetVolume", new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("muteVolume", new CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    domicubePlus.dependencies.export = {
        channels: [],
        emitters: [],
        events: []
    };
    domicubePlus.dependencies.import.channels = [];
    progDomicubePlus.loadHumanReadableProgram(domicubePlus, sourceEnv, {});
    const progSerialization = progDomicubePlus.toHumanReadableProgram();
    it("domicubePlus actions OK", () => {
        const equi = stateActionsEquivalents(domicubePlus.actions, progSerialization.actions, false);
        expect(equi).toBe(true);
    });
    it("domicubePlus subPrograms OK", () => {
        const equi = ProgramsEquivalents(domicubePlus.subPrograms, progSerialization.subPrograms, false);
        expect(equi).toBe(true);
    });
    it("domicubePlus dependencies OK", () => {
        const equi = DependenciesEquivalents(domicubePlus.dependencies, progSerialization.dependencies);
        expect(equi).toBe(true);
    });
    it("domicubePlus human readable serialization deepEqual not OK", () => {
        const originalInputs = domicubePlus;
        const serializedInputs = progSerialization;
        expect(deepEqual(originalInputs, serializedInputs)).toBe(false);
    });
    it("domicubePlus variablesEquivalents OK", () => {
        const equi = variablesEquivalents(domicubePlus.localChannels, progSerialization.localChannels);
        expect(equi).toBe(true);
    });
    it("domicubePlus allenEquivalent OK", () => {
        const equi = allenEquivalent(domicubePlus.allen, progSerialization.allen, false);
        expect(equi).toBe(true);
    });
    it("domicubePlus human readable serialization equivalence is OK", () => {
        const equi = progEquivalent(domicubePlus, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialisztion to EventInterpolation is OK", () => {
    const clock = new CCBLTestClock();
    const progEventInterpolation = new CCBLProgramObject("EventInterpolation", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    sourceEnv.registerCCBLEvent("resetVolume", new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    progEventInterpolation.loadHumanReadableProgram(EventInterpolation, sourceEnv, {});
    const progSerialization = progEventInterpolation.toHumanReadableProgram();
    const originalProg = EventInterpolation;
    it("actions OK", () => {
        const equi = stateActionsEquivalents(originalProg.actions, progSerialization.actions, false);
        expect(equi).toBe(true);
    });
    it("subPrograms OK", () => {
        const equi = ProgramsEquivalents(originalProg.subPrograms, progSerialization.subPrograms, false);
        expect(equi).toBe(true);
    });
    it("dependencies OK", () => {
        const equi = DependenciesEquivalents(originalProg.dependencies, progSerialization.dependencies);
        expect(equi).toBe(true);
    });
    it("variablesEquivalents OK", () => {
        const equi = variablesEquivalents(originalProg.localChannels, progSerialization.localChannels);
        expect(equi).toBe(true);
    });
    it("allenEquivalent OK", () => {
        const equi = allenEquivalent(originalProg.allen, progSerialization.allen, false);
        expect(equi).toBe(true);
    });
    it("human readable serialization equivalence is OK", () => {
        const equi = progEquivalent(originalProg, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialiszation to MultipleEvents is OK", () => {
    const clock = new CCBLTestClock();
    const progMultipleEvents = new CCBLProgramObject("progMultipleEvents", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    sourceEnv.registerCCBLEvent("resetVolume", new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("moreTest", new CCBLEvent({
        eventName: "moreTest",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("muteVolume", new CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    progMultipleEvents.loadHumanReadableProgram(MultipleEvents, sourceEnv, {});
    const progSerialization = progMultipleEvents.toHumanReadableProgram();
    const originalProg = MultipleEvents;
    it("actions OK", () => {
        const equi = stateActionsEquivalents(originalProg.actions, progSerialization.actions, false);
        expect(equi).toBe(true);
    });
    it("subPrograms OK", () => {
        const equi = ProgramsEquivalents(originalProg.subPrograms, progSerialization.subPrograms, false);
        expect(equi).toBe(true);
    });
    it("dependencies OK", () => {
        const equi = DependenciesEquivalents(originalProg.dependencies, progSerialization.dependencies);
        expect(equi).toBe(true);
    });
    it("variablesEquivalents OK", () => {
        const equi = variablesEquivalents(originalProg.localChannels, progSerialization.localChannels);
        expect(equi).toBe(true);
    });
    it("allenEquivalent OK", () => {
        const equi = allenEquivalent(originalProg.allen, progSerialization.allen, false);
        expect(equi).toBe(true);
    });
    it("human readable serialization equivalence is OK", () => {
        const equi = progEquivalent(originalProg, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialiszation to Concurrency", () => {
    const clock = new CCBLTestClock();
    const progConcurrency = new CCBLProgramObject("progConcurrency", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    sourceEnv.registerCCBLEvent("resetVolume", new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("moreTest", new CCBLEvent({
        eventName: "moreTest",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("muteVolume", new CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    progConcurrency.loadHumanReadableProgram(Concurrency, sourceEnv, {});
    const progSerialization = progConcurrency.toHumanReadableProgram();
    const originalProg = Concurrency;
    it("actions OK", () => {
        const equi = stateActionsEquivalents(originalProg.actions, progSerialization.actions, false);
        expect(equi).toBe(true);
    });
    it("subPrograms OK", () => {
        var _a, _b;
        const equi = ProgramsEquivalents((_a = originalProg.subPrograms) !== null && _a !== void 0 ? _a : {}, (_b = progSerialization.subPrograms) !== null && _b !== void 0 ? _b : {}, false);
        expect(equi).toBe(true);
    });
    it("dependencies OK", () => {
        var _a, _b;
        const equi = DependenciesEquivalents((_a = originalProg.dependencies) !== null && _a !== void 0 ? _a : {}, (_b = progSerialization.dependencies) !== null && _b !== void 0 ? _b : {});
        expect(equi).toBe(true);
    });
    it("variablesEquivalents OK", () => {
        var _a, _b;
        const equi = variablesEquivalents((_a = originalProg.localChannels) !== null && _a !== void 0 ? _a : [], (_b = progSerialization.localChannels) !== null && _b !== void 0 ? _b : []);
        expect(equi).toBe(true);
    });
    it("allenEquivalent OK", () => {
        const equi = allenEquivalent(originalProg.allen, progSerialization.allen, false);
        expect(equi).toBe(true);
    });
    it("human readable serialization equivalence is OK", () => {
        const equi = progEquivalent(originalProg, progSerialization);
        expect(equi).toBe(true);
    });
});
//# sourceMappingURL=ProgramObject.spec.js.map