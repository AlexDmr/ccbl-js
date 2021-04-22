export function isNameUsedInProg(name, prog) {
    for (const location of ['channels', 'emitters', 'events']) {
        for (const R of ['import', 'export']) {
            const dep = prog.dependencies ? prog.dependencies : {};
            const inOut = dep[R] ? dep[R] : {};
            const L = inOut[location] ? inOut[location] : [];
            if (L.find(vd => vd.name === name)) {
                return { location, varRange: R };
            }
        }
    }
    const L = prog.localChannels || [];
    if (L.find(vd => vd.name === name)) {
        return { location: 'channels', varRange: 'local' };
    }
    else {
        const refP = getAllContextOrProgramsFromProg(prog).map(C => C)
            .filter(refP => refP.as)
            .find(refP => refP.as === name);
        return !!refP ? { location: 'programs', varRange: 'local' } : undefined;
    }
}
export function getAllContextOrProgramsFromProg(P) {
    const L = [
        ...(P.allen?.During || []),
        ...(P.allen?.StartWith || []),
        ...(P.allen?.EndWith || [])
    ];
    const Lres = [];
    while (L.length > 0) {
        const CP = L.pop();
        Lres.push(CP);
        L.push(...(CP.allen?.During || []), ...(CP.allen?.StartWith || []), ...(CP.allen?.EndWith || []), ...(CP.allen?.Meet?.contextsSequence || []));
    }
    return Lres;
}
export function ProgramsEquivalents(A, B, withId) {
    A = A || {};
    B = B || {};
    const namesA = Object.keys(A).sort();
    const namesB = Object.keys(B).sort();
    return namesA.length === namesB.length && namesA.reduce((acc, na, i) => {
        const a = A[na];
        const b = B[namesB[i]];
        return acc && na === namesB[i] && progEquivalent(a, b, withId);
    }, true);
}
export function progEquivalent(P1, P2, withId = true) {
    return stateActionsEquivalents(P1.actions ?? [], P2.actions ?? [], withId)
        && variablesEquivalents(P1.localChannels ?? [], P2.localChannels ?? [])
        && DependenciesEquivalents(P1.dependencies ?? {}, P2.dependencies ?? {})
        && ProgramsEquivalents(P1.subPrograms ?? {}, P2.subPrograms ?? {}, withId)
        && allenEquivalent(P1.allen ?? {}, P2.allen ?? {}, withId)
        && P1.name === P2.name
        && P1.description == P2.description;
}
export function allenEquivalent(A, B, withId) {
    const AR1 = !!A ? { ...A } : {};
    const AR2 = !!B ? { ...B } : {};
    return contextsEquivalent(AR1.EndWith ?? [], AR2.EndWith ?? [], withId)
        && contextsEquivalent(AR1.StartWith ?? [], AR2.StartWith ?? [], withId)
        && contextsMeetEquivalent(AR1.Meet ?? { contextsSequence: [] }, AR2.Meet ?? { contextsSequence: [] }, withId)
        && contextsEquivalent(AR1.During ?? [], AR2.During ?? [], withId);
}
export function contextsMeetEquivalent(A, B, withId) {
    const CMA = A ? { ...A } : { contextsSequence: [] };
    const CMB = B ? { ...B } : { contextsSequence: [] };
    return CMA.contextsSequence.length === CMA.contextsSequence.length
        && CMA.loop === CMB.loop
        && contextsEquivalent(CMA.contextsSequence, CMB.contextsSequence, withId);
}
export function contextsEquivalent(A, B, withId) {
    const CPA = A ? A : [];
    const CPB = B ? B : [];
    return CPA.length === CPB.length && CPA.reduce((acc, ca, i) => {
        const cb = CPB[i];
        const equi = contextEquivalent(ca, cb, withId);
        return acc && equi;
    }, true);
}
export function contextEquivalent(A, B, withId) {
    const progRefA = A;
    if (progRefA.programId) {
        const progRefB = B;
        return progRefA.programId === progRefB.programId
            && progRefA.as === progRefB.as
            && (!withId || (progRefA.id === progRefB.id))
            && mapInputsEquivalent(progRefA.mapInputs ?? {}, progRefB.mapInputs ?? {}, withId);
    }
    const stateContextA = A;
    if (stateContextA.state || stateContextA.eventStart || stateContextA.eventFinish) {
        const stateContextB = B;
        const result = stateContextA.state === stateContextB.state
            && (!withId || (stateContextA.id === stateContextB.id))
            && stateContextA.contextName === stateContextB.contextName
            && stateActionsEquivalents(stateContextA.actions ?? [], stateContextB.actions ?? [], withId)
            && eventActionsEquivalent(stateContextA.actionsOnStart ?? [], stateContextB.actionsOnStart ?? [], withId)
            && eventActionsEquivalent(stateContextA.actionsOnEnd ?? [], stateContextB.actionsOnEnd ?? [], withId)
            && ((stateContextA.eventStart && stateContextB.eventStart && eventEquivalent(stateContextA.eventStart, stateContextB.eventStart, withId))
                || (!stateContextA.eventStart && !stateContextB.eventStart))
            && ((stateContextA.eventFinish && stateContextB.eventFinish && eventEquivalent(stateContextA.eventFinish, stateContextB.eventFinish, withId))
                || (!stateContextA.eventFinish && !stateContextB.eventFinish))
            && allenEquivalent(stateContextA.allen ?? {}, stateContextB.allen ?? {}, withId)
            && stateContextA.ccblContext === stateContextB.ccblContext;
        return result;
    }
    const eventContextA = A;
    if (eventContextA.eventSource !== undefined) {
        const eventContextB = B;
        const result = eventContextA.contextName === eventContextB.contextName
            && eventContextA.eventName === eventContextB.eventName
            && eventContextA.eventFilter === eventContextB.eventFilter
            && eventContextA.eventSource === eventContextB.eventSource
            && eventContextA.ccblContext === eventContextB.ccblContext
            && (!withId || (eventContextA.id === eventContextB.id))
            && eventActionsEquivalent(eventContextA.actions, eventContextB.actions, withId);
        return result;
    }
    console.error("A and B are unknown...", A, B);
    return false;
}
export function eventEquivalent(A, B, withId) {
    const result = (!A && !B)
        || ((!!A && !!B) && (A.eventSource === B.eventSource &&
            A.eventFilter === B.eventFilter &&
            A.eventName === B.eventName &&
            (!withId || (A.id === B.id)) &&
            A.eventExpression === B.eventExpression));
    return result;
}
export function mapInputsEquivalent(A, B, withId) {
    A = A || {};
    B = B || {};
    const namesA = Object.keys(A).sort();
    const namesB = Object.keys(B).sort();
    return namesA.length === namesB.length && namesA.reduce((acc, na, i) => {
        const a = A[na];
        const b = B[namesB[i]];
        return acc && na === namesB[i] && (a === b || (a.eventSource !== undefined &&
            b.eventSource !== undefined &&
            eventEquivalent(a, b, withId)));
    }, true);
}
export function DependenciesEquivalents(A, B) {
    [A, B] = [A, B].map(IE => {
        IE = IE || {};
        ["import", "export"].forEach(D => {
            const voc = IE[D] = IE[D] || {};
            voc.channels = voc.channels || [];
            voc.events = voc.events || [];
            voc.emitters = voc.emitters || [];
        });
        return IE;
    });
    return variablesEquivalents(A.import?.channels ?? [], B.import?.channels ?? [])
        && variablesEquivalents(A.import?.emitters ?? [], B.import?.emitters ?? [])
        && variablesEquivalents(A.import?.events ?? [], B.import?.events ?? [])
        && variablesEquivalents(A.export?.channels ?? [], B.export?.channels ?? [])
        && variablesEquivalents(A.export?.emitters ?? [], B.export?.emitters ?? [])
        && variablesEquivalents(A.export?.events ?? [], B.export?.events ?? []);
}
export function variablesEquivalents(A, B) {
    A = A || [];
    B = B || [];
    return A.length === B.length && A.reduce((acc, v1, i) => {
        const v2 = B[i];
        return acc && v1.name === v2.name && v1.type === v2.type;
    }, true);
}
export function eventActionsEquivalent(A, B, withId) {
    A = A || [];
    B = B || [];
    return (A.length === B.length) && A.reduce((acc, _, i) => {
        const act1 = A[i];
        const act2 = B[i];
        return acc && (!withId || (act1.id === act2.id)) && act1.channel === act2.channel && act1.affectation === act2.affectation && act1.ccblAction === act2.ccblAction;
    }, true);
}
export function stateActionsEquivalents(A, B, withId) {
    A = A || [];
    B = B || [];
    return (A.length === B.length) && A.reduce((acc, act1, i) => {
        const act2 = B[i];
        return acc && act1.channel === act2.channel && act1.affectation.value === act2.affectation.value &&
            (!withId || (act1.id === act2.id)) &&
            act1.ccblAction === act2.ccblAction && (act1.affectation.type === act2.affectation.type ||
            act1.affectation.type === "expression" && act2.affectation.type === undefined ||
            act2.affectation.type === "expression" && act1.affectation.type === undefined);
    }, true);
}
export function copyHumanReadableProgram(prog, withCcblRef = true) {
    const copy = {};
    if (prog.name !== undefined) {
        copy.name = prog.name;
    }
    if (prog.description !== undefined) {
        copy.description = prog.description;
    }
    if (!!prog.actions && prog.actions.length > 0) {
        copy.actions = prog.actions.map(a => copyHumanReadableStateActions(a, withCcblRef));
    }
    if (!!prog.localChannels && prog.localChannels.length > 0) {
        copy.localChannels = prog.localChannels.map(copyVariableDescription);
    }
    if (!!prog.subPrograms) {
        copy.subPrograms = {};
        for (const k of Object.keys(prog.subPrograms)) {
            const sP = prog.subPrograms[k];
            copy.subPrograms[k] = copyHumanReadableProgram(sP, withCcblRef);
        }
    }
    if (prog.dependencies) {
        copy.dependencies = {};
        if (prog.dependencies.import) {
            copy.dependencies.import = copyVocabulary(prog.dependencies.import);
        }
        if (prog.dependencies.export) {
            copy.dependencies.export = copyVocabulary(prog.dependencies.export);
        }
    }
    if (prog.allen) {
        copy.allen = copyAllen(prog.allen, withCcblRef);
    }
    if (withCcblRef && prog.ccblContext) {
        copy.ccblContext = prog.ccblContext;
    }
    return copy;
}
export function copyContextOrProgram(obj, withCcblRef = true) {
    const progRef = obj;
    if (progRef.as) {
        return copyProgRef(progRef);
    }
    else {
        const eventContext = obj;
        if (eventContext.eventSource !== undefined) {
            return copyHumanReadableEventContext(eventContext, withCcblRef);
        }
        else {
            return copyHumanReadableStateContext(obj, withCcblRef);
        }
    }
}
export function copyProgRef(progRef) {
    const copyProgRef = {
        as: progRef.as.slice(),
        programId: progRef.programId.slice(),
    };
    if (progRef.id !== undefined) {
        copyProgRef.id = progRef.id;
    }
    if (progRef.mapInputs) {
        copyProgRef.mapInputs = {};
        Object.keys(progRef.mapInputs).forEach(k => {
            const V = progRef.mapInputs[k];
            if (typeof V === 'string') {
                copyProgRef.mapInputs[k] = V.slice();
            }
            else {
                const Vevt = V;
                if (Vevt.eventSource !== undefined) {
                    copyProgRef.mapInputs[k] = copyEventTrigger(Vevt);
                }
            }
        });
    }
    return copyProgRef;
}
export function copyAllen(allen, withCcblRef = true) {
    const copy = {};
    if (allen.During) {
        copy.During = allen.During.map(c => copyContextOrProgram(c, withCcblRef));
    }
    if (allen.EndWith) {
        copy.EndWith = allen.EndWith.map(c => copyContextOrProgram(c, withCcblRef));
    }
    if (allen.Meet?.loop !== undefined || (allen.Meet && allen.Meet.contextsSequence?.length > 0)) {
        copy.Meet = {
            contextsSequence: allen.Meet.contextsSequence.map(c => copyHumanReadableStateContext(c, withCcblRef))
        };
        if (allen.Meet.loop !== undefined) {
            copy.Meet.loop = allen.Meet.loop;
        }
    }
    if (allen.StartWith) {
        copy.StartWith = allen.StartWith.map(c => copyContextOrProgram(c, withCcblRef));
    }
    return copy;
}
export function copyHumanReadableEventContext(c, withCcblRef = true) {
    const copy = {
        ...copyEventTrigger(c),
        contextName: c.contextName.slice(),
        actions: (c.actions || []).map(a => copyHumanReadableEventAction(a, withCcblRef))
    };
    if (withCcblRef && c.ccblContext) {
        copy.ccblContext = c.ccblContext;
    }
    if (c.id !== undefined) {
        copy.id = c.id;
    }
    return copy;
}
export function copyHumanReadableStateContext(c, withCcblRef = true) {
    const copy = {
        contextName: c.contextName.slice()
    };
    if (c.id !== undefined) {
        copy.id = c.id;
    }
    if (c.state !== undefined) {
        copy.state = c.state.slice();
    }
    if (c.actions && c.actions.length > 0) {
        copy.actions = c.actions.map(a => copyHumanReadableStateActions(a, withCcblRef));
    }
    if (withCcblRef && c.ccblContext) {
        copy.ccblContext = c.ccblContext;
    }
    if (c.allen) {
        copy.allen = copyAllen(c.allen, withCcblRef);
    }
    if (c.eventStart) {
        copy.eventStart = copyEventTrigger(c.eventStart);
    }
    if (c.eventFinish) {
        copy.eventFinish = copyEventTrigger(c.eventFinish);
    }
    if (c.actionsOnStart) {
        copy.actionsOnStart = c.actionsOnStart.map(a => copyHumanReadableEventAction(a, withCcblRef));
    }
    if (c.actionsOnEnd) {
        copy.actionsOnEnd = c.actionsOnEnd.map(a => copyHumanReadableEventAction(a, withCcblRef));
    }
    return copy;
}
export function copyHumanReadableEventAction(a, withCcblRef = true) {
    const aTA = a;
    if (aTA?.eventer !== undefined) {
        return {
            eventer: aTA.eventer.slice(),
            expression: aTA.expression.slice(),
            id: aTA.id
        };
    }
    else {
        const aCA = a;
        if (aCA?.channel !== undefined) {
            const ca = {
                channel: aCA.channel.slice(),
                affectation: aCA.affectation.slice()
            };
            if (aCA.id !== undefined) {
                ca.id = aCA.id;
            }
            if (withCcblRef && aCA.ccblAction) {
                ca.ccblAction = aCA.ccblAction;
            }
            return ca;
        }
        else {
            throw "copyHumanReadableEventAction cannot copy an action that is neither HumanReadableEventTriggerAction nor HumanReadableEventChannelAction";
        }
    }
}
export function copyEventTrigger(evt) {
    const copy = { eventSource: evt.eventSource.slice() };
    if (evt.id !== undefined) {
        copy.id = evt.id;
    }
    if (evt.eventName) {
        copy.eventName = evt.eventName.slice();
    }
    if (evt.eventFilter) {
        copy.eventFilter = evt.eventFilter.slice();
    }
    if (evt.eventExpression) {
        copy.eventExpression = evt.eventExpression.slice();
    }
    return copy;
}
export function copyVocabulary(voc) {
    const copy = {};
    if (voc.channels && voc.channels.length > 0) {
        copy.channels = voc.channels.map(copyVariableDescription);
    }
    if (voc.emitters && voc.emitters.length > 0) {
        copy.emitters = voc.emitters.map(copyVariableDescription);
    }
    if (voc.events && voc.events.length > 0) {
        copy.events = voc.events.map(copyVariableDescription);
    }
    return copy;
}
export function copyVariableDescription(vd) {
    return {
        name: vd.name.slice(),
        type: vd.type.slice()
    };
}
export function copyHumanReadableStateActions(action, withCcblRef = true) {
    const copy = {
        channel: action.channel.slice(),
        affectation: {
            type: action.affectation.type === 'constraint' ? 'constraint' : 'expression',
            value: action.affectation.value.slice()
        }
    };
    if (withCcblRef && action.ccblAction) {
        copy.ccblAction = action.ccblAction;
    }
    if (action.id !== undefined) {
        copy.id = action.id;
    }
    return copy;
}
//# sourceMappingURL=ProgramObjectInterface.js.map