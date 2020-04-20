"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
class CCBLEventSeq extends Event_1.CCBLEvent {
    constructor(eventName = "SEQ", env, msDelay, fctAND) {
        super({ eventName, env });
        this.env = env;
        this.msDelay = msDelay;
        this.fctAND = fctAND;
        this.children = [];
        this.lastEvents = [];
        this.subscribeCB = (event) => {
            this.lastEvents.push(event);
            this.trimEvents();
        };
    }
    dispose() {
        this.remove(...this.children);
        this.children.forEach(evt => evt.dispose());
        super.dispose();
    }
    append(...eventNodes) {
        eventNodes.forEach(eventNode => {
            if (this.children.indexOf(eventNode) === -1) {
                eventNode.on(this.subscribeCB);
            }
            this.children.push(eventNode);
        });
        return this;
    }
    remove(...eventNodes) {
        eventNodes.forEach(eventNode => {
            let pos = this.children.indexOf(eventNode);
            if (pos !== -1) {
                this.children.splice(pos, 1)[0].off(this.subscribeCB);
            }
        });
        return this;
    }
    getNbEventsRegistered() {
        return this.lastEvents.length;
    }
    trimEvents() {
        let msNow = this.env.get_Clock().now();
        this.lastEvents = this.lastEvents.filter(evt => evt.ms + this.msDelay >= msNow).sort((e1, e2) => e1.ms - e2.ms);
        let events = this.lastEvents.slice();
        let consummedEvents = [];
        for (let c of this.children) {
            let pos = events.findIndex(evt => evt.source === c);
            if (pos >= 0) {
                consummedEvents.push(events.splice(0, pos + 1)[pos]);
            }
            else {
                return;
            }
        }
        this.trigger(this.fctAND(consummedEvents));
        consummedEvents.forEach(evt => {
            let pos = this.lastEvents.indexOf(evt);
            if (pos >= 0) {
                this.lastEvents.splice(pos, 1);
            }
        });
    }
}
exports.CCBLEventSeq = CCBLEventSeq;
//# sourceMappingURL=EventSeq.js.map