"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const EmitterValue_1 = require("./EmitterValue");
const Channel_1 = require("./Channel");
const ContextOrders_1 = require("./ContextOrders");
const Serialiser_1 = require("./Serialiser");
const Z_Prog4_1 = require("./Z_Prog4");
const Z_Prog5_1 = require("./Z_Prog5");
const main_1 = require("./main");
main_1.initCCBL();
describe("Z_integration.spec.ts => Integration exo 4:", () => {
    it("Initiale values are OK when program starts", () => {
        Z_Prog4_1.initProgExo4Env();
        Z_Prog4_1.ProgExo4.setActivable(true);
        Z_Prog4_1.ProgExo4State.set(true);
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.ProgExo4.getActive()).toEqual(true);
        expect(Z_Prog4_1.AliceLocation.get()).toEqual("UNKNOWN");
        expect(Z_Prog4_1.MartinLocation.get()).toEqual("UNKNOWN");
        expect(Z_Prog4_1.AliceAvailability.get()).toEqual("Unavailable");
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Martin's and Alice at Martin's home => WHITE", () => {
        Z_Prog4_1.AliceLocation.set("Martin's Home");
        Z_Prog4_1.MartinLocation.set("Martin's Home");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("WHITE");
    });
    it("Alice outside => OFF", () => {
        Z_Prog4_1.AliceLocation.set("UNKNOWN");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => ORANGE", () => {
        Z_Prog4_1.AliceLocation.set("Alice's Home");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("ORANGE");
    });
    it("Alice becomes available => GREEN", () => {
        Z_Prog4_1.AliceAvailability.set("Available");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("GREEN");
    });
    it("Alice outside => OFF", () => {
        Z_Prog4_1.AliceLocation.set("UNKNOWN");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => GREEN", () => {
        Z_Prog4_1.AliceLocation.set("Alice's Home");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("GREEN");
    });
    it("Alice outside => OFF", () => {
        Z_Prog4_1.AliceLocation.set("UNKNOWN");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice unavailable => OFF", () => {
        Z_Prog4_1.AliceAvailability.set("Unavailable");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => ORANGE", () => {
        Z_Prog4_1.AliceLocation.set("Alice's Home");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("ORANGE");
    });
});
describe("Z_integration.spec.ts => Read / Write programs:", () => {
    let jsonProgExo4 = Z_Prog4_1.ProgExo4.toJSON();
    localStorage.setItem("ProgExo4", JSON.stringify(jsonProgExo4));
    let P4LoadedState = new EmitterValue_1.CCBLEmitterValue(false);
    it("ReInit environment", () => {
        Z_Prog4_1.initProgExo4Env();
        Z_Prog4_1.ProgExo4.setActivable(false);
        expect(Z_Prog4_1.ProgExo4.getActive()).toEqual(false);
    });
    it("P4 not active, so if Martin's and Alice at Martin's home => still OFF", () => {
        Z_Prog4_1.AliceLocation.set("Martin's Home");
        Z_Prog4_1.MartinLocation.set("Martin's Home");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Load program from string", () => {
        let P4LoadedJSON = JSON.parse(localStorage.getItem("ProgExo4"));
        let P4LoadedEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(Z_Prog4_1.clock).register_CCBLEmitterValue("ProgExo4State", P4LoadedState)
            .register_CCBLEmitterValue("AliceLocation", Z_Prog4_1.AliceLocation)
            .register_CCBLEmitterValue("AliceAvailability", Z_Prog4_1.AliceAvailability)
            .register_CCBLEmitterValue("MartinLocation", Z_Prog4_1.MartinLocation)
            .register_Channel("LAMP", Z_Prog4_1.LAMP_chan);
        let P4Loaded = Serialiser_1.Unserialize(P4LoadedJSON, P4LoadedEnv);
        ContextOrders_1.StructuralOrder(P4Loaded);
        expect(P4Loaded.getActive()).toEqual(false);
        expect(Z_Prog4_1.AliceLocation.get()).toEqual("Martin's Home");
        expect(Z_Prog4_1.MartinLocation.get()).toEqual("Martin's Home");
        expect(Z_Prog4_1.AliceAvailability.get()).toEqual("Unavailable");
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Initiale values are OK when program starts", () => {
        Z_Prog4_1.ProgExo4.setActivable(true);
        P4LoadedState.set(true);
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.ProgExo4.getActive()).toEqual(true);
        expect(Z_Prog4_1.AliceLocation.get()).toEqual("Martin's Home");
        expect(Z_Prog4_1.MartinLocation.get()).toEqual("Martin's Home");
        expect(Z_Prog4_1.AliceAvailability.get()).toEqual("Unavailable");
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("WHITE");
    });
    it("Alice outside => OFF", () => {
        Z_Prog4_1.AliceLocation.set("UNKNOWN");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice becomes available => still OFF", () => {
        Z_Prog4_1.AliceAvailability.set("Available");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
    it("Alice at her home => GREEN", () => {
        Z_Prog4_1.AliceLocation.set("Alice's Home");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("GREEN");
    });
    it("Alice unavailable => ORANGE", () => {
        Z_Prog4_1.AliceAvailability.set("Unavailable");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("ORANGE");
    });
    it("Martin outside => OFF", () => {
        Z_Prog4_1.MartinLocation.set("UNKNOWN");
        Channel_1.commitStateActions();
        expect(Z_Prog4_1.LAMP_valueEmitter.get()).toEqual("OFF");
    });
});
describe("Z_integration.spec.ts => Integration exo 5:", () => {
    it("Initiale values are OK when program starts", () => {
        Z_Prog5_1.initProgExo5Env();
        Z_Prog5_1.ProgExo5.setActivable(true);
        Z_Prog5_1.ProgExo5State.set(true);
        Channel_1.commitStateActions();
        expect(Z_Prog5_1.ProgExo5.getActive()).toEqual(true);
        expect(Z_Prog5_1.TV_volume.valueEmitter.get()).toEqual(50);
        expect(Z_Prog5_1.TV_channel.valueEmitter.get()).toEqual(1);
    });
    it("TV channel can be lower to -2 when not phoning", () => {
        Z_Prog5_1.TV_evtChanM.trigger({ value: true });
        Z_Prog5_1.TV_evtChanM.trigger({ value: true });
        Z_Prog5_1.TV_evtChanM.trigger({ value: true });
        Channel_1.commitStateActions();
        expect(Z_Prog5_1.TV_channel.valueEmitter.get()).toEqual(-2);
    });
    it("Phoning turned on imply TV channel to be at least 0", () => {
        Z_Prog5_1.Phoning.set(true);
        Channel_1.commitStateActions();
        expect(Z_Prog5_1.TV_channel.valueEmitter.get()).toEqual(0);
    });
    it("Without any commit, TV channel remains >= 0 when pressing the decrease button", () => {
        Z_Prog5_1.TV_evtChanM.trigger({ value: true });
        Z_Prog5_1.TV_evtChanM.trigger({ value: true });
        Z_Prog5_1.TV_evtChanM.trigger({ value: true });
        expect(Z_Prog5_1.TV_channel.valueEmitter.get()).toEqual(0);
    });
    it("Without any commit, TV channel can be increased & decrease, ++- => 1", () => {
        Z_Prog5_1.TV_evtChanP.trigger({ value: true });
        Z_Prog5_1.TV_evtChanP.trigger({ value: true });
        Z_Prog5_1.TV_evtChanM.trigger({ value: true });
        expect(Z_Prog5_1.TV_channel.valueEmitter.get()).toEqual(1);
    });
    it("Volume is 30, Beta is 50", () => {
        expect(Z_Prog5_1.TV_volume.valueEmitter.get()).toEqual(30);
        expect(Z_Prog5_1.chanVarBeta.getValueEmitter().get()).toEqual(50);
    });
    it("30- => Volume is 20, Beta is 20", () => {
        for (let i = 0; i < 30; i++) {
            Z_Prog5_1.TV_evtVolM.trigger({ value: true });
        }
        Channel_1.commitStateActions();
        expect(Z_Prog5_1.TV_volume.valueEmitter.get()).toEqual(20);
        expect(Z_Prog5_1.chanVarBeta.getValueEmitter().get()).toEqual(20);
    });
});
//# sourceMappingURL=Z_integration.spec.js.map