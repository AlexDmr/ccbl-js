"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmitterValue_1 = require("./EmitterValue");
const mathjs = require("mathjs");
const Serialiser_1 = require("./Serialiser");
const ChannelDependencies_1 = require("./ChannelDependencies");
const scopeInterpolator = {
    waitEnd: (dt, v0, v1) => dt >= 1 ? v1 : v0,
    linear: (dt, v0, v1) => v0 + dt * (v1 - v0),
    easeInOut: (dt, v0, v1) => dt < 0.5 ? v0 + (v1 - v0) * 2 * dt * dt : v0 - (v1 - v0) / 2 * ((2 * dt - 1) * (2 * dt - 3) - 1)
};
const typeJSON = "CCBLExpressionInExecutionEnvironment";
class CCBLExpressionInExecutionEnvironment extends EmitterValue_1.CCBLEmitterValue {
    constructor(config) {
        super(undefined);
        this.listening = false;
        this.channelsToCheck = [];
        this.emitersToCheck = [];
        this.cbEmitterUpdated = () => this.evaluateExpression();
        this.env = config.env;
        this.setExpression(config.expression, config.addedScope);
        try {
            this.set(this.forceEvaluationOnce());
        }
        catch (err) {
            this.set(undefined);
        }
    }
    dispose() {
        this.setExpression("");
    }
    toJSON() {
        return Object.assign({}, super.toJSON(), { type: typeJSON, expression: this.getExpression() });
    }
    getErrorEvaluation() {
        return this.errorEvaluation;
    }
    getExpression() {
        return this.exprRootNode.toString();
    }
    setExpression(expression, scope = []) {
        this.emitersToCheck.forEach(({ name, emitter }) => emitter.off(this.cbEmitterUpdated));
        this.channelsToCheck.forEach(({ name, channel }) => channel.getValueEmitter().off(this.cbEmitterUpdated));
        try {
            this.exprRootNode = mathjs.parse(expression);
        }
        catch (err) {
            throw `CCBLExpressionInExecutionEnvironment: Error while parsing expression:\n${expression}\n=> ${err}`;
        }
        if (this.exprRootNode.type === "BlockNode") {
            const L = expression.split(";").map(str => str.trim());
            if (L.length === 4) {
                const [V0, V1, duration, interpolator] = L;
                this.exprInterpolation = { V0, V1, duration, interpolator, T0: undefined, dtFct: mathjs.compile("(ms - T0) / duration") };
            }
        }
        this.variableNames = this.exprRootNode.filter(node => node.isSymbolNode)
            .filter(node => node.name !== "true" && node.name !== "false")
            .filter(node => scope.indexOf(node.name) === -1)
            .map(s => s.name);
        this.emitersToCheck = this.variableNames.reduce((acc, name) => {
            const emitter = this.env.get_CCBLEmitterValue_FromId(name);
            if (emitter) {
                acc.push({ emitter, name });
            }
            return acc;
        }, []);
        this.channelsToCheck = this.variableNames.reduce((acc, name) => {
            const channel = this.env.get_Channel_FromId(name);
            if (channel) {
                acc.push({ channel, name });
            }
            return acc;
        }, []);
        this.listen(this.isListening());
        ChannelDependencies_1.updateDependencies(undefined, this, this.getAllDependencies());
        return this.getExpression();
    }
    listen(value = true) {
        this.listening = value;
        if (this.listening) {
            if (this.exprInterpolation) {
                this.exprInterpolation.T0 = this.exprInterpolation.T0 === undefined ? this.env.get_Clock().now() : this.exprInterpolation.T0;
                this.env.get_Clock().onChange(this.cbEmitterUpdated);
                const duration_value = mathjs.eval(this.exprInterpolation.duration, this.getScope());
                this.env.get_Clock().registerTimeForUpdate(this.exprInterpolation.T0 + duration_value);
            }
            this.cbEmitterUpdated();
            this.emitersToCheck.forEach(descr => descr.emitter.on(this.cbEmitterUpdated));
            this.channelsToCheck.forEach(descr => descr.channel.getValueEmitter().on(this.cbEmitterUpdated));
        }
        else {
            if (this.exprInterpolation) {
                this.exprInterpolation.T0 = undefined;
                this.env.get_Clock().offChange(this.cbEmitterUpdated);
            }
            this.emitersToCheck.forEach(descr => descr.emitter.off(this.cbEmitterUpdated));
            this.channelsToCheck.forEach(descr => descr.channel.getValueEmitter().off(this.cbEmitterUpdated));
        }
        return this;
    }
    isAvailable() {
        return this.emitersToCheck.reduce((acc, { emitter, name }) => acc && emitter.isAvailable(), true) && this.channelsToCheck.reduce((acc, { channel, name }) => acc && channel.isAvailable(), true);
    }
    isListening() {
        return this.listening;
    }
    on(cb) {
        super.on(cb);
        return this;
    }
    off(cb) {
        super.off(cb);
        return this;
    }
    instanciate(scope = {}) {
        if (this.exprInterpolation) {
            const { T0, V0, V1, duration, interpolator, dtFct } = this.exprInterpolation;
            const ms = this.env.get_Clock().now();
            const duration_value = mathjs.eval(duration, scope);
            const dt_value = dtFct.eval({ T0, ms, duration: duration_value });
            const V0_value = mathjs.eval(V0, scope);
            const V1_value = mathjs.eval(V1, scope);
            return `${V0_value}; ${V1_value}; ${dt_value}; ${interpolator}`;
        }
        else {
            return JSON.stringify(this.exprRootNode.eval(scope));
        }
    }
    forceEvaluationOnce(scope = {}) {
        this.emitersToCheck.forEach(descr => scope[descr.name] = descr.emitter.get());
        this.channelsToCheck.forEach(descr => scope[descr.name] = descr.channel.getValueEmitter().get());
        let res = undefined;
        try {
            if (this.exprInterpolation) {
                const { T0, V0, V1, duration, interpolator, dtFct } = this.exprInterpolation;
                const ms = this.env.get_Clock().now();
                const duration_value = mathjs.eval(duration, scope);
                const dt_value = dtFct.eval({ T0, ms, duration: duration_value });
                if (dt_value >= 1) {
                    res = mathjs.eval(V1, scope);
                    this.env.get_Clock().offChange(this.cbEmitterUpdated);
                }
                else {
                    const V0_value = mathjs.eval(V0, scope);
                    const V1_value = mathjs.eval(V1, scope);
                    res = mathjs.eval(`${interpolator} (${dt_value}, ${V0_value}, ${V1_value} )`, scopeInterpolator);
                }
            }
            else {
                res = this.exprRootNode.eval(scope);
            }
            this.errorEvaluation = undefined;
        }
        catch (err) {
            res = undefined;
            this.errorEvaluation = err.message;
        }
        return res;
    }
    getAllDependencies() {
        const channels = this.channelsToCheck.map(({ channel }) => channel.getValueEmitter());
        const emitters = this.emitersToCheck.map(({ emitter }) => emitter);
        return [...channels, ...emitters];
    }
    getChannelDependencies() {
        return this.channelsToCheck
            .map(({ channel }) => channel);
    }
    getScope(scope = {}) {
        this.emitersToCheck.forEach(descr => scope[descr.name] = descr.emitter.get());
        this.channelsToCheck.forEach(descr => scope[descr.name] = descr.channel.getValueEmitter().get());
        return scope;
    }
    evaluateExpression() {
        const newValue = this.forceEvaluationOnce();
        if (newValue !== this.get()) {
            this.set(newValue);
        }
    }
}
exports.CCBLExpressionInExecutionEnvironment = CCBLExpressionInExecutionEnvironment;
Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
    let { expression } = json;
    return new CCBLExpressionInExecutionEnvironment({ env, expression });
});
//# sourceMappingURL=CCBLExpressionInExecutionEnvironment.js.map