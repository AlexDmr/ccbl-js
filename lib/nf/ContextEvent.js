import { CCBLContext } from "./Context";
import { registerUnserializer, Unserialize } from "./Serialiser";
const typeJSON = "CCBLContextEvent";
export class CCBLContextEvent extends CCBLContext {
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
    getType() {
        return typeJSON;
    }
    setActivable(value = true) {
        if (value !== this.activable) {
            super.setActivable(value);
            this.channelActions.forEach(a => a.activate(this.activable));
        }
        return this;
    }
}
export function initContextEvent() {
    registerUnserializer(typeJSON, ((json, env) => {
        let { contextName, event: eventJSON } = json;
        let ccblContextEvent = new CCBLContextEvent(contextName, Unserialize(eventJSON, env));
        json.channelActions.forEach(actJSON => {
            ccblContextEvent.appendChannelActions(Unserialize(actJSON, env));
        });
        return ccblContextEvent;
    }));
}
//# sourceMappingURL=ContextEvent.js.map