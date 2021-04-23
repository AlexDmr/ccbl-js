export const ParentDescr = {
    dependencies: {
        import: {
            emitters: [
                { name: "Clock", type: "clock" }
            ],
            channels: [
                { name: "hifiVolume", type: "number" },
                { name: "lampAvatar", type: "color" },
                { name: "log", type: "string" }
            ],
            events: [
                { name: "parentsHifiButton", type: "button" }
            ]
        }
    },
    localChannels: [
        { name: "parentsHifiButtonState", type: "boolean" }
    ],
    actions: [
        { channel: "log", affectation: { value: `"[parent]root"` } },
        { channel: "parentsHifiButtonState", affectation: { value: `false` } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "etatSilencieux",
                state: "(Clock>=20 or parentsHifiButtonState)",
                actions: [
                    { channel: "log", affectation: { value: `"[parent]etatSilencieux"` } },
                    { channel: "hifiVolume", affectation: { type: "constraint", value: `min(50,hifiVolume)` } }
                ]
            },
            { type: "STATE",
                contextName: "couvreFeu",
                state: "Clock>=22",
                actions: [
                    { channel: "lampAvatar", affectation: { value: `"off"` } },
                    { channel: "hifiVolume", affectation: { value: `0` } },
                    { channel: "log", affectation: { value: `"[parent]couvreFeu"` } }
                ]
            },
            { type: "EVENT",
                contextName: "pressParentsButton",
                eventSource: "parentsHifiButton",
                actions: [
                    { channel: "parentsHifiButtonState", affectation: `not(parentsHifiButtonState)` }
                ]
            }
        ]
    }
};
//# sourceMappingURL=ProgParent_v2.js.map