"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    apply(v) {
        return this.exprInEnv.forceEvaluationOnce({ value: v });
    }
    toJSON() {
        return {
            type: typeJSON,
            expression: this.expression
        };
    }
}
exports.CCBLConstraintValue = CCBLConstraintValue;
Serialiser_1.registerUnserializer(typeJSON, (json, env) => {
    let { expression } = json;
    return new CCBLConstraintValue(env, expression);
});
//# sourceMappingURL=ConstraintValue.js.map