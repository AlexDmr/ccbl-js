import { CCBLConstraintValue } from "./ConstraintValue";
import { ChannelAction } from "./ChannelAction";
import { Activate, Desactivate } from "./Channel";
import { registerUnserializer, Unserialize } from "./Serialiser";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
import { updateDependencies } from "./ChannelDependencies";
import { CCBLEmitterValue } from "./EmitterValue";
const typeJSON = "ChannelActionState";
export class ChannelActionState extends ChannelAction {
    constructor(channel, env, value) {
        super(channel);
        this.channel = channel;
        this.env = env;
        this.isOverridedVG = new CCBLEmitterValue(undefined);
        if (value instanceof CCBLConstraintValue) {
            this.valueGetter = value;
        }
        else {
            if (value instanceof CCBLExpressionInExecutionEnvironment) {
                this.valueGetter = value;
            }
            else {
                this.valueGetter = new CCBLExpressionInExecutionEnvironment({ env, expression: value });
            }
            updateDependencies(channel.getValueEmitter(), this.valueGetter, this.valueGetter.getAllDependencies());
        }
    }
    dispose() {
        if (!(this.valueGetter instanceof CCBLConstraintValue)) {
            updateDependencies(this.channel.getValueEmitter(), this.valueGetter, []);
        }
        this.channel.remove(this);
        this.valueGetter.dispose();
        super.dispose();
    }
    isOverrided() {
        return !!this.overrideValueGetter;
    }
    getOverrideExpression() {
        var _a;
        const V = (_a = this.overrideValueGetter) === null || _a === void 0 ? void 0 : _a.get();
        return V === undefined ? undefined : `${V}`;
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
            this.overrideValueGetter = new CCBLExpressionInExecutionEnvironment({ expression, env: this.env });
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
        return this.valueGetter instanceof CCBLConstraintValue;
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
                Activate(this);
            }
            else {
                if (this.overrideValueGetter) {
                    this.overrideValueGetter.setExpression("");
                }
                this.overrideValueGetter = undefined;
                Desactivate(this);
                this.isOverridedVG.set(undefined);
            }
        }
        return this;
    }
}
export function initChannelActionState() {
    registerUnserializer(typeJSON, ((json, env) => {
        let { channel: { id: channelId }, valueGetter: VG } = json;
        let channel = env.get_Channel_FromId(channelId);
        return new ChannelActionState(channel, env, Unserialize(VG, env));
    }));
}
//# sourceMappingURL=ChannelActionState.js.map