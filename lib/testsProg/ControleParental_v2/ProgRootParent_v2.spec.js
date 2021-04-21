"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../../Clock");
const ExecutionEnvironment_1 = require("../../ExecutionEnvironment");
const EmitterValue_1 = require("../../EmitterValue");
const ProgramObject_1 = require("../../ProgramObject");
const Channel_1 = require("../../Channel");
const ProgRootParent_v2_1 = require("./ProgRootParent_v2");
const Event_1 = require("../../Event");
describe("ProgramRootParent:", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const fakeClock = new EmitterValue_1.CCBLEmitterValue(undefined);
    const hifiVolume = Channel_1.getNewChannel(undefined);
    const lampAvatar = Channel_1.getNewChannel(undefined);
    const lampSwitch = new EmitterValue_1.CCBLEmitterValue(undefined);
    const hifiSwitch = new EmitterValue_1.CCBLEmitterValue(undefined);
    const hifiLowButton = new Event_1.CCBLEvent({
        eventName: "hifiLowButton",
        expressionFilter: "",
        env: sourceEnv
    });
    const hifiHighButton = new Event_1.CCBLEvent({
        eventName: "hifiHighButton",
        expressionFilter: "",
        env: sourceEnv
    });
    const parentsHifiButton = new Event_1.CCBLEvent({
        eventName: "parentsHifiButton",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_CCBLEmitterValue("Clock", fakeClock);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.register_Channel("hifiVolume", hifiVolume);
    sourceEnv.register_CCBLEmitterValue("lampSwitch", lampSwitch);
    sourceEnv.register_CCBLEmitterValue("hifiSwitch", hifiSwitch);
    sourceEnv.registerCCBLEvent("hifiLowButton", hifiLowButton);
    sourceEnv.registerCCBLEvent("hifiHighButton", hifiHighButton);
    sourceEnv.registerCCBLEvent("parentsHifiButton", parentsHifiButton);
    it("[v2] rootProgParent : append and CouvreFeu test", () => {
        rootProg.loadHumanReadableProgram(ProgRootParent_v2_1.RootParentDescr_V2, sourceEnv, {});
        rootProg.activate();
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("Clock")).toBe(undefined);
        expect(rootProg.getValue("lampAvatar")).toEqual("off");
        expect(rootProg.getValue("hifiVolume")).toEqual(0);
        expect(rootProg.getValue("CouvreFeu")).toBe(undefined);
        expect(rootProg.getValue("hifiIsOn")).toBe(false);
        expect(rootProg.getValue("log")).toEqual("[parent]root");
        fakeClock.set(12);
        lampSwitch.set(true);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).toEqual("[parent]root");
        expect(rootProg.getValue("lampAvatar")).not.toEqual("off");
        fakeClock.set(23);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).toEqual("[parent]couvreFeu");
        expect(rootProg.getValue("lampAvatar")).toEqual("off");
        fakeClock.set(22);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).toEqual("[parent]couvreFeu");
        fakeClock.set(2);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).toEqual("[parent]root");
    });
    it("[v2] rootProgParent enfant volume buttons test", () => {
        rootProg.UpdateChannelsActions();
        fakeClock.set(12);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).not.toEqual("[parent]couvreFeu");
        expect(rootProg.getValue("hifiVolume")).toEqual(0);
        hifiSwitch.set(true);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(60);
        hifiLowButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(60);
        hifiLowButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
        hifiLowButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(40);
        hifiSwitch.set(false);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(0);
        hifiSwitch.set(true);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(60);
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(70);
    });
    it("When it is 20:00, then the music volume is limited to 50", () => {
        fakeClock.set(20);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).toEqual("[parent]etatSilencieux");
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).toEqual("[parent]etatSilencieux");
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
        hifiLowButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("log")).toEqual("[parent]etatSilencieux");
        expect(rootProg.getValue("hifiVolume")).toEqual(40);
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        hifiHighButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
    });
    it("when clock is 10, the constraint does not apply anymore => volume is 60 = 50 + 10 last overhide try", () => {
        fakeClock.set(10);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(60);
    });
    it("Volume -= 10 => 50", () => {
        hifiLowButton.trigger({ value: 'press' });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("hifiVolume")).toEqual(50);
    });
});
//# sourceMappingURL=ProgRootParent_v2.spec.js.map