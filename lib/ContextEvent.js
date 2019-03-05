"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Context_1 = require("./Context");
const Serialiser_1 = require("./Serialiser");
const typeJSON = "CCBLContextEvent";
class CCBLContextEvent extends Context_1.CCBLContext {
    constructor(contextName, event) {
        super();
        this.event = event;
        this.contextName = contextName;
        this.actualCbJsonDirty = this.event.onJsonDirty(() => this.setJsonDirty());
    }
    dispose() {
        this.setActivable(false);
        this.event.offJsonDirty(this.actualCbJsonDirty);
        super.dispose();
    }
    toJSON() {
        return Object.assign(super.toJSON(), { type: typeJSON, event: this.event.toJSON(), activable: this.activable });
    }
    setActivable(value = true) {
        if (value !== this.activable) {
            super.setActivable(value);
            this.channelActions.forEach(a => a.activate(this.activable));
        }
        return this;
    }
}
exports.CCBLContextEvent = CCBLContextEvent;
function initContextEvent() {
    Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
        let { contextName, event: eventJSON } = json;
        let ccblContextEvent = new CCBLContextEvent(contextName, Serialiser_1.Unserialize(eventJSON, env));
        json.channelActions.forEach(actJSON => {
            ccblContextEvent.appendChannelActions(Serialiser_1.Unserialize(actJSON, env));
        });
        return ccblContextEvent;
    });
}
exports.initContextEvent = initContextEvent;
//# sourceMappingURL=ContextEvent.js.map