"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("./Clock");
const ProgramObject_1 = require("./ProgramObject");
const Channel_1 = require("./Channel");
const AllenInterface_1 = require("./AllenInterface");
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const EmitterValue_1 = require("./EmitterValue");
const progAvatar_1 = require("./testsProg/progAvatar");
const rootProg_1_1 = require("./testsProg/rootProg_1");
const rootProg_2_1 = require("./testsProg/rootProg_2");
const Event_1 = require("./Event");
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
        const chanAvatar = rootProg.getChannel("Avatar__isOn");
        expect(chanAvatar).toBeDefined();
        if (chanAvatar) {
            chanAvatar.getValueEmitter().set(false);
            Channel_1.commitStateActions();
            expect(lampAvatar.getValueEmitter().get()).toEqual("off");
        }
    });
    it("Should be possible to add a state action to turn on Avatar program", () => {
        rootProg.appendStateActions("", {
            channel: "Avatar__isOn",
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
        expect(rootProg2.getValue("AvatarAlice__isOn")).toEqual(true);
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
        expect(rootProg2.getValue("AvatarAlice__isOn")).toEqual(false);
        expect(rootProg2.getValue("lampAvatar")).toEqual("off");
    });
    it("btToggleAvatarOnOff event should turn on AvatarAlice subprogram", () => {
        btToggleAvatarOnOff.trigger({ value: "press" });
        Channel_1.commitStateActions();
        expect(rootProg2.getValue("AvatarAlice__isOn")).toEqual(true);
        expect(rootProg2.getValue("lampAvatar")).toEqual("green");
    });
});
//# sourceMappingURL=ProgramObject.spec.js.map