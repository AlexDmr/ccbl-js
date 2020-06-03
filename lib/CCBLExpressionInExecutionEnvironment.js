"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmitterValue_1 = require("./EmitterValue");
const mathjs_1 = require("mathjs");
const Serialiser_1 = require("./Serialiser");
const ChannelDependencies_1 = require("./ChannelDependencies");
exports.scopeInterpolator = {
    waitEnd: (dt, v0, v1) => dt >= 1 ? v1 : v0,
    linear: (dt, v0, v1) => v0 + dt * (v1 - v0),
    easeInOut: (dt, v0, v1) => dt < 0.5 ? v0 + (v1 - v0) * 2 * dt * dt : v0 - (v1 - v0) / 2 * ((2 * dt - 1) * (2 * dt - 3) - 1)
};
const typeJSON = "CCBLExpressionInExecutionEnvironment";
exports.mathjs = mathjs_1.create(mathjs_1.all, {});
exports.mathjs.import({
    equal: (a, b) => a === b
}, { override: true });
class CCBLExpressionInExecutionEnvironment extends EmitterValue_1.CCBLEmitterValue {
    constructor(config) {
        super(undefined);
        this.listening = false;
        this.neverListenBefore = true;
        this.channelsToCheck = [];
        this.emitersToCheck = [];
        this.cbEmitterUpdated = () => this.evaluateExpression();
        this.env = config.env;
        this._originalExpression = config.expression;
        this.setExpression(config.expression, config.addedScope);
        try {
            this.set(this.forceEvaluationOnce({}, false));
        }
        catch (err) {
            this.set(undefined);
        }
    }
    dispose() {
        this.setExpression("");
        this.env.get_Clock().unregisterTimeForUpdate(this.nextUpdateTime);
        super.dispose();
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { type: typeJSON, expression: this.getExpression(), originalExpression: this._originalExpression });
    }
    getErrorEvaluation() {
        return this.errorEvaluation;
    }
    get originalExpression() {
        return this._originalExpression;
    }
    get variableNames() {
        return this._variableNames;
    }
    getExpression() {
        return this.exprRootNode.toString();
    }
    setExpression(expression, scope = []) {
        var _a;
        this.emitersToCheck.forEach(({ name, emitter }) => emitter.off(this.cbEmitterUpdated));
        this.channelsToCheck.forEach(({ name, channel }) => channel.getValueEmitter().off(this.cbEmitterUpdated));
        if (this.exprInterpolation) {
            (_a = this.exprInterpolation.exprDuration) === null || _a === void 0 ? void 0 : _a.dispose();
            this.exprInterpolation = undefined;
        }
        try {
            this.exprRootNode = exports.mathjs.parse(expression);
        }
        catch (err) {
            throw `CCBLExpressionInExecutionEnvironment: Error while parsing expression:\n${expression}\n=> ${err}`;
        }
        if (this.exprRootNode.type === "BlockNode") {
            const L = expression.split(";").map(str => str.trim());
            if (L.length === 4) {
                const [V0, V1, duration, interpolator] = L;
                const exprDuration = new CCBLExpressionInExecutionEnvironment({
                    env: this.env,
                    expression: duration
                });
                const cbExprTime = (t) => {
                    if (typeof t === 'number' && !isNaN(t)) {
                        if (this.nextUpdateTime !== undefined) {
                            this.env.get_Clock().unregisterTimeForUpdate(this.nextUpdateTime);
                        }
                        const TC = this.env.get_Clock().now();
                        const T1 = (this.exprInterpolation.T0 + t) || TC;
                        this.nextUpdateTime = Math.max(TC, T1);
                        this.env.get_Clock().registerTimeForUpdate(this.nextUpdateTime);
                    }
                };
                exprDuration.on(cbExprTime);
                this.exprInterpolation = {
                    V0, V1, duration, interpolator, T0: undefined,
                    dtFct: exports.mathjs.compile("(ms - T0) / duration"),
                    exprDuration,
                    cbExprTime
                };
            }
        }
        const LVobj = this.exprRootNode.filter(node => node.isAccessorNode).map(AN => {
            while (AN.object.isAccessorNode) {
                AN = AN.object;
            }
            return AN;
        });
        const LV = this.exprRootNode.filter(node => node.isSymbolNode)
            .filter(node => scope.indexOf(node.name) === -1)
            .filter(node => !LVobj.find(V => V.index.dotNotation && V.object === node));
        this._variableNames = [
            ...LV.map(V => V.name),
            ...LVobj.map(V => V.object.name),
            ...LVobj.map(V => `${V.object.name}.${V.index.dimensions[0].value}`)
        ];
        this.emitersToCheck = this._variableNames.reduce((acc, name) => {
            const emitter = this.env.get_CCBLEmitterValue_FromId(name);
            if (emitter && !acc.find(d => d.emitter === emitter)) {
                acc.push({ emitter, name });
            }
            return acc;
        }, []);
        this.channelsToCheck = this._variableNames.reduce((acc, name) => {
            const channel = this.env.get_Channel_FromId(name);
            if (channel && !acc.find(d => d.channel === channel)) {
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
            if (this.neverListenBefore) {
                this.neverListenBefore = false;
                this.setExpression(this.getExpression());
            }
            if (this.exprInterpolation) {
                this.exprInterpolation.exprDuration.listen();
                this.exprInterpolation.T0 = this.exprInterpolation.T0 === undefined ? this.env.get_Clock().now() : this.exprInterpolation.T0;
                this.env.get_Clock().onChange(this.cbEmitterUpdated);
                const duration_value = exports.mathjs.evaluate(this.exprInterpolation.duration, this.getScope());
                const nextUpdate = this.exprInterpolation.T0 + duration_value;
                if (this.nextUpdateTime !== nextUpdate) {
                    if (!isNaN(nextUpdate)) {
                        this.nextUpdateTime = nextUpdate;
                        this.env.get_Clock().registerTimeForUpdate(this.nextUpdateTime);
                    }
                }
            }
            this.cbEmitterUpdated();
            this.emitersToCheck.forEach(descr => descr.emitter.on(this.cbEmitterUpdated));
            this.channelsToCheck.forEach(descr => descr.channel.getValueEmitter().on(this.cbEmitterUpdated));
        }
        else {
            if (this.exprInterpolation) {
                this.exprInterpolation.T0 = undefined;
                this.exprInterpolation.exprDuration.listen(false);
                this.env.get_Clock().offChange(this.cbEmitterUpdated);
                this.env.get_Clock().unregisterTimeForUpdate(this.nextUpdateTime);
                this.nextUpdateTime = undefined;
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
        if (this.neverListenBefore) {
            this.neverListenBefore = false;
            this.setExpression(this.getExpression());
        }
        this.emitersToCheck.forEach(descr => scope[descr.name] = descr.emitter.get());
        this.channelsToCheck.forEach(descr => scope[descr.name] = descr.channel.getValueEmitter().get());
        this.env.getAllProgramInstance().forEach(({ id, progVar }) => {
            const obj = {};
            scope[id] = obj;
            for (const att of Object.keys(progVar)) {
                obj[att] = progVar[att].get();
            }
        });
        if (this.exprInterpolation) {
            const { V0, V1, duration, interpolator } = this.exprInterpolation;
            const duration_value = exports.mathjs.evaluate(duration, scope);
            const V0_value = exports.mathjs.evaluate(V0, scope);
            const V1_value = exports.mathjs.evaluate(V1, scope);
            return `${V0_value}; ${V1_value}; ${duration_value}; ${interpolator}`;
        }
        else {
            return JSON.stringify(this.exprRootNode.evaluate(scope));
        }
    }
    forceEvaluationOnce(addedScope = {}, logError = false) {
        let scope = {};
        this.emitersToCheck.forEach(descr => scope[descr.name] = descr.emitter.get());
        this.channelsToCheck.forEach(descr => scope[descr.name] = descr.channel.getValueEmitter().get());
        this.env.getAllProgramInstance().forEach(({ id, progVar }) => {
            const obj = {};
            scope[id] = obj;
            for (const att of Object.keys(progVar)) {
                obj[att] = progVar[att].get();
            }
        });
        scope = Object.assign(Object.assign({}, scope), addedScope);
        let res = undefined;
        try {
            if (this.exprInterpolation) {
                const { T0, V0, V1, duration, interpolator, dtFct } = this.exprInterpolation;
                const ms = this.env.get_Clock().now();
                const duration_value = exports.mathjs.evaluate(duration, scope);
                const dt_value = dtFct.evaluate({ T0, ms, duration: duration_value });
                if (dt_value >= 1) {
                    res = exports.mathjs.evaluate(V1, scope);
                    this.env.get_Clock().offChange(this.cbEmitterUpdated);
                }
                else {
                    const V0_value = exports.mathjs.evaluate(V0, scope);
                    const V1_value = exports.mathjs.evaluate(V1, scope);
                    res = exports.mathjs.evaluate(`${interpolator} (${dt_value}, ${V0_value}, ${V1_value} )`, exports.scopeInterpolator);
                }
            }
            else {
                res = this.exprRootNode.evaluate(scope);
            }
            this.errorEvaluation = undefined;
        }
        catch (err) {
            if (logError) {
                console.error("CCBLExpressionInExecutionEnvironment::forceEvaluationOnce ERROR:\n", this.exprRootNode.toString(), "\n", err);
            }
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