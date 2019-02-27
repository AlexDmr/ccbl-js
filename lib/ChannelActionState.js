"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConstraintValue_1 = require("./ConstraintValue");
const ChannelAction_1 = require("./ChannelAction");
const Channel_1 = require("./Channel");
const Serialiser_1 = require("./Serialiser");
const CCBLExpressionInExecutionEnvironment_1 = require("./CCBLExpressionInExecutionEnvironment");
const ChannelDependencies_1 = require("./ChannelDependencies");
const typeJSON = "ChannelActionState";
class ChannelActionState extends ChannelAction_1.ChannelAction {
    constructor(channel, env, value) {
        super(channel);
        this.channel = channel;
        this.env = env;
        if (value instanceof ConstraintValue_1.CCBLConstraintValue) {
            this.valueGetter = value;
        }
        else {
            if (value instanceof CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment) {
                this.valueGetter = value;
            }
            else {
                this.valueGetter = new CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment({ env, expression: value });
            }
            ChannelDependencies_1.updateDependencies(channel.getValueEmitter(), this.valueGetter, this.valueGetter.getAllDependencies());
        }
    }
    dispose() {
        if (!(this.valueGetter instanceof ConstraintValue_1.CCBLConstraintValue)) {
            ChannelDependencies_1.updateDependencies(this.channel.getValueEmitter(), this.valueGetter, []);
        }
        this.channel.remove(this);
        this.valueGetter.dispose();
        delete this.valueGetter;
        super.dispose();
    }
    getEnvironment() {
        return this.env;
    }
    toJSON() {
        if (this.jsonDirty.get()) {
            this.jsonDirty.set(false);
            return this.lastJSON = Object.assign(super.toJSON(), {
                available: this.isAvailable(),
                valueGetter: this.valueGetter.toJSON(),
                type: typeJSON,
                overhideValue: this.overhideValueGetter ? this.overhideValueGetter.get() : undefined
            });
        }
        else {
            return this.lastJSON;
        }
    }
    isAvailable() {
        let valueGetter = this.valueGetter;
        return this.channel.isAvailable()
            && valueGetter.isAvailable ? valueGetter.isAvailable() : true;
    }
    applyTo(V) {
        if (this.isValueGetterAConstraint()) {
            let constraint = this.valueGetter;
            return constraint.apply(V);
        }
        else {
            return this.getValueGetter().forceEvaluationOnce();
        }
    }
    overhideWith(expression) {
        if (this.overhideValueGetter) {
            this.overhideValueGetter.setExpression(expression);
        }
        else {
            this.overhideValueGetter = new CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment({ expression, env: this.env });
            if (this.active) {
                this.overhideValueGetter.listen(true);
            }
        }
        this.jsonDirty.set(true);
        return this;
    }
    getValueGetter() {
        return this.overhideValueGetter || this.valueGetter;
    }
    isValueGetterAConstraint() {
        return this.valueGetter instanceof ConstraintValue_1.CCBLConstraintValue;
    }
    isChannelActionState() { return true; }
    isChannelActionEvent() { return false; }
    attachTo(context) {
        return super.attachTo(context);
    }
    activate(value = true) {
        if (value !== this.active) {
            this.active = value;
            if (this.getValueGetter().listen) {
                this.getValueGetter().listen(this.active);
            }
            if (value) {
                Channel_1.Activate(this);
            }
            else {
                if (this.overhideValueGetter) {
                    this.overhideValueGetter.setExpression("");
                }
                this.overhideValueGetter = undefined;
                Channel_1.Desactivate(this);
            }
        }
        return this;
    }
}
exports.ChannelActionState = ChannelActionState;
Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
    let { channel: { id: channelId }, valueGetter: VG } = json;
    let channel = env.get_Channel_FromId(channelId);
    return new ChannelActionState(channel, env, Serialiser_1.Unserialize(VG, env));
});
//# sourceMappingURL=ChannelActionState.js.map