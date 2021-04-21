"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mathNodeToSMT = exports.getSMT = exports.getSMTforContext = exports.getSMTExpr = exports.getProgramDeclarations = exports.getStateContextsFrom = exports.canActivateAndDesactivate = exports.getActionsSMT = exports.getContextSMTdescrFromProg = exports.getContextStateSMT = exports.mathjs = void 0;
const mathjs_1 = require("mathjs");
exports.mathjs = mathjs_1.create(mathjs_1.all, {});
function getContextStateSMT(P, C) {
    var _a, _b, _c, _d, _e;
    let state = ((_a = C.eventStart) === null || _a === void 0 ? void 0 : _a.eventExpression) || '';
    state += C.state || '';
    const Csmt = getSMTExpr(P, state);
    const channels = [
        ...(((_c = (_b = P.dependencies) === null || _b === void 0 ? void 0 : _b.import) === null || _c === void 0 ? void 0 : _c.channels) || []),
        ...(((_e = (_d = P.dependencies) === null || _d === void 0 ? void 0 : _d.export) === null || _e === void 0 ? void 0 : _e.channels) || []),
        ...(P.localChannels || []),
    ];
    return {
        context: C,
        channelDependencies: Csmt.dependencies.filter(v => channels.find(c => c.name === v)),
        satisfaisable: Csmt.SMT,
        réfutable: `(not ${Csmt.SMT})`,
        actOnChannels: (C.actions || []).map(A => A.channel)
    };
}
exports.getContextStateSMT = getContextStateSMT;
function getContextSMTdescrFromProg(P) {
    let str = getProgramDeclarations(P);
    str += canActivateAndDesactivate(P, {
        state: 'true',
        contextName: 'program root',
        ...P
    }, []);
    return str;
}
exports.getContextSMTdescrFromProg = getContextSMTdescrFromProg;
function getActionsSMT(P, actions) {
    return actions.map(A => `(assert (= ${A.channel} ${getSMTExpr(P, A.affectation.value).SMT} ) )`).join(`\n`);
}
exports.getActionsSMT = getActionsSMT;
function canActivateAndDesactivate(P, C, ancestorActions) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const SMT = getContextStateSMT(P, C);
    const LA = C.actions || [];
    const actions = [
        ...ancestorActions.filter(A => !LA.find(act => act.channel === A.channel)),
        ...(C.actions || [])
    ];
    let str = `\n; ${C.contextName} : ${C.state} \n`;
    str += `(push) ; pushing for ancestors actions\n`;
    str += getActionsSMT(P, ancestorActions) + `\n`;
    str += `(push)\n`;
    str += `(assert ${SMT.satisfaisable}); can be true ?\n`;
    str += `(check-sat)\n`;
    str += `(pop)\n`;
    str += `(push)\n`;
    str += `(assert ${SMT.réfutable}); can be false ?\n`;
    str += `(check-sat)\n`;
    str += `(pop)\n`;
    str += `(pop) ; poping ancestors actions\n`;
    str += `(push)\n`;
    str += `(assert ${SMT.satisfaisable}); can hold ?\n`;
    str += getActionsSMT(P, actions) + `\n`;
    str += `(check-sat)\n`;
    str += `(pop)\n`;
    const LC = [
        ...getStateContextsFrom((_b = (_a = C.allen) === null || _a === void 0 ? void 0 : _a.During) !== null && _b !== void 0 ? _b : []),
        ...getStateContextsFrom((_d = (_c = C.allen) === null || _c === void 0 ? void 0 : _c.StartWith) !== null && _d !== void 0 ? _d : []),
        ...getStateContextsFrom((_f = (_e = C.allen) === null || _e === void 0 ? void 0 : _e.EndWith) !== null && _f !== void 0 ? _f : [])
    ];
    console.log('LC:', LC);
    str += LC.map(context => canActivateAndDesactivate(P, context, actions)).join(`\n`);
    str += getStateContextsFrom((_j = (_h = (_g = C === null || C === void 0 ? void 0 : C.allen) === null || _g === void 0 ? void 0 : _g.Meet) === null || _h === void 0 ? void 0 : _h.contextsSequence) !== null && _j !== void 0 ? _j : []).map(context => canActivateAndDesactivate(P, context, ancestorActions)).join(`\n`);
    return str;
}
exports.canActivateAndDesactivate = canActivateAndDesactivate;
function getStateContextsFrom(L) {
    return (L || []).filter(C => C.contextName !== undefined);
}
exports.getStateContextsFrom = getStateContextsFrom;
function getProgramDeclarations(P) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let str = "\n; Variables declaration\n";
    const L = [...(((_b = (_a = P.dependencies) === null || _a === void 0 ? void 0 : _a.import) === null || _b === void 0 ? void 0 : _b.channels) || []),
        ...(((_d = (_c = P.dependencies) === null || _c === void 0 ? void 0 : _c.import) === null || _d === void 0 ? void 0 : _d.emitters) || []),
        ...(((_f = (_e = P.dependencies) === null || _e === void 0 ? void 0 : _e.export) === null || _f === void 0 ? void 0 : _f.channels) || []),
        ...(((_h = (_g = P.dependencies) === null || _g === void 0 ? void 0 : _g.export) === null || _h === void 0 ? void 0 : _h.emitters) || []), ...(P.localChannels || [])];
    str += L.map(v => getVarDeclaration(v)).join("\n");
    return str;
}
exports.getProgramDeclarations = getProgramDeclarations;
function getVarDeclaration(v) {
    switch (v.type.toLowerCase()) {
        case 'boolean':
        case 'bool':
            return `(declare-fun ${v.name} () Bool)`;
        case 'integer':
        case 'int':
            return `(declare-fun ${v.name} () Int)`;
        case 'number':
        case 'real':
            return `(declare-fun ${v.name} () Real)`;
        default:
            const node = exports.mathjs.parse(v.type);
            if (node.isObjectNode) {
                let str = '';
                const properties = node.properties;
                for (let p in properties) {
                    const val = properties[p];
                    if (val.isSymbolNode) {
                        str += getVarDeclaration({ name: `${v.name}.${p}`, type: val.name });
                        str += `\n`;
                    }
                    else {
                        if (node.isObjectNode) {
                            str += getVarDeclaration({ name: `${v.name}.${p}`, type: val.toString() });
                            str += `\n`;
                        }
                    }
                }
                return str;
            }
            else {
                return 'unknown';
            }
    }
}
function getSMTExpr(P, expr) {
    const node = exports.mathjs.parse(expr);
    return {
        dependencies: node.filter(n => n.isSymbolNode).map(n => n.name),
        SMT: mathNodeToSMT(P, node)
    };
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
        ...(((_h = (_g = P.dependencies) === null || _g === void 0 ? void 0 : _g.export) === null || _h === void 0 ? void 0 : _h.emitters) || []), ...(P.localChannels || [])];
    str += L.map(v => getVarDeclaration(v)).join("\n");
    str += "\n\n; Contexts assertions\n";
    const smt = getSMTforContext(P, { contextName: '', state: 'true', ...P });
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
        const Latt = node.index.dimensions;
        const dotNotation = node.index.dotNotation;
        return Latt.reduce((acc, n) => `${acc}${dotNotation ? '.' : '['}${n.value !== undefined ? n.value : mathNodeToSMT(P, n)}${dotNotation ? '' : ']'}`, mathNodeToSMT(P, node.object));
    }
    if (node.isFunctionNode) {
    }
    if (node.isBlockNode) {
    }
    return '';
}
exports.mathNodeToSMT = mathNodeToSMT;
//# sourceMappingURL=SMT.js.map