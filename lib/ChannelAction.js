"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelAction = void 0;
const EmitterValue_1 = require("./EmitterValue");
class ChannelAction {
    constructor(channel) {
        this.channel = channel;
        this.jsonDirty = new EmitterValue_1.CCBLEmitterValue(true);
        this.active = false;
        this.attaching = false;
        this.isActivated = new EmitterValue_1.CCBLEmitterValue(false);
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
        var _a, _b;
        return (_b = (_a = this.context) === null || _a === void 0 ? void 0 : _a.priority) !== null && _b !== void 0 ? _b : -1;
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
exports.ChannelAction = ChannelAction;
//# sourceMappingURL=ChannelAction.js.map