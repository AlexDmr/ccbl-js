"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelAction_1 = require("./ChannelAction");
const Channel_1 = require("./Channel");
const Serialiser_1 = require("./Serialiser");
const CCBLExpressionInExecutionEnvironment_1 = require("./CCBLExpressionInExecutionEnvironment");
const typeJSON = "ChannelActionEvent";
class ChannelActionEvent extends ChannelAction_1.ChannelAction {
    constructor(channel, env, expression) {
        super(channel);
        this.channel = channel;
        this.env = env;
        this.triggerable = false;
        this.exprInEnv = new CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment({
            env, expression, addedScope: ["value"]
        });
    }
    dispose() {
        this.channel.remove(this);
        this.exprInEnv.dispose();
        delete this.exprInEnv;
        super.dispose();
    }
    isChannelActionState() { return false; }
    isChannelActionEvent() { return true; }
    toJSON() {
        if (this.jsonDirty.get()) {
            this.jsonDirty.set(false);
            return this.lastJSON = Object.assign({}, super.toJSON(), { type: typeJSON, expression: this.exprInEnv.originalExpression });
        }
        else {
            return this.lastJSON;
        }
    }
    getContextEvent() {
        return this.contextEvent;
    }
    getValueGetter() {
        return this.exprInEnv;
    }
    applyTo(V) {
        return this.exprInEnv.forceEvaluationOnce({ value: V });
    }
    attachTo(context) {
        this.contextEvent = context;
        return super.attachTo(context);
    }
    activate(value = true) {
        if (value !== this.active) {
            this.active = value;
            if (value) {
                Channel_1.Activate(this);
            }
            else {
                Channel_1.Desactivate(this);
            }
        }
        return this;
    }
}
exports.ChannelActionEvent = ChannelActionEvent;
Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
    let { expression, channel: { id: id } } = json;
    let channel = env.get_Channel_FromId(id);
    return new ChannelActionEvent(channel, env, expression);
});
//# sourceMappingURL=ChannelActionEvent.js.map