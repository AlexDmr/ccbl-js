"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConstraintValue_1 = require("./ConstraintValue");
const ChannelAction_1 = require("./ChannelAction");
const Channel_1 = require("./Channel");
const Serialiser_1 = require("./Serialiser");
const CCBLExpressionInExecutionEnvironment_1 = require("./CCBLExpressionInExecutionEnvironment");
const ChannelDependencies_1 = require("./ChannelDependencies");
const EmitterValue_1 = require("./EmitterValue");
const typeJSON = "ChannelActionState";
class ChannelActionState extends ChannelAction_1.ChannelAction {
    constructor(channel, env, value) {
        super(channel);
        this.channel = channel;
        this.env = env;
        this.isOverridedVG = new EmitterValue_1.CCBLEmitterValue(undefined);
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
    isOverrided() {
        return !!this.overrideValueGetter;
    }
    getOverrideExpression() {
        const V = this.overrideValueGetter.get();
        return `${V}`;
    }
    onOverride(cb) {
        this.isOverridedVG.on(cb);
        return this;
    }
    offOverride(cb) {
        this.isOverridedVG.off(cb);
        return this;
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
                overhideValue: this.overrideValueGetter ? this.overrideValueGetter.get() : undefined
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
    overrideWith(expression) {
        if (this.overrideValueGetter) {
            this.overrideValueGetter.setExpression(expression);
        }
        else {
            this.overrideValueGetter = new CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment({ expression, env: this.env });
            if (this.active) {
                this.overrideValueGetter.listen(true);
            }
        }
        this.jsonDirty.set(true);
        this.isOverridedVG.set(expression);
        return this;
    }
    getValueGetter() {
        return this.overrideValueGetter || this.valueGetter;
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
                if (this.overrideValueGetter) {
                    this.overrideValueGetter.setExpression("");
                }
                this.overrideValueGetter = undefined;
                Channel_1.Desactivate(this);
                this.isOverridedVG.set(undefined);
            }
        }
        return this;
    }
}
exports.ChannelActionState = ChannelActionState;
function initChannelActionState() {
    Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
        let { channel: { id: channelId }, valueGetter: VG } = json;
        let channel = env.get_Channel_FromId(channelId);
        return new ChannelActionState(channel, env, Serialiser_1.Unserialize(VG, env));
    });
}
exports.initChannelActionState = initChannelActionState;
//# sourceMappingURL=ChannelActionState.js.map