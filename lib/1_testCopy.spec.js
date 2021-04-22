import { domicube } from './testsProg/domicube';
import { contextEquivalent, copyHumanReadableProgram, copyHumanReadableStateActions, copyVocabulary, DependenciesEquivalents, eventEquivalent, progEquivalent, stateActionsEquivalents } from "./ProgramObjectInterface";
import { EnfantDescr } from "./testsProg/ControleParental_v2/ProgEnfant_v2";
import { ParentDescr } from "./testsProg/ControleParental_v2/ProgParent_v2";
import { RootParentDescr_boom_V3 } from "./testsProg/ControleParental_v2/ProgRootParent_v3_boom";
import { RootParentDescr_V2 } from "./testsProg/ControleParental_v2/ProgRootParent_v2";
import { domicubePlus } from "./testsProg/DomicubeUsage";
import { EventInterpolation } from "./testsProg/EventInterpolation";
import { MultipleEvents } from "./testsProg/MultipleEvents";
import { Concurrency } from "./testsProg/MultipleTimers";
import { NoEventDuringNsec } from "./testsProg/NoEventDuringNseconds";
import { AvatarProgDescr } from "./testsProg/progAvatar";
import { rootProgDescr_2 } from "./testsProg/rootProg_2";
import { rootProgAvatar } from "./testsProg/rootProgAvatar";
import { rootProg } from "./testsProg/rootProgLoadUnload";
import { eventsWithExpression } from "./testsProg/EventsWithExpression";
describe("Copy Domicube -> actions", () => {
    it("copy is OK", () => {
        const actions = domicube.actions.map(a => copyHumanReadableStateActions(a, true));
        expect(stateActionsEquivalents(domicube.actions, actions, false)).toBe(true);
    });
});
describe("Copy Domicube -> DependenciesEquivalents", () => {
    it("copy is OK", () => {
        const dep = {
            import: copyVocabulary(domicube.dependencies.import),
            export: copyVocabulary(domicube.dependencies.export)
        };
        expect(DependenciesEquivalents(domicube.dependencies, dep)).toBe(true);
    });
});
describe("Copy Domicube", () => {
    it("copy is OK", () => {
        const copyDomicube = copyHumanReadableProgram(domicube, true);
        expect(progEquivalent(domicube, copyDomicube)).toBe(true);
    });
});
describe("Copy progEnfantV2", () => {
    it("copy is OK", () => {
        const copyEnfantDescr = copyHumanReadableProgram(EnfantDescr);
        expect(progEquivalent(EnfantDescr, copyEnfantDescr)).toBe(true);
    });
});
describe("Copy progParentV2", () => {
    it("copy is OK", () => {
        const copyParentDescr = copyHumanReadableProgram(ParentDescr);
        expect(progEquivalent(ParentDescr, copyParentDescr)).toBe(true);
    });
});
describe("Copy RootParentDescr_V2", () => {
    it("copy is OK", () => {
        const copyRootParentDescr_V2 = copyHumanReadableProgram(RootParentDescr_V2);
        expect(progEquivalent(RootParentDescr_V2, copyRootParentDescr_V2)).toBe(true);
    });
});
describe("Copy RootParentDescr_boom", () => {
    it("copy is OK", () => {
        const copyRootParentDescr_boom = copyHumanReadableProgram(RootParentDescr_boom_V3);
        expect(progEquivalent(RootParentDescr_boom_V3, copyRootParentDescr_boom)).toBe(true);
    });
});
describe("Copy domicubePlus", () => {
    it("copy is OK", () => {
        const copydomicubePlus = copyHumanReadableProgram(domicubePlus, true);
        expect(progEquivalent(domicubePlus, copydomicubePlus)).toBe(true);
    });
});
describe("Copy EventInterpolation", () => {
    it("copy is OK", () => {
        const copyEventInterpolation = copyHumanReadableProgram(EventInterpolation);
        expect(progEquivalent(EventInterpolation, copyEventInterpolation)).toBe(true);
    });
});
describe("Copy MultipleEvents", () => {
    it("copy is OK", () => {
        const copyMultipleEvents = copyHumanReadableProgram(MultipleEvents);
        expect(progEquivalent(MultipleEvents, copyMultipleEvents)).toBe(true);
    });
});
describe("Copy Concurrency", () => {
    it("copy is OK", () => {
        const copyConcurrency = copyHumanReadableProgram(Concurrency);
        expect(progEquivalent(Concurrency, copyConcurrency)).toBe(true);
    });
});
describe("Copy NoEventDuringNsec", () => {
    it("copy is OK", () => {
        const copyNoEventDuringNsec = copyHumanReadableProgram(NoEventDuringNsec);
        expect(progEquivalent(NoEventDuringNsec, copyNoEventDuringNsec)).toBe(true);
    });
});
describe("Copy AvatarProgDescr", () => {
    it("copy is OK", () => {
        const copyAvatarProgDescr = copyHumanReadableProgram(AvatarProgDescr);
        expect(progEquivalent(AvatarProgDescr, copyAvatarProgDescr)).toBe(true);
    });
});
describe("Copy rootProgDescr_2", () => {
    it("copy is OK", () => {
        const copyrootProgDescr_2 = copyHumanReadableProgram(rootProgDescr_2);
        expect(progEquivalent(rootProgDescr_2, copyrootProgDescr_2)).toBe(true);
    });
});
describe("Copy rootProgAvatar", () => {
    it("copy is OK", () => {
        const copyrootProgAvatar = copyHumanReadableProgram(rootProgAvatar);
        expect(progEquivalent(rootProgAvatar, copyrootProgAvatar)).toBe(true);
    });
});
describe("Copy rootProg", () => {
    it("copy is OK", () => {
        const copyrootProg = copyHumanReadableProgram(rootProg);
        expect(progEquivalent(rootProg, copyrootProg)).toBe(true);
    });
});
describe("Copy eventsWithExpression", () => {
    it("copy of EndWith start event is OK", () => {
        const copyeventsWithExpression = copyHumanReadableProgram(eventsWithExpression);
        const context1 = eventsWithExpression.allen.EndWith[0];
        const context2 = copyeventsWithExpression.allen.EndWith[0];
        expect(eventEquivalent(context1.eventStart, context2.eventStart, false)).toBe(true);
    });
    it("copy of EndWith actions are OK", () => {
        const copyeventsWithExpression = copyHumanReadableProgram(eventsWithExpression);
        const context1 = eventsWithExpression.allen.EndWith[0];
        const context2 = copyeventsWithExpression.allen.EndWith[0];
        expect(stateActionsEquivalents(context1.actions, context2.actions, false)).toBe(true);
    });
    it("copy of EndWith is OK", () => {
        const copyeventsWithExpression = copyHumanReadableProgram(eventsWithExpression);
        expect(contextEquivalent(eventsWithExpression.allen.EndWith[0], copyeventsWithExpression.allen.EndWith[0], false)).toBe(true);
    });
    it("copy of During[3] is OK", () => {
        const copyeventsWithExpression = copyHumanReadableProgram(eventsWithExpression);
        const eq = contextEquivalent(eventsWithExpression.allen.During[3], copyeventsWithExpression.allen.During[3], false);
        if (!eq) {
            console.log("copy of During[3] is NOT OK", eventsWithExpression.allen.During[3], copyeventsWithExpression.allen.During[3]);
        }
        expect(eq).toBe(true);
    });
    it("copy is OK", () => {
        const copyeventsWithExpression = copyHumanReadableProgram(eventsWithExpression);
        expect(progEquivalent(eventsWithExpression, copyeventsWithExpression)).toBe(true);
    });
});
//# sourceMappingURL=1_testCopy.spec.js.map