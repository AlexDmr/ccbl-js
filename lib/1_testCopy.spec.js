"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domicube_1 = require("./testsProg/domicube");
const ProgramObjectInterface_1 = require("./ProgramObjectInterface");
const ProgEnfant_v2_1 = require("./testsProg/ControleParental_v2/ProgEnfant_v2");
const ProgParent_v2_1 = require("./testsProg/ControleParental_v2/ProgParent_v2");
const ProgRootParent_v3_boom_1 = require("./testsProg/ControleParental_v2/ProgRootParent_v3_boom");
const ProgRootParent_v2_1 = require("./testsProg/ControleParental_v2/ProgRootParent_v2");
const DomicubeUsage_1 = require("./testsProg/DomicubeUsage");
const EventInterpolation_1 = require("./testsProg/EventInterpolation");
const MultipleEvents_1 = require("./testsProg/MultipleEvents");
const MultipleTimers_1 = require("./testsProg/MultipleTimers");
const NoEventDuringNseconds_1 = require("./testsProg/NoEventDuringNseconds");
const progAvatar_1 = require("./testsProg/progAvatar");
const rootProg_2_1 = require("./testsProg/rootProg_2");
const rootProgAvatar_1 = require("./testsProg/rootProgAvatar");
const rootProgLoadUnload_1 = require("./testsProg/rootProgLoadUnload");
const EventsWithExpression_1 = require("./testsProg/EventsWithExpression");
describe("Copy Domicube -> actions", () => {
    it("copy is OK", () => {
        const actions = domicube_1.domicube.actions.map(a => ProgramObjectInterface_1.copyHumanReadableStateActions(a, true));
        expect(ProgramObjectInterface_1.stateActionsEquivalents(domicube_1.domicube.actions, actions, false)).toBe(true);
    });
});
describe("Copy Domicube -> DependenciesEquivalents", () => {
    it("copy is OK", () => {
        const dep = {
            import: ProgramObjectInterface_1.copyVocabulary(domicube_1.domicube.dependencies.import),
            export: ProgramObjectInterface_1.copyVocabulary(domicube_1.domicube.dependencies.export)
        };
        expect(ProgramObjectInterface_1.DependenciesEquivalents(domicube_1.domicube.dependencies, dep)).toBe(true);
    });
});
describe("Copy Domicube", () => {
    it("copy is OK", () => {
        const copyDomicube = ProgramObjectInterface_1.copyHumanReadableProgram(domicube_1.domicube, true);
        expect(ProgramObjectInterface_1.progEquivalent(domicube_1.domicube, copyDomicube)).toBe(true);
    });
});
describe("Copy progEnfantV2", () => {
    it("copy is OK", () => {
        const copyEnfantDescr = ProgramObjectInterface_1.copyHumanReadableProgram(ProgEnfant_v2_1.EnfantDescr);
        expect(ProgramObjectInterface_1.progEquivalent(ProgEnfant_v2_1.EnfantDescr, copyEnfantDescr)).toBe(true);
    });
});
describe("Copy progParentV2", () => {
    it("copy is OK", () => {
        const copyParentDescr = ProgramObjectInterface_1.copyHumanReadableProgram(ProgParent_v2_1.ParentDescr);
        expect(ProgramObjectInterface_1.progEquivalent(ProgParent_v2_1.ParentDescr, copyParentDescr)).toBe(true);
    });
});
describe("Copy RootParentDescr_V2", () => {
    it("copy is OK", () => {
        const copyRootParentDescr_V2 = ProgramObjectInterface_1.copyHumanReadableProgram(ProgRootParent_v2_1.RootParentDescr_V2);
        expect(ProgramObjectInterface_1.progEquivalent(ProgRootParent_v2_1.RootParentDescr_V2, copyRootParentDescr_V2)).toBe(true);
    });
});
describe("Copy RootParentDescr_boom", () => {
    it("copy is OK", () => {
        const copyRootParentDescr_boom = ProgramObjectInterface_1.copyHumanReadableProgram(ProgRootParent_v3_boom_1.RootParentDescr_boom_V3);
        expect(ProgramObjectInterface_1.progEquivalent(ProgRootParent_v3_boom_1.RootParentDescr_boom_V3, copyRootParentDescr_boom)).toBe(true);
    });
});
describe("Copy domicubePlus", () => {
    it("copy is OK", () => {
        const copydomicubePlus = ProgramObjectInterface_1.copyHumanReadableProgram(DomicubeUsage_1.domicubePlus, true);
        expect(ProgramObjectInterface_1.progEquivalent(DomicubeUsage_1.domicubePlus, copydomicubePlus)).toBe(true);
    });
});
describe("Copy EventInterpolation", () => {
    it("copy is OK", () => {
        const copyEventInterpolation = ProgramObjectInterface_1.copyHumanReadableProgram(EventInterpolation_1.EventInterpolation);
        expect(ProgramObjectInterface_1.progEquivalent(EventInterpolation_1.EventInterpolation, copyEventInterpolation)).toBe(true);
    });
});
describe("Copy MultipleEvents", () => {
    it("copy is OK", () => {
        const copyMultipleEvents = ProgramObjectInterface_1.copyHumanReadableProgram(MultipleEvents_1.MultipleEvents);
        expect(ProgramObjectInterface_1.progEquivalent(MultipleEvents_1.MultipleEvents, copyMultipleEvents)).toBe(true);
    });
});
describe("Copy Concurrency", () => {
    it("copy is OK", () => {
        const copyConcurrency = ProgramObjectInterface_1.copyHumanReadableProgram(MultipleTimers_1.Concurrency);
        expect(ProgramObjectInterface_1.progEquivalent(MultipleTimers_1.Concurrency, copyConcurrency)).toBe(true);
    });
});
describe("Copy NoEventDuringNsec", () => {
    it("copy is OK", () => {
        const copyNoEventDuringNsec = ProgramObjectInterface_1.copyHumanReadableProgram(NoEventDuringNseconds_1.NoEventDuringNsec);
        expect(ProgramObjectInterface_1.progEquivalent(NoEventDuringNseconds_1.NoEventDuringNsec, copyNoEventDuringNsec)).toBe(true);
    });
});
describe("Copy AvatarProgDescr", () => {
    it("copy is OK", () => {
        const copyAvatarProgDescr = ProgramObjectInterface_1.copyHumanReadableProgram(progAvatar_1.AvatarProgDescr);
        expect(ProgramObjectInterface_1.progEquivalent(progAvatar_1.AvatarProgDescr, copyAvatarProgDescr)).toBe(true);
    });
});
describe("Copy rootProgDescr_2", () => {
    it("copy is OK", () => {
        const copyrootProgDescr_2 = ProgramObjectInterface_1.copyHumanReadableProgram(rootProg_2_1.rootProgDescr_2);
        expect(ProgramObjectInterface_1.progEquivalent(rootProg_2_1.rootProgDescr_2, copyrootProgDescr_2)).toBe(true);
    });
});
describe("Copy rootProgAvatar", () => {
    it("copy is OK", () => {
        const copyrootProgAvatar = ProgramObjectInterface_1.copyHumanReadableProgram(rootProgAvatar_1.rootProgAvatar);
        expect(ProgramObjectInterface_1.progEquivalent(rootProgAvatar_1.rootProgAvatar, copyrootProgAvatar)).toBe(true);
    });
});
describe("Copy rootProg", () => {
    it("copy is OK", () => {
        const copyrootProg = ProgramObjectInterface_1.copyHumanReadableProgram(rootProgLoadUnload_1.rootProg);
        expect(ProgramObjectInterface_1.progEquivalent(rootProgLoadUnload_1.rootProg, copyrootProg)).toBe(true);
    });
});
describe("Copy eventsWithExpression", () => {
    it("copy of EndWith start event is OK", () => {
        const copyeventsWithExpression = ProgramObjectInterface_1.copyHumanReadableProgram(EventsWithExpression_1.eventsWithExpression);
        const context1 = EventsWithExpression_1.eventsWithExpression.allen.EndWith[0];
        const context2 = copyeventsWithExpression.allen.EndWith[0];
        expect(ProgramObjectInterface_1.eventEquivalent(context1.eventStart, context2.eventStart, false)).toBe(true);
    });
    it("copy of EndWith actions are OK", () => {
        const copyeventsWithExpression = ProgramObjectInterface_1.copyHumanReadableProgram(EventsWithExpression_1.eventsWithExpression);
        const context1 = EventsWithExpression_1.eventsWithExpression.allen.EndWith[0];
        const context2 = copyeventsWithExpression.allen.EndWith[0];
        expect(ProgramObjectInterface_1.stateActionsEquivalents(context1.actions, context2.actions, false)).toBe(true);
    });
    it("copy of EndWith is OK", () => {
        const copyeventsWithExpression = ProgramObjectInterface_1.copyHumanReadableProgram(EventsWithExpression_1.eventsWithExpression);
        expect(ProgramObjectInterface_1.contextEquivalent(EventsWithExpression_1.eventsWithExpression.allen.EndWith[0], copyeventsWithExpression.allen.EndWith[0], false)).toBe(true);
    });
    it("copy of During[3] is OK", () => {
        const copyeventsWithExpression = ProgramObjectInterface_1.copyHumanReadableProgram(EventsWithExpression_1.eventsWithExpression);
        const eq = ProgramObjectInterface_1.contextEquivalent(EventsWithExpression_1.eventsWithExpression.allen.During[3], copyeventsWithExpression.allen.During[3], false);
        if (!eq) {
            console.log("copy of During[3] is NOT OK", EventsWithExpression_1.eventsWithExpression.allen.During[3], copyeventsWithExpression.allen.During[3]);
        }
        expect(eq).toBe(true);
    });
    it("copy is OK", () => {
        const copyeventsWithExpression = ProgramObjectInterface_1.copyHumanReadableProgram(EventsWithExpression_1.eventsWithExpression);
        expect(ProgramObjectInterface_1.progEquivalent(EventsWithExpression_1.eventsWithExpression, copyeventsWithExpression)).toBe(true);
    });
});
//# sourceMappingURL=1_testCopy.spec.js.map