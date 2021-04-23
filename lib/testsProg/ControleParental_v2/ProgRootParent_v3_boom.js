import { EnfantDescr } from "./ProgEnfant_v2";
import { ParentDescr } from "./ProgParent_v2";
export const RootParentDescr_boom_V3 = {
    subPrograms: {
        Enfant: EnfantDescr,
        Parent: ParentDescr
    },
    dependencies: {
        import: {
            emitters: [
                { name: "Clock", type: "clock" },
                { name: "lampSwitch", type: "boolean" },
                { name: "hifiSwitch", type: "boolean" },
                { name: "boom", type: "boolean" }
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
        During: [{ type: "STATE",
                contextName: "Mode normal",
                state: "not boom",
                allen: {
                    During: [{
                            programId: "Enfant",
                            as: "ProgEnfant",
                            mapInputs: {}
                        }, {
                            programId: "Parent",
                            as: "ProgParent",
                            mapInputs: {}
                        }]
                }
            }, { type: "STATE",
                contextName: "Mode boom",
                state: "boom",
                allen: {
                    During: [{
                            programId: "Parent",
                            as: "ProgParent",
                            mapInputs: {}
                        }, {
                            programId: "Enfant",
                            as: "ProgEnfant",
                            mapInputs: {}
                        }]
                }
            }, { type: "STATE",
                contextName: "Security",
                state: "true",
                actions: [
                    { channel: "hifiVolume", affectation: { type: "constraint", value: "min(hifiVolume, 80)" } }
                ]
            }]
    }
};
//# sourceMappingURL=ProgRootParent_v3_boom.js.map