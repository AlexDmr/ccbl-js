"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("./Clock");
const ProgramObject_1 = require("./ProgramObject");
const Channel_1 = require("./Channel");
const ProgramObjectInterface_1 = require("./ProgramObjectInterface");
const AllenInterface_1 = require("./AllenInterface");
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const EmitterValue_1 = require("./EmitterValue");
const progAvatar_1 = require("./testsProg/progAvatar");
const rootProg_1_1 = require("./testsProg/rootProg_1");
const rootProg_2_1 = require("./testsProg/rootProg_2");
const Event_1 = require("./Event");
const deepEqual = require("deep-equal");
const DomicubeUsage_1 = require("./testsProg/DomicubeUsage");
const EventInterpolation_1 = require("./testsProg/EventInterpolation");
const MultipleEvents_1 = require("./testsProg/MultipleEvents");
const MultipleTimers_1 = require("./testsProg/MultipleTimers");
const main_1 = require("./main");
main_1.initCCBL();
describe("ProgramObject: Loading of programs:", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const BobLocation = new EmitterValue_1.CCBLEmitterValue(undefined);
    const AliceLocation = new EmitterValue_1.CCBLEmitterValue(undefined);
    const AliceAvailable = new EmitterValue_1.CCBLEmitterValue(undefined);
    const lampAvatar = Channel_1.getNewChannel();
    sourceEnv.register_CCBLEmitterValue("BobLocation", BobLocation);
    sourceEnv.register_CCBLEmitterValue("AliceLocation", AliceLocation);
    sourceEnv.register_CCBLEmitterValue("AliceAvailable", AliceAvailable);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    it("Initiale values are OK for rootProg", () => {
        rootProg.loadHumanReadableProgram(rootProg_1_1.rootProgDescr_1, sourceEnv, {});
        rootProg.activate();
        Channel_1.commitStateActions();
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
        Channel_1.commitStateActions();
        expect(rootProg.getValue("BobAtHome")).toBe(true);
        expect(rootProg.getValue("AliceAtHome")).toBe(true);
        expect(rootProg.getValue("AliceAtBobHome")).toBe(false);
        expect(rootProg.getValue("AliceAvailable")).toBe(true);
    });
    it("Creating avatarProg in the context of rootProg", () => {
        rootProg.appendSubProgram("Avatar", progAvatar_1.AvatarProgDescr);
        Channel_1.commitStateActions();
        expect(rootProg.getValue("lampAvatar")).toEqual("off");
    });
    it("Plug avatarProg into rootProg", () => {
        rootProg.plugSubProgramAs({
            programId: "Avatar",
            as: "Avatar",
            mapInputs: {},
            allen: AllenInterface_1.AllenType.During,
            hostContextName: ""
        });
        Channel_1.commitStateActions();
        expect(lampAvatar.getValueEmitter().get()).toEqual("green");
    });
    it("should be possible to turn off the Avatar program => lamp should be off", () => {
        const chanAvatar = rootProg.getChannel("Avatar.isOn");
        expect(chanAvatar).toBeDefined();
        if (chanAvatar) {
            chanAvatar.getValueEmitter().set(false);
            Channel_1.commitStateActions();
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
        Channel_1.commitStateActions();
        expect(lampAvatar.getValueEmitter().get()).toEqual("green");
    });
});
describe("ProgramObject: progRoot2 all integrated:", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg2 = new ProgramObject_1.CCBLProgramObject("rootProg2", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const BobLocation = new EmitterValue_1.CCBLEmitterValue(undefined);
    const AliceLocation = new EmitterValue_1.CCBLEmitterValue(undefined);
    const AliceAvailable = new EmitterValue_1.CCBLEmitterValue(undefined);
    const lampAvatar = Channel_1.getNewChannel();
    const btToggleAvatarOnOff = new Event_1.CCBLEvent({
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
        rootProg2.loadHumanReadableProgram(rootProg_2_1.rootProgDescr_2, sourceEnv, {
            BobLocation: "BobLocationXXX",
            AliceLocation: "AliceLocationXXX",
            AliceAvailable: "AliceAvailableXXX",
            lampAvatar: "lampAvatarXXX",
            btToggleAvatarOnOff: "btToggleAvatarOnOffXXX"
        });
        rootProg2.activate();
        Channel_1.commitStateActions();
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
        Channel_1.commitStateActions();
        expect(rootProg2.getValue("BobAtHome")).toBe(true);
        expect(rootProg2.getValue("AliceAtHome")).toBe(true);
        expect(rootProg2.getValue("AliceAtBobHome")).toBe(false);
        expect(rootProg2.getValue("AliceAvailable")).toBe(true);
        expect(rootProg2.getValue("lampAvatar")).toEqual("green");
    });
    it("btToggleAvatarOnOff event should turn off AvatarAlice subprogram", () => {
        btToggleAvatarOnOff.trigger({ value: "press" });
        Channel_1.commitStateActions();
        expect(rootProg2.getValue("AvatarAlice.isOn")).toEqual(false);
        expect(rootProg2.getValue("lampAvatar")).toEqual("off");
    });
    it("btToggleAvatarOnOff event should turn on AvatarAlice subprogram", () => {
        btToggleAvatarOnOff.trigger({ value: "press" });
        Channel_1.commitStateActions();
        expect(rootProg2.getValue("AvatarAlice.isOn")).toEqual(true);
        expect(rootProg2.getValue("lampAvatar")).toEqual("green");
    });
});
describe("Serialization and deserialisztion to HumanReadableProgram is OK", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg3 = new ProgramObject_1.CCBLProgramObject("rootProg2", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const BobLocation = new EmitterValue_1.CCBLEmitterValue(undefined);
    const AliceLocation = new EmitterValue_1.CCBLEmitterValue(undefined);
    const AliceAvailable = new EmitterValue_1.CCBLEmitterValue(undefined);
    const lampAvatar = Channel_1.getNewChannel();
    const btToggleAvatarOnOff = new Event_1.CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_CCBLEmitterValue("BobLocation", BobLocation);
    sourceEnv.register_CCBLEmitterValue("AliceLocation", AliceLocation);
    sourceEnv.register_CCBLEmitterValue("AliceAvailable", AliceAvailable);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", btToggleAvatarOnOff);
    const rootProgDescr_2_copy = ProgramObjectInterface_1.copyHumanReadableProgram(rootProg_2_1.rootProgDescr_2);
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
        expect(ProgramObjectInterface_1.stateActionsEquivalents(originalActions, serializedActions)).toBe(true);
    });
    it("Allen are the same", () => {
        const originalAllens = rootProgDescr_2_copy.allen;
        const serializedAllens = progSerialization.allen;
        expect(ProgramObjectInterface_1.allenEquivalent(originalAllens, serializedAllens)).toBe(true);
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
        const equi = ProgramObjectInterface_1.progEquivalent(rootProgDescr_2_copy, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialisztion to HumanReadableProgram is OK", () => {
    const clock = new Clock_1.CCBLTestClock();
    const progDomicubePlus = new ProgramObject_1.CCBLProgramObject("domicubePlus", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    sourceEnv.register_CCBLEmitterValue("gyro", new EmitterValue_1.CCBLEmitterValue(undefined));
    sourceEnv.register_CCBLEmitterValue("acc", new EmitterValue_1.CCBLEmitterValue(undefined));
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", new Event_1.CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("resetVolume", new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("muteVolume", new Event_1.CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    DomicubeUsage_1.domicubePlus.dependencies.export = {
        channels: [],
        emitters: [],
        events: []
    };
    DomicubeUsage_1.domicubePlus.dependencies.import.channels = [];
    progDomicubePlus.loadHumanReadableProgram(DomicubeUsage_1.domicubePlus, sourceEnv, {});
    const progSerialization = progDomicubePlus.toHumanReadableProgram();
    it("domicubePlus actions OK", () => {
        const equi = ProgramObjectInterface_1.stateActionsEquivalents(DomicubeUsage_1.domicubePlus.actions, progSerialization.actions);
        expect(equi).toBe(true);
    });
    it("domicubePlus subPrograms OK", () => {
        const equi = ProgramObjectInterface_1.ProgramsEquivalents(DomicubeUsage_1.domicubePlus.subPrograms, progSerialization.subPrograms);
        expect(equi).toBe(true);
    });
    it("domicubePlus dependencies OK", () => {
        const equi = ProgramObjectInterface_1.DependenciesEquivalents(DomicubeUsage_1.domicubePlus.dependencies, progSerialization.dependencies);
        expect(equi).toBe(true);
    });
    it("domicubePlus human readable serialization deepEqual not OK", () => {
        const originalInputs = DomicubeUsage_1.domicubePlus;
        const serializedInputs = progSerialization;
        expect(deepEqual(originalInputs, serializedInputs)).toBe(false);
    });
    it("domicubePlus variablesEquivalents OK", () => {
        const equi = ProgramObjectInterface_1.variablesEquivalents(DomicubeUsage_1.domicubePlus.localChannels, progSerialization.localChannels);
        expect(equi).toBe(true);
    });
    it("domicubePlus allenEquivalent OK", () => {
        const equi = ProgramObjectInterface_1.allenEquivalent(DomicubeUsage_1.domicubePlus.allen, progSerialization.allen);
        expect(equi).toBe(true);
    });
    it("domicubePlus human readable serialization equivalence is OK", () => {
        const equi = ProgramObjectInterface_1.progEquivalent(DomicubeUsage_1.domicubePlus, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialisztion to EventInterpolation is OK", () => {
    const clock = new Clock_1.CCBLTestClock();
    const progEventInterpolation = new ProgramObject_1.CCBLProgramObject("EventInterpolation", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    sourceEnv.registerCCBLEvent("resetVolume", new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    progEventInterpolation.loadHumanReadableProgram(EventInterpolation_1.EventInterpolation, sourceEnv, {});
    const progSerialization = progEventInterpolation.toHumanReadableProgram();
    const originalProg = EventInterpolation_1.EventInterpolation;
    it("actions OK", () => {
        const equi = ProgramObjectInterface_1.stateActionsEquivalents(originalProg.actions, progSerialization.actions);
        expect(equi).toBe(true);
    });
    it("subPrograms OK", () => {
        const equi = ProgramObjectInterface_1.ProgramsEquivalents(originalProg.subPrograms, progSerialization.subPrograms);
        expect(equi).toBe(true);
    });
    it("dependencies OK", () => {
        const equi = ProgramObjectInterface_1.DependenciesEquivalents(originalProg.dependencies, progSerialization.dependencies);
        expect(equi).toBe(true);
    });
    it("variablesEquivalents OK", () => {
        const equi = ProgramObjectInterface_1.variablesEquivalents(originalProg.localChannels, progSerialization.localChannels);
        expect(equi).toBe(true);
    });
    it("allenEquivalent OK", () => {
        const equi = ProgramObjectInterface_1.allenEquivalent(originalProg.allen, progSerialization.allen);
        expect(equi).toBe(true);
    });
    it("human readable serialization equivalence is OK", () => {
        const equi = ProgramObjectInterface_1.progEquivalent(originalProg, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialiszation to MultipleEvents is OK", () => {
    const clock = new Clock_1.CCBLTestClock();
    const progMultipleEvents = new ProgramObject_1.CCBLProgramObject("progMultipleEvents", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    sourceEnv.registerCCBLEvent("resetVolume", new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("moreTest", new Event_1.CCBLEvent({
        eventName: "moreTest",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("muteVolume", new Event_1.CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    progMultipleEvents.loadHumanReadableProgram(MultipleEvents_1.MultipleEvents, sourceEnv, {});
    const progSerialization = progMultipleEvents.toHumanReadableProgram();
    const originalProg = MultipleEvents_1.MultipleEvents;
    it("actions OK", () => {
        const equi = ProgramObjectInterface_1.stateActionsEquivalents(originalProg.actions, progSerialization.actions);
        expect(equi).toBe(true);
    });
    it("subPrograms OK", () => {
        const equi = ProgramObjectInterface_1.ProgramsEquivalents(originalProg.subPrograms, progSerialization.subPrograms);
        expect(equi).toBe(true);
    });
    it("dependencies OK", () => {
        const equi = ProgramObjectInterface_1.DependenciesEquivalents(originalProg.dependencies, progSerialization.dependencies);
        expect(equi).toBe(true);
    });
    it("variablesEquivalents OK", () => {
        const equi = ProgramObjectInterface_1.variablesEquivalents(originalProg.localChannels, progSerialization.localChannels);
        expect(equi).toBe(true);
    });
    it("allenEquivalent OK", () => {
        const equi = ProgramObjectInterface_1.allenEquivalent(originalProg.allen, progSerialization.allen);
        expect(equi).toBe(true);
    });
    it("human readable serialization equivalence is OK", () => {
        const equi = ProgramObjectInterface_1.progEquivalent(originalProg, progSerialization);
        expect(equi).toBe(true);
    });
});
describe("Serialization and deserialiszation to Concurrency", () => {
    const clock = new Clock_1.CCBLTestClock();
    const progConcurrency = new ProgramObject_1.CCBLProgramObject("progConcurrency", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    sourceEnv.registerCCBLEvent("resetVolume", new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("moreTest", new Event_1.CCBLEvent({
        eventName: "moreTest",
        expressionFilter: "",
        env: sourceEnv
    }));
    sourceEnv.registerCCBLEvent("muteVolume", new Event_1.CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    }));
    progConcurrency.loadHumanReadableProgram(MultipleTimers_1.Concurrency, sourceEnv, {});
    const progSerialization = progConcurrency.toHumanReadableProgram();
    const originalProg = MultipleTimers_1.Concurrency;
    it("actions OK", () => {
        const equi = ProgramObjectInterface_1.stateActionsEquivalents(originalProg.actions, progSerialization.actions);
        expect(equi).toBe(true);
    });
    it("subPrograms OK", () => {
        const equi = ProgramObjectInterface_1.ProgramsEquivalents(originalProg.subPrograms, progSerialization.subPrograms);
        expect(equi).toBe(true);
    });
    it("dependencies OK", () => {
        const equi = ProgramObjectInterface_1.DependenciesEquivalents(originalProg.dependencies, progSerialization.dependencies);
        expect(equi).toBe(true);
    });
    it("variablesEquivalents OK", () => {
        const equi = ProgramObjectInterface_1.variablesEquivalents(originalProg.localChannels, progSerialization.localChannels);
        expect(equi).toBe(true);
    });
    it("allenEquivalent OK", () => {
        const equi = ProgramObjectInterface_1.allenEquivalent(originalProg.allen, progSerialization.allen);
        expect(equi).toBe(true);
    });
    it("human readable serialization equivalence is OK", () => {
        const equi = ProgramObjectInterface_1.progEquivalent(originalProg, progSerialization);
        expect(equi).toBe(true);
    });
});
//# sourceMappingURL=ProgramObject.spec.js.map