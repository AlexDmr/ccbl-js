"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
function F(P, C) {
    var _a;
    let state = ((_a = C.eventStart) === null || _a === void 0 ? void 0 : _a.eventExpression) || '';
    state += C.state || '';
    const contextAssertion = getSMTExpr(P, state);
    return {
        context: C,
        satisfaisable: contextAssertion,
        réfutable: `(not ${contextAssertion})`,
    };
}
exports.F = F;
function getType(type) {
    switch (type.toLowerCase()) {
        case 'boolean': return 'Bool';
        case 'integer':
            return 'Int';
        case 'number':
            return 'Real';
        default: return;
    }
}
exports.mathjs = mathjs_1.create(mathjs_1.all, {});
function getSMTExpr(P, expr) {
    const node = exports.mathjs.parse(expr);
    return mathNodeToSMT(P, node);
}
exports.getSMTExpr = getSMTExpr;
function getSMTforContext(P, C) {
    var _a;
    const expr = getSMTExpr(P, C.state);
    const LC = (((_a = C.allen) === null || _a === void 0 ? void 0 : _a.During) || []);
    const LCsmt = LC.map(sc => getSMTforContext(P, sc));
    return {
        script: [
            `; ${C.state}`,
            `(push)`,
            `(assert ${expr})`,
            `(check-sat)`,
            ...LCsmt.map(smt => smt.script),
            `(pop)`
        ].join("\n"),
        ids: [C.id, ...LCsmt.reduce((acc, smt) => [...acc, ...smt.ids], [])]
    };
}
exports.getSMTforContext = getSMTforContext;
function getSMT(P) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let str = "\n; Variables declaration\n";
    const L = [...(((_b = (_a = P.dependencies) === null || _a === void 0 ? void 0 : _a.import) === null || _b === void 0 ? void 0 : _b.channels) || []),
        ...(((_d = (_c = P.dependencies) === null || _c === void 0 ? void 0 : _c.import) === null || _d === void 0 ? void 0 : _d.emitters) || []),
        ...(((_f = (_e = P.dependencies) === null || _e === void 0 ? void 0 : _e.export) === null || _f === void 0 ? void 0 : _f.channels) || []),
        ...(((_h = (_g = P.dependencies) === null || _g === void 0 ? void 0 : _g.export) === null || _h === void 0 ? void 0 : _h.emitters) || []),
        ...(P.localChannels || [])
    ];
    str += L.map(v => `(declare-fun ${v.name} () ${getType(v.type)})`).join("\n");
    str += "\n\n; Contexts assertions\n";
    const smt = getSMTforContext(P, Object.assign({ contextName: '', state: 'true' }, P));
    str += smt.script;
    console.log(smt);
    return str;
}
exports.getSMT = getSMT;
function mathNodeToSMT(P, node) {
    if (node.isConstantNode) {
        return node.value.toString();
    }
    if (node.isConditionalNode) {
        return '';
    }
    if (node.isArrayNode) {
        return '';
    }
    if (node.isOperatorNode) {
        const LA = node.args.map(n => mathNodeToSMT(P, n));
        if (LA.length === 1) {
            return `${node.op}${LA[0]}`;
        }
        else {
            return `(${node.op} ${LA.join(' ')})`;
        }
    }
    if (node.isParenthesisNode) {
        return mathNodeToSMT(P, node.content);
    }
    if (node.isSymbolNode) {
        return node.name;
    }
    if (node.isAccessorNode) {
    }
    if (node.isFunctionNode) {
    }
    if (node.isBlockNode) {
    }
    return '';
}
exports.mathNodeToSMT = mathNodeToSMT;
//# sourceMappingURL=SMT.js.map