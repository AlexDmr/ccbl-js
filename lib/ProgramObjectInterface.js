"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ProgramsEquivalents(A, B) {
    A = A || {};
    B = B || {};
    const namesA = Object.keys(A).sort();
    const namesB = Object.keys(B).sort();
    return namesA.length === namesB.length && namesA.reduce((acc, na, i) => {
        const a = A[na];
        const b = B[namesB[i]];
        return acc && na === namesB[i] && progEquivalent(a, b);
    }, true);
}
exports.ProgramsEquivalents = ProgramsEquivalents;
function progEquivalent(P1, P2) {
    return stateActionsEquivalents(P1.actions, P2.actions)
        && variablesEquivalents(P1.localChannels, P2.localChannels)
        && DependenciesEquivalents(P1.dependencies, P2.dependencies)
        && ProgramsEquivalents(P1.subPrograms, P2.subPrograms)
        && allenEquivalent(P1.allen, P2.allen);
}
exports.progEquivalent = progEquivalent;
function allenEquivalent(A, B) {
    const AR1 = !!A ? Object.assign({}, A) : {};
    const AR2 = !!B ? Object.assign({}, B) : {};
    return contextsEquivalent(AR1.EndWith, AR2.EndWith)
        && contextsEquivalent(AR1.StartWith, AR2.StartWith)
        && contextsMeetEquivalent(AR1.Meet, AR2.Meet)
        && contextsEquivalent(AR1.During, AR2.During);
}
exports.allenEquivalent = allenEquivalent;
function contextsMeetEquivalent(A, B) {
    const CMA = A ? Object.assign({}, A) : { contextsSequence: [] };
    const CMB = B ? Object.assign({}, B) : { contextsSequence: [] };
    return CMA.loop === CMB.loop && contextsEquivalent(CMA.contextsSequence, CMB.contextsSequence);
}
exports.contextsMeetEquivalent = contextsMeetEquivalent;
function contextsEquivalent(A, B) {
    const CPA = A ? A : [];
    const CPB = B ? B : [];
    return CPA.length === CPB.length && CPA.reduce((acc, ca, i) => {
        const cb = CPB[i];
        const equi = contextEquivalent(ca, cb);
        return acc && equi;
    }, true);
}
exports.contextsEquivalent = contextsEquivalent;
function contextEquivalent(A, B) {
    const progRefA = A;
    if (progRefA.programId) {
        const progRefB = B;
        return progRefA.programId === progRefB.programId
            && progRefA.as === progRefB.as
            && mapInputsEquivalent(progRefA.mapInputs, progRefB.mapInputs);
    }
    const stateContextA = A;
    if (stateContextA.state) {
        const stateContextB = B;
        const result = stateContextA.state === stateContextB.state
            && stateContextA.contextName === stateContextB.contextName
            && stateActionsEquivalents(stateContextA.actions, stateContextB.actions)
            && eventActionsEquivalent(stateContextA.actionsOnStart, stateContextB.actionsOnStart)
            && eventActionsEquivalent(stateContextA.actionsOnEnd, stateContextB.actionsOnEnd)
            && eventEquivalent(stateContextA.eventStart, stateContextB.eventStart)
            && eventEquivalent(stateContextA.eventFinish, stateContextB.eventFinish)
            && allenEquivalent(stateContextA.allen, stateContextB.allen);
        return result;
    }
    const eventContextA = A;
    if (eventContextA.eventSource) {
        const eventContextB = B;
        const result = eventContextA.contextName === eventContextB.contextName
            && eventContextA.eventName === eventContextB.eventName
            && eventContextA.eventFilter === eventContextB.eventFilter
            && eventContextA.eventSource === eventContextB.eventSource
            && eventActionsEquivalent(eventContextA.actions, eventContextB.actions);
        return result;
    }
    console.error("A and B are unknown...", A, B);
    return false;
}
exports.contextEquivalent = contextEquivalent;
function eventEquivalent(A, B) {
    const result = (!A && !B)
        || ((!!A && !!B) && (A.eventSource === B.eventSource &&
            A.eventFilter === B.eventFilter &&
            A.eventName === B.eventName));
    return result;
}
exports.eventEquivalent = eventEquivalent;
function mapInputsEquivalent(A, B) {
    A = A || {};
    B = B || {};
    const namesA = Object.keys(A).sort();
    const namesB = Object.keys(B).sort();
    return namesA.length === namesB.length && namesA.reduce((acc, na, i) => {
        const a = A[na];
        const b = B[namesB[i]];
        return acc && na === namesB[i] && a === b;
    }, true);
}
exports.mapInputsEquivalent = mapInputsEquivalent;
function DependenciesEquivalents(A, B) {
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
    return variablesEquivalents(A.import.channels, B.import.channels)
        && variablesEquivalents(A.import.emitters, B.import.emitters)
        && variablesEquivalents(A.import.events, B.import.events)
        && variablesEquivalents(A.export.channels, B.export.channels)
        && variablesEquivalents(A.export.emitters, B.export.emitters)
        && variablesEquivalents(A.export.events, B.export.events);
}
exports.DependenciesEquivalents = DependenciesEquivalents;
function variablesEquivalents(A, B) {
    A = A || [];
    B = B || [];
    return A.length === B.length && A.reduce((acc, v1, i) => {
        const v2 = B[i];
        return acc && v1.name === v2.name && v1.type === v2.type;
    }, true);
}
exports.variablesEquivalents = variablesEquivalents;
function eventActionsEquivalent(A, B) {
    A = A || [];
    B = B || [];
    return (A.length === B.length) && A.reduce((acc, act1, i) => {
        const act2 = B[i];
        return acc && act1.channel === act2.channel && act1.affectation === act2.affectation;
    }, true);
}
exports.eventActionsEquivalent = eventActionsEquivalent;
function stateActionsEquivalents(A, B) {
    A = A || [];
    B = B || [];
    return (A.length === B.length) && A.reduce((acc, act1, i) => {
        const act2 = B[i];
        return acc && act1.channel === act2.channel && act1.affectation.value === act2.affectation.value && (act1.affectation.type === act2.affectation.type ||
            act1.affectation.type === "expression" && act2.affectation.type === undefined ||
            act2.affectation.type === "expression" && act1.affectation.type === undefined);
    }, true);
}
exports.stateActionsEquivalents = stateActionsEquivalents;
//# sourceMappingURL=ProgramObjectInterface.js.map