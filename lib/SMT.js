import { create, all } from "mathjs";
export const mathjs = create(all, {});
export function getContextStateSMT(P, C) {
    let state = C.eventStart?.eventExpression || '';
    state += C.state || '';
    const Csmt = getSMTExpr(P, state);
    const channels = [
        ...(P.dependencies?.import?.channels || []),
        ...(P.dependencies?.export?.channels || []),
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
export function getContextSMTdescrFromProg(P) {
    let str = getProgramDeclarations(P);
    str += canActivateAndDesactivate(P, {
        state: 'true',
        contextName: 'program root',
        ...P
    }, []);
    return str;
}
export function getActionsSMT(P, actions) {
    return actions.map(A => `(assert (= ${A.channel} ${getSMTExpr(P, A.affectation.value).SMT} ) )`).join(`\n`);
}
export function canActivateAndDesactivate(P, C, ancestorActions) {
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
        ...getStateContextsFrom(C.allen?.During ?? []),
        ...getStateContextsFrom(C.allen?.StartWith ?? []),
        ...getStateContextsFrom(C.allen?.EndWith ?? [])
    ];
    console.log('LC:', LC);
    str += LC.map(context => canActivateAndDesactivate(P, context, actions)).join(`\n`);
    str += getStateContextsFrom(C?.allen?.Meet?.contextsSequence ?? []).map(context => canActivateAndDesactivate(P, context, ancestorActions)).join(`\n`);
    return str;
}
export function getStateContextsFrom(L) {
    return (L || []).filter(C => C.contextName !== undefined);
}
export function getProgramDeclarations(P) {
    let str = "\n; Variables declaration\n";
    const L = [...(P.dependencies?.import?.channels || []),
        ...(P.dependencies?.import?.emitters || []),
        ...(P.dependencies?.export?.channels || []),
        ...(P.dependencies?.export?.emitters || []),
        ...(P.localChannels || [])
    ];
    str += L.map(v => getVarDeclaration(v)).join("\n");
    return str;
}
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
            const node = mathjs.parse(v.type);
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
export function getSMTExpr(P, expr) {
    const node = mathjs.parse(expr);
    return {
        dependencies: node.filter(n => n.isSymbolNode).map(n => n.name),
        SMT: mathNodeToSMT(P, node)
    };
}
export function getSMTforContext(P, C) {
    const expr = getSMTExpr(P, C.state);
    const LC = (C.allen?.During || []);
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
export function getSMT(P) {
    let str = "\n; Variables declaration\n";
    const L = [...(P.dependencies?.import?.channels || []),
        ...(P.dependencies?.import?.emitters || []),
        ...(P.dependencies?.export?.channels || []),
        ...(P.dependencies?.export?.emitters || []),
        ...(P.localChannels || [])
    ];
    str += L.map(v => getVarDeclaration(v)).join("\n");
    str += "\n\n; Contexts assertions\n";
    const smt = getSMTforContext(P, { contextName: '', state: 'true', ...P });
    str += smt.script;
    console.log(smt);
    return str;
}
export function mathNodeToSMT(P, node) {
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
//# sourceMappingURL=SMT.js.map