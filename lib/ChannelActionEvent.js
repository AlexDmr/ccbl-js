import { ChannelAction } from "./ChannelAction";
import { Activate, Desactivate } from "./Channel";
import { registerUnserializer } from "./Serialiser";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
const typeJSON = "ChannelActionEvent";
export class ChannelActionEvent extends ChannelAction {
    constructor(channel, env, expression) {
        super(channel);
        this.channel = channel;
        this.env = env;
        this.triggerable = false;
        this.exprInEnv = new CCBLExpressionInExecutionEnvironment({
            env, expression, addedScope: ["value"]
        });
    }
    dispose() {
        this.channel.remove(this);
        this.exprInEnv.dispose();
        super.dispose();
    }
    isChannelActionState() { return false; }
    isChannelActionEvent() { return true; }
    toJSON() {
        if (this.jsonDirty.get()) {
            this.jsonDirty.set(false);
            return this.lastJSON = {
                ...super.toJSON(),
                type: typeJSON,
                expression: this.exprInEnv.originalExpression
            };
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
                Activate(this);
            }
            else {
                Desactivate(this);
            }
        }
        return this;
    }
}
export function initChannelActionEvent() {
    registerUnserializer(typeJSON, ((json, env) => {
        let { expression, channel: { id: id } } = json;
        let channel = env.get_Channel_FromId(id);
        return new ChannelActionEvent(channel, env, expression);
    }));
}
//# sourceMappingURL=ChannelActionEvent.js.map