import { EnfantDescr } from "./ProgEnfant_v2";
import { ParentDescr } from "./ProgParent_v2";
export const RootParentDescr_V2 = {
    subPrograms: {
        Enfant: EnfantDescr,
        Parent: ParentDescr
    },
    dependencies: {
        import: {
            emitters: [
                { name: "Clock", type: "clock" },
                { name: "lampSwitch", type: "boolean" },
                { name: "hifiSwitch", type: "boolean" }
            ],
            channels: [
                { name: "hifiVolume", type: "number" },
                { name: "lampAvatar", type: "color" }
            ],
            events: [
                { name: "hifiLowButton", type: "button" },
                { name: "hifiHighButton", type: "button" },
                { name: "parentsHifiButton", type: "button" }
            ]
        }
    },
    localChannels: [
        { name: "hifiIsOn", type: "boolean" },
        { name: "log", type: "string" },
    ],
    actions: [
        { channel: "lampAvatar", affectation: { value: `"off"` } },
        { channel: "hifiVolume", affectation: { value: `0` } },
        { channel: "hifiIsOn", affectation: { value: `hifiVolume != 0` } },
        { channel: "log", affectation: { value: `"[root]root"` } }
    ],
    allen: {
        During: [{
                programId: "Enfant",
                as: "ProgEnfant",
                mapInputs: {}
            },
            {
                programId: "Parent",
                as: "ProgParent",
                mapInputs: {}
            }
        ]
    }
};
//# sourceMappingURL=ProgRootParent_v2.js.map