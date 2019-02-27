"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgEnfant_v2_1 = require("./ProgEnfant_v2");
const ProgParent_v2_1 = require("./ProgParent_v2");
exports.RootParentDescr = {
    subPrograms: {
        Enfant: ProgEnfant_v2_1.EnfantDescr,
        Parent: ProgParent_v2_1.ParentDescr
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