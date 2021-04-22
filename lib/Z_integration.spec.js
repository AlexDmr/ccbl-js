import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLEmitterValue } from "./EmitterValue";
import { commitStateActions } from "./Channel";
import { StructuralOrder } from "./ContextOrders";
import { Unserialize } from "./Serialiser";
import { ProgExo4, initProgExo4Env, clock, AliceLocation, MartinLocation, AliceAvailability, ProgExo4State, LAMP_valueEmitter, LAMP_chan } from "./Z_Prog4";
import { initProgExo5Env, ProgExo5State, ProgExo5, TV_volume, TV_channel, TV_evtChanM, TV_evtChanP, TV_evtVolM, Phoning, chanVarBeta } from "./Z_Prog5";
import { initCCBL } from "./main";
initCCBL();
describe("Z_integration.spec.ts => Integration exo 4:", () => {
    it("Initiale values are OK when program starts", () => {
        initProgExo4Env();
        ProgExo4.setActivable(true);
        ProgExo4State.set(true);
        commitStateActions();
        expect(ProgExo4.getActive()).toEqual(true);
        expect(AliceLocation.get()).toEqual("UNKNOWN");
        expect(MartinLocation.get()).toEqual("UNKNOWN");
        expect(AliceAvailability.get()).toEqual("Unavailable");
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Martin's and Alice at Martin's home => WHITE", () => {
        AliceLocation.set("Martin's Home");
        MartinLocation.set("Martin's Home");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("WHITE");
    });
    it("Alice outside => OFF", () => {
        AliceLocation.set("UNKNOWN");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => ORANGE", () => {
        AliceLocation.set("Alice's Home");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("ORANGE");
    });
    it("Alice becomes available => GREEN", () => {
        AliceAvailability.set("Available");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("GREEN");
    });
    it("Alice outside => OFF", () => {
        AliceLocation.set("UNKNOWN");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => GREEN", () => {
        AliceLocation.set("Alice's Home");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("GREEN");
    });
    it("Alice outside => OFF", () => {
        AliceLocation.set("UNKNOWN");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice unavailable => OFF", () => {
        AliceAvailability.set("Unavailable");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => ORANGE", () => {
        AliceLocation.set("Alice's Home");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("ORANGE");
    });
});
describe("Z_integration.spec.ts => Read / Write programs:", () => {
    let jsonProgExo4 = ProgExo4.toJSON();
    localStorage.setItem("ProgExo4", JSON.stringify(jsonProgExo4));
    let P4LoadedState = new CCBLEmitterValue(false);
    it("ReInit environment", () => {
        initProgExo4Env();
        ProgExo4.setActivable(false);
        expect(ProgExo4.getActive()).toEqual(false);
    });
    it("P4 not active, so if Martin's and Alice at Martin's home => still OFF", () => {
        AliceLocation.set("Martin's Home");
        MartinLocation.set("Martin's Home");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Load program from string", () => {
        var _a;
        let P4LoadedJSON = JSON.parse((_a = localStorage.getItem("ProgExo4")) !== null && _a !== void 0 ? _a : "{}");
        let P4LoadedEnv = new CCBLEnvironmentExecution(clock).register_CCBLEmitterValue("ProgExo4State", P4LoadedState)
            .register_CCBLEmitterValue("AliceLocation", AliceLocation)
            .register_CCBLEmitterValue("AliceAvailability", AliceAvailability)
            .register_CCBLEmitterValue("MartinLocation", MartinLocation)
            .register_Channel("LAMP", LAMP_chan);
        let P4Loaded = Unserialize(P4LoadedJSON, P4LoadedEnv);
        StructuralOrder(P4Loaded);
        expect(P4Loaded.getActive()).toEqual(false);
        expect(AliceLocation.get()).toEqual("Martin's Home");
        expect(MartinLocation.get()).toEqual("Martin's Home");
        expect(AliceAvailability.get()).toEqual("Unavailable");
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Initiale values are OK when program starts", () => {
        ProgExo4.setActivable(true);
        P4LoadedState.set(true);
        commitStateActions();
        expect(ProgExo4.getActive()).toEqual(true);
        expect(AliceLocation.get()).toEqual("Martin's Home");
        expect(MartinLocation.get()).toEqual("Martin's Home");
        expect(AliceAvailability.get()).toEqual("Unavailable");
        expect(LAMP_valueEmitter.get()).toEqual("WHITE");
    });
    it("Alice outside => OFF", () => {
        AliceLocation.set("UNKNOWN");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice becomes available => still OFF", () => {
        AliceAvailability.set("Available");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => GREEN", () => {
        AliceLocation.set("Alice's Home");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("GREEN");
    });
    it("Alice unavailable => ORANGE", () => {
        AliceAvailability.set("Unavailable");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("ORANGE");
    });
    it("Martin outside => OFF", () => {
        MartinLocation.set("UNKNOWN");
        commitStateActions();
        expect(LAMP_valueEmitter.get()).toEqual("OFF");
    });
});
describe("Z_integration.spec.ts => Integration exo 5:", () => {
    it("Initiale values are OK when program starts", () => {
        initProgExo5Env();
        ProgExo5.setActivable(true);
        ProgExo5State.set(true);
        commitStateActions();
        expect(ProgExo5.getActive()).toEqual(true);
        expect(TV_volume.valueEmitter.get()).toEqual(50);
        expect(TV_channel.valueEmitter.get()).toEqual(1);
    });
    it("TV channel can be lower to -2 when not phoning", () => {
        TV_evtChanM.trigger({ value: true });
        TV_evtChanM.trigger({ value: true });
        TV_evtChanM.trigger({ value: true });
        commitStateActions();
        expect(TV_channel.valueEmitter.get()).toEqual(-2);
    });
    it("Phoning turned on imply TV channel to be at least 0", () => {
        Phoning.set(true);
        commitStateActions();
        expect(TV_channel.valueEmitter.get()).toEqual(0);
    });
    it("Without any commit, TV channel remains >= 0 when pressing the decrease button", () => {
        TV_evtChanM.trigger({ value: true });
        TV_evtChanM.trigger({ value: true });
        TV_evtChanM.trigger({ value: true });
        expect(TV_channel.valueEmitter.get()).toEqual(0);
    });
    it("Without any commit, TV channel can be increased & decrease, ++- => 1", () => {
        TV_evtChanP.trigger({ value: true });
        TV_evtChanP.trigger({ value: true });
        TV_evtChanM.trigger({ value: true });
        expect(TV_channel.valueEmitter.get()).toEqual(1);
    });
    it("Volume is 30, Beta is 50", () => {
        expect(TV_volume.valueEmitter.get()).toEqual(30);
        expect(chanVarBeta.getValueEmitter().get()).toEqual(50);
    });
    it("30- => Volume is 20, Beta is 20", () => {
        for (let i = 0; i < 30; i++) {
            TV_evtVolM.trigger({ value: true });
        }
        commitStateActions();
        expect(TV_volume.valueEmitter.get()).toEqual(20);
        expect(chanVarBeta.getValueEmitter().get()).toEqual(20);
    });
});
//# sourceMappingURL=Z_integration.spec.js.map