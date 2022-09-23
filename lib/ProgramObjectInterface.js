export function CcblProgramElements_to_JSON(E) {
    return {
        program: E.program.toHumanReadableProgram(),
        subProgramInstances: Object.keys(E.subProgramInstances).reduce((objSP, idSP) => {
            const sp = E.subProgramInstances[idSP];
            objSP[idSP] = CcblProgramElements_to_JSON(sp);
            return objSP;
        }, {}),
        stateContexts: Object.keys(E.stateContexts),
        eventContexts: Object.keys(E.eventContexts),
        stateActions: Object.keys(E.stateActions),
        eventActions: Object.keys(E.eventActions),
    };
}
export function getInstance(path, elements) {
    if (path.length === 0) {
        return undefined;
    }
    else {
        if (path.length === 1) {
            return [{ step: path[0], elements: elements }];
        }
        else {
            const L = getInstanceRec(path.slice(1), elements);
            return L ? [{ step: path[0], elements }, ...L] : undefined;
        }
    }
}
function getInstanceRec(path, elements) {
    if (path.length === 0) {
        return [];
    }
    const [step, ...LrestSteps] = path;
    const sp = elements.subProgramInstances[step];
    if (sp) {
        const L = getInstanceRec(LrestSteps, sp);
        return L ? [{ step, elements: sp }, ...L] : undefined;
    }
    else {
        return undefined;
    }
}
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
            && progRefA.description === progRefB.description
            && (!withId || (progRefA.id === progRefB.id))
            && mapInputsEquivalent(progRefA.mapInputs ?? {}, progRefB.mapInputs ?? {}, withId);
    }
    const stateContextA = A;
    if (stateContextA.type === "STATE") {
        const stateContextB = B;
        const stateA = stateContextA.state || "true";
        const stateB = stateContextB.state || "true";
        const result = stateA === stateB
            && (!withId || (stateContextA.id === stateContextB.id))
            && stateContextA.contextName === stateContextB.contextName
            && stateActionsEquivalents(stateContextA.actions ?? [], stateContextB.actions ?? [], withId)
            && eventActionsEquivalent(stateContextA.actionsOnStart ?? [], stateContextB.actionsOnStart ?? [], withId)
            && eventActionsEquivalent(stateContextA.actionsOnEnd ?? [], stateContextB.actionsOnEnd ?? [], withId)
            && ((stateContextA.eventStart && stateContextB.eventStart && eventEquivalent(stateContextA.eventStart, stateContextB.eventStart, withId))
                || (!stateContextA.eventStart && !stateContextB.eventStart))
            && ((stateContextA.eventFinish && stateContextB.eventFinish && eventEquivalent(stateContextA.eventFinish, stateContextB.eventFinish, withId))
                || (!stateContextA.eventFinish && !stateContextB.eventFinish))
            && allenEquivalent(stateContextA.allen ?? {}, stateContextB.allen ?? {}, withId);
        return result;
    }
    const eventContextA = A;
    if (eventContextA.eventSource !== undefined) {
        const eventContextB = B;
        const result = eventContextA.contextName === eventContextB.contextName
            && eventContextA.eventName === eventContextB.eventName
            && eventContextA.eventFilter === eventContextB.eventFilter
            && eventContextA.eventSource === eventContextB.eventSource
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
        return acc
            && (!withId || (act1.id === act2.id))
            && act1.channel === act2.channel
            && act1.affectation === act2.affectation;
    }, true);
}
export function stateActionsEquivalents(A, B, withId) {
    A = A || [];
    B = B || [];
    return (A.length === B.length) && A.reduce((acc, act1, i) => {
        const act2 = B[i];
        return acc && act1.channel === act2.channel && act1.affectation.value === act2.affectation.value &&
            (!withId || (act1.id === act2.id))
            && (act1.affectation.type === act2.affectation.type ||
                act1.affectation.type === "expression" && act2.affectation.type === undefined ||
                act2.affectation.type === "expression" && act1.affectation.type === undefined);
    }, true);
}
export function copyHumanReadableProgram(prog) {
    const copy = {};
    if (prog.name !== undefined) {
        copy.name = prog.name;
    }
    if (prog.description !== undefined) {
        copy.description = prog.description;
    }
    if (!!prog.actions && prog.actions.length > 0) {
        copy.actions = prog.actions.map(a => copyHumanReadableStateActions(a));
    }
    if (!!prog.localChannels && prog.localChannels.length > 0) {
        copy.localChannels = prog.localChannels.map(copyVariableDescription);
    }
    if (!!prog.subPrograms) {
        copy.subPrograms = {};
        for (const k of Object.keys(prog.subPrograms)) {
            const sP = prog.subPrograms[k];
            copy.subPrograms[k] = copyHumanReadableProgram(sP);
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
        copy.allen = copyAllen(prog.allen);
    }
    return copy;
}
export function copyContextOrProgram(obj) {
    const progRef = obj;
    if (progRef.as) {
        return copyProgRef(progRef);
    }
    else {
        const eventContext = obj;
        if (eventContext.eventSource !== undefined) {
            return copyHumanReadableEventContext(eventContext);
        }
        else {
            return copyHumanReadableStateContext(obj);
        }
    }
}
export function copyProgRef(progRef) {
    const copyProgRef = {
        as: progRef.as.slice(),
        programId: progRef.programId.slice(),
        description: progRef.description?.slice()
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
export function copyAllen(allen) {
    const copy = {};
    if (allen.During) {
        copy.During = allen.During.map(c => copyContextOrProgram(c));
    }
    if (allen.EndWith) {
        copy.EndWith = allen.EndWith.map(c => copyContextOrProgram(c));
    }
    if (allen.Meet?.loop !== undefined || (allen.Meet && allen.Meet.contextsSequence?.length > 0)) {
        copy.Meet = {
            contextsSequence: allen.Meet.contextsSequence.map(c => copyHumanReadableStateContext(c))
        };
        if (allen.Meet.loop !== undefined) {
            copy.Meet.loop = allen.Meet.loop;
        }
    }
    if (allen.StartWith) {
        copy.StartWith = allen.StartWith.map(c => copyContextOrProgram(c));
    }
    return copy;
}
export function copyHumanReadableEventContext(c) {
    const copy = {
        type: "EVENT",
        ...copyEventTrigger(c),
        contextName: c.contextName.slice(),
        actions: (c.actions || []).map(a => copyHumanReadableEventAction(a))
    };
    if (c.id !== undefined) {
        copy.id = c.id;
    }
    return copy;
}
export function copyHumanReadableStateContext(c) {
    const copy = {
        contextName: c.contextName.slice(),
        type: "STATE"
    };
    if (c.id !== undefined) {
        copy.id = c.id;
    }
    if (c.state !== undefined) {
        copy.state = c.state.slice();
    }
    if (c.actions && c.actions.length > 0) {
        copy.actions = c.actions.map(a => copyHumanReadableStateActions(a));
    }
    if (c.allen) {
        copy.allen = copyAllen(c.allen);
    }
    if (c.eventStart) {
        copy.eventStart = copyEventTrigger(c.eventStart);
    }
    if (c.eventFinish) {
        copy.eventFinish = copyEventTrigger(c.eventFinish);
    }
    if (c.actionsOnStart) {
        copy.actionsOnStart = c.actionsOnStart.map(a => copyHumanReadableEventAction(a));
    }
    if (c.actionsOnEnd) {
        copy.actionsOnEnd = c.actionsOnEnd.map(a => copyHumanReadableEventAction(a));
    }
    return copy;
}
export function copyHumanReadableEventAction(a) {
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
export function copyHumanReadableStateActions(action) {
    const copy = {
        channel: action.channel.slice(),
        affectation: {
            type: action.affectation.type === 'constraint' ? 'constraint' : 'expression',
            value: action.affectation.value.slice()
        }
    };
    if (action.id !== undefined) {
        copy.id = action.id;
    }
    return copy;
}
export function cleanStateAction(A) {
    const NA = {
        channel: A.channel,
        affectation: A.affectation,
        id: A.id
    };
    if (NA.id === undefined) {
        delete NA.id;
    }
    return NA;
}
export function cleanEventAction(A) {
    return A;
}
export function cleanProgramInstance(P) {
    return P;
}
export function cleanContextOrProgram(n) {
    const P = n;
    if (P.programId)
        return cleanProgramInstance(P);
    const S = n;
    return S.type === "STATE" ? cleanStateContext(S) : cleanEventContext(S);
}
export function cleanStateContext(ctxt) {
    const NC = {
        type: "STATE",
        state: ctxt.state,
        contextName: ctxt.contextName,
        actions: ctxt.actions,
        allen: ctxt.allen,
        actionsOnStart: ctxt.actionsOnStart,
        actionsOnEnd: ctxt.actionsOnEnd,
        eventStart: ctxt.eventStart,
        eventFinish: ctxt.eventFinish,
        id: ctxt.id
    };
    NC.actions = NC.actions ? NC.actions.map(cleanStateAction) : undefined;
    NC.actionsOnStart = NC.actionsOnStart ? NC.actionsOnStart?.map(cleanEventAction) : undefined;
    NC.actionsOnEnd = NC.actionsOnEnd ? NC.actionsOnEnd?.map(cleanEventAction) : undefined;
    if (NC.state === undefined || NC.state === "") {
        delete NC.state;
    }
    if (NC.eventStart === undefined) {
        delete NC.eventStart;
    }
    if (NC.eventFinish === undefined) {
        delete NC.eventFinish;
    }
    NC.allen = {
        During: ctxt.allen?.During?.map(cleanContextOrProgram),
        Meet: ctxt.allen?.Meet ? { contextsSequence: ctxt.allen.Meet.contextsSequence, loop: ctxt.allen.Meet.loop } : undefined,
        StartWith: ctxt.allen?.StartWith?.map(cleanContextOrProgram),
        EndWith: ctxt.allen?.EndWith?.map(cleanContextOrProgram)
    };
    if (NC.allen.During?.length === 0) {
        delete NC.allen.During;
    }
    if (NC.allen.StartWith?.length === 0) {
        delete NC.allen.StartWith;
    }
    if (NC.allen.EndWith?.length === 0) {
        delete NC.allen.EndWith;
    }
    if (NC.allen.Meet && NC.allen.Meet.contextsSequence.length === 0 && NC.allen.Meet.loop === undefined) {
        delete NC.allen.Meet.loop;
    }
    Object.keys(NC.allen).filter(k => NC.allen[k] === undefined).forEach(k => delete NC.allen[k]);
    if (NC.allen?.During === undefined && NC.allen?.EndWith === undefined && NC.allen?.StartWith === undefined && NC.allen?.Meet === undefined) {
        delete NC.allen;
    }
    Object.keys(NC).filter(k => NC[k] === undefined).forEach(k => delete NC[k]);
    return NC;
}
export function cleanEventContext(C) {
    const res = {
        type: "EVENT",
        contextName: C.contextName,
        actions: C.actions.map(cleanEventAction),
        eventName: C.eventName,
        eventSource: C.eventSource,
        eventExpression: C.eventSource === "" ? C.eventExpression : undefined,
        eventFilter: C.eventFilter,
        id: C.id
    };
    Object.keys(res).filter(k => res[k] === undefined).forEach(k => delete res[k]);
    return res;
}
export function cleanProgram(P) {
    if (Object.keys(P.subPrograms ?? {}).length === 0) {
        delete P.subPrograms;
    }
    else {
        for (const sp of Object.keys(P.subPrograms ?? {})) {
            P.subPrograms[sp] = cleanProgram(P.subPrograms[sp]);
        }
    }
    if (P.dependencies?.import?.channels?.length === 0) {
        delete P.dependencies?.import?.channels;
    }
    if (P.dependencies?.import?.emitters?.length === 0) {
        delete P.dependencies?.import?.emitters;
    }
    if (P.dependencies?.import?.events?.length === 0) {
        delete P.dependencies?.import?.events;
    }
    if (Object.keys(P.dependencies?.import ?? {}).length === 0) {
        delete P.dependencies?.import;
    }
    if (P.dependencies?.export?.channels?.length === 0) {
        delete P.dependencies?.export?.channels;
    }
    if (P.dependencies?.export?.emitters?.length === 0) {
        delete P.dependencies?.export?.emitters;
    }
    if (P.dependencies?.export?.events?.length === 0) {
        delete P.dependencies?.export?.events;
    }
    if (Object.keys(P.dependencies?.export ?? {}).length === 0) {
        delete P.dependencies?.export;
    }
    if (Object.keys(P.dependencies ?? {}).length === 0) {
        delete P.dependencies;
    }
    if (P.localChannels?.length === 0) {
        delete P.localChannels;
    }
    const root = cleanStateContext({
        contextName: "root",
        type: "STATE",
        actions: P.actions,
        allen: P.allen,
    });
    return { ...P, ...root };
}
//# sourceMappingURL=ProgramObjectInterface.js.map