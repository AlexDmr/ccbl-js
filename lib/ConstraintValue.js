import { registerUnserializer } from "./Serialiser";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
const typeJSON = "CCBLConstraintValue";
export class CCBLConstraintValue {
    constructor(env, expression) {
        this.env = env;
        this.expression = expression;
        this.exprInEnv = new CCBLExpressionInExecutionEnvironment({
            env: this.env,
            expression: expression,
            addedScope: ["value"]
        });
    }
    dispose() {
        this.exprInEnv.dispose();
    }
    apply(v, scope) {
        scope = scope || {};
        return this.exprInEnv.forceEvaluationOnce({ ...scope, value: v });
    }
    toJSON() {
        return {
            type: typeJSON,
            expression: this.expression
        };
    }
}
export function initConstraintValue() {
    registerUnserializer(typeJSON, ((json, env) => {
        let { expression } = json;
        return new CCBLConstraintValue(env, expression);
    }));
}
//# sourceMappingURL=ConstraintValue.js.map