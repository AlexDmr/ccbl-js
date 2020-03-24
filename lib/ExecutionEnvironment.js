"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContextOrders_1 = require("./ContextOrders");
class CCBLEnvironmentExecution {
    constructor(clock, contextOrder = ContextOrders_1.StructuralOrder) {
        this.clock = clock;
        this.contextOrder = contextOrder;
        this.mapCCBLEmitterValue = new Map();
        this.mapChannel = new Map();
        this.mapEvents = new Map();
        this.mapProgVar = new Map();
    }
    toJSON() {
        const res = {
            events: {},
            emitters: {},
            channels: {}
        };
        this.mapEvents.forEach((val, key) => res.events[key] = val.toJSON());
        this.mapCCBLEmitterValue.forEach((val, key) => res.emitters[key] = val.toJSON());
        this.mapChannel.forEach((val, key) => res.channels[key] = val.toJSON());
        return res;
    }
    get_Clock() {
        return this.clock;
    }
    set_Clock(clock) {
        this.clock = clock;
        console.error("WARNING: should implements clock changing for CCBLEnvironmentExecution");
        console.error("       : This imply to change clock reference to the programs using this environment...");
        return this;
    }
    unregisterCCBLEvent(id) {
        this.mapEvents.delete(id);
        return this;
    }
    registerCCBLEvent(id, ccblEvent) {
        if (this.isNameUsed(id)) {
            throw `Can not register CCBLEvent with the same identifier ${id}: 
            - ${ccblEvent}
            - ${this.mapEvents.get(id)}`;
        }
        else {
            this.mapEvents.set(id, ccblEvent);
        }
        return this;
    }
    getCCBLEvent(id) {
        return this.mapEvents.get(id);
    }
    unregister_CCBLEmitterValue(id) {
        this.mapCCBLEmitterValue.delete(id);
        return this;
    }
    register_CCBLEmitterValue(id, EV) {
        if (this.isNameUsed(id)) {
            throw `Can not register CCBLEmitterValue with the same identifier ${id}: 
            - ${EV}
            - ${this.mapCCBLEmitterValue.get(id)}`;
        }
        else {
            this.mapCCBLEmitterValue.set(id, EV);
        }
        return this;
    }
    get_CCBLEmitterValue_FromId(id) {
        return this.mapCCBLEmitterValue.get(id);
    }
    unregister_Channel(id) {
        this.mapChannel.delete(id);
        return this;
    }
    register_Channel(id, chan) {
        if (this.isNameUsed(id)) {
            throw `Can not register Channel with the same identifier ${id}: 
            - ${chan}
            - ${this.mapChannel.get(id)}`;
        }
        else {
            this.mapChannel.set(id, chan);
        }
        return this;
    }
    unregisterProgInstance(id) {
        this.mapProgVar.delete(id);
        return this;
    }
    registerProgInstance(id, progVar) {
        if (this.isNameUsed(id)) {
            throw `Can not register Channel with the same identifier ${id}: 
            - ${progVar}
            - ${this.mapProgVar.get(id)}`;
        }
        else {
            this.mapProgVar.set(id, progVar);
        }
        return this;
    }
    getProgInstance(id) {
        return this.mapProgVar.get(id);
    }
    getAllProgramInstance() {
        const L = [];
        this.mapProgVar.forEach((progVar, id) => L.push({ id, progVar }));
        return L;
    }
    get_Channel_FromId(id) {
        return this.mapChannel.get(id);
    }
    getAllEmitterValues() {
        return Array.from(this.mapCCBLEmitterValue.values());
    }
    getAllChannels() {
        return Array.from(this.mapChannel.values());
    }
    getNameOfChannel(channel) {
        let chanName;
        this.mapChannel.forEach((chan, n) => {
            if (chan === channel) {
                chanName = n;
            }
        });
        return chanName;
    }
    isNameUsed(id) {
        return this.mapCCBLEmitterValue.has(id) || this.mapChannel.has(id) || this.mapProgVar.has(id) || this.mapEvents.has(id);
    }
}
exports.CCBLEnvironmentExecution = CCBLEnvironmentExecution;
//# sourceMappingURL=ExecutionEnvironment.js.map