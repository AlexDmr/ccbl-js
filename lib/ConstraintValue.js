"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConstraintValue = exports.CCBLConstraintValue = void 0;
const Serialiser_1 = require("./Serialiser");
const CCBLExpressionInExecutionEnvironment_1 = require("./CCBLExpressionInExecutionEnvironment");
const typeJSON = "CCBLConstraintValue";
class CCBLConstraintValue {
    constructor(env, expression) {
        this.env = env;
        this.expression = expression;
        this.exprInEnv = new CCBLExpressionInExecutionEnvironment_1.CCBLExpressionInExecutionEnvironment({
            env: this.env,
            expression: expression,
            addedScope: ["value"]
        });
    }
    dispose() {
        this.exprInEnv.dispose();
        delete this.exprInEnv;
    }
    apply(v, scope) {
        scope = scope || {};
        return this.exprInEnv.forceEvaluationOnce(Object.assign(Object.assign({}, scope), { value: v }));
    }
    toJSON() {
        return {
            type: typeJSON,
            expression: this.expression
        };
    }
}
exports.CCBLConstraintValue = CCBLConstraintValue;
function initConstraintValue() {
    Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
        let { expression } = json;
        return new CCBLConstraintValue(env, expression);
    });
}
exports.initConstraintValue = initConstraintValue;
//# sourceMappingURL=ConstraintValue.js.map