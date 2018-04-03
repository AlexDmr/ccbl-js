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
    registerCCBLEvent(id, ccblEvent) {
        if (this.mapEvents.has(id)) {
            throw `Can not register two CCBLEvent with the same identifier ${id}: 
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
    register_CCBLEmitterValue(id, EV) {
        if (this.mapCCBLEmitterValue.has(id)) {
            throw `Can not register two CCBLEmitterValue with the same identifier ${id}: 
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
    register_Channel(id, chan) {
        if (this.mapChannel.has(id)) {
            throw `Can not register two Channel with the same identifier ${id}: 
            - ${chan}
            - ${this.mapChannel.get(id)}`;
        }
        else {
            this.mapChannel.set(id, chan);
        }
        return this;
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
}
exports.CCBLEnvironmentExecution = CCBLEnvironmentExecution;
//# sourceMappingURL=ExecutionEnvironment.js.map