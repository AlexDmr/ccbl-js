import { CCBLTestClock } from "../../Clock";
import { CCBLEnvironmentExecution } from "../../ExecutionEnvironment";
import { CCBLEmitterValue } from "../../EmitterValue";
import { CCBLProgramObject } from "../../ProgramObject";
import { getNewChannel } from "../../Channel";
import { RootParentDescr_V2 } from "./ProgRootParent_v2";
import { CCBLEvent } from "../../Event";
describe("ProgramRootParent:", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const fakeClock = new CCBLEmitterValue(undefined);
    const hifiVolume = getNewChannel(undefined);
    const lampAvatar = getNewChannel(undefined);
    const lampSwitch = new CCBLEmitterValue(undefined);
    const hifiSwitch = new CCBLEmitterValue(undefined);
    const hifiLowButton = new CCBLEvent({
        eventName: "hifiLowButton",
        expressionFilter: "",
        env: sourceEnv
    });
    const hifiHighButton = new CCBLEvent({
        eventName: "hifiHighButton",
        expressionFilter: "",
        env: sourceEnv
    });
    const parentsHifiButton = new CCBLEvent({
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
        rootProg.loadHumanReadableProgram(RootParentDescr_V2, sourceEnv, {});
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