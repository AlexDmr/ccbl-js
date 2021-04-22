import { CCBLEmitterValue } from "./EmitterValue";
export class ChannelAction {
    constructor(channel) {
        this.channel = channel;
        this.jsonDirty = new CCBLEmitterValue(true);
        this.active = false;
        this.attaching = false;
        this.isActivated = new CCBLEmitterValue(false);
        this.cbEmitterChange = () => this.jsonDirty.set(true);
        this.channel.getValueEmitter().onAvailabilityChange(this.cbEmitterChange);
    }
    dispose() {
        this.channel.getValueEmitter().offAvailabilityChange(this.cbEmitterChange);
    }
    toJSON() {
        return {
            type: "ChannelAction",
            channel: this.channel.toJSON()
        };
    }
    getIsActivated() {
        return this.isActivated;
    }
    isChannelActionState() { return false; }
    isChannelActionEvent() { return false; }
    applyTo(V) { return V; }
    getChannel() {
        return this.channel;
    }
    getPriority() {
        return this.context?.priority ?? -1;
    }
    attachTo(context) {
        if (!this.attaching && context !== this.context) {
            this.attaching = true;
            if (this.context) {
                this.context.removeChannelActions(this);
            }
            this.context = context;
            this.attaching = false;
        }
        return this;
    }
    activate(value = true) {
        if (value !== this.active) {
            this.active = value;
        }
        return this;
    }
}
//# sourceMappingURL=ChannelAction.js.map