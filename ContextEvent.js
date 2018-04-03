"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Context_1 = require("./Context");
const Serialiser_1 = require("./Serialiser");
const typeJSON = "CCBLContextEvent";
class CCBLContextEvent extends Context_1.CCBLContext {
    constructor(event) {
        super();
        this.event = event;
        this.event.onJsonDirty(() => this.setJsonDirty());
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
Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
    let { event: eventJSON } = json;
    let ccblContextEvent = new CCBLContextEvent(Serialiser_1.Unserialize(eventJSON, env));
    json.channelActions.forEach(actJSON => {
        ccblContextEvent.appendChannelActions(Serialiser_1.Unserialize(actJSON, env));
    });
    return ccblContextEvent;
});
//# sourceMappingURL=ContextEvent.js.map