export const EnfantDescr = {
    dependencies: {
        import: {
            emitters: [
                { name: "hifiIsOn", type: "boolean" },
                { name: "lampSwitch", type: "boolean" },
                { name: "hifiSwitch", type: "boolean" }
            ],
            channels: [
                { name: "hifiVolume", type: "number" },
                { name: "lampAvatar", type: "color" },
                { name: "log", type: "string" }
            ],
            events: [
                { name: "hifiLowButton", type: "boolean" },
                { name: "hifiHighButton", type: "boolean" }
            ]
        }
    },
    localChannels: [],
    actions: [
        { channel: "lampAvatar", affectation: { value: `"off"` } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "lampSwitch",
                state: "lampSwitch",
                actions: [
                    { channel: "lampAvatar", affectation: { value: `"white"` } }
                ],
                allen: {
                    During: [
                        { type: "STATE",
                            contextName: "lampWithHifi",
                            state: "hifiIsOn",
                            actions: [
                                { channel: "lampAvatar", affectation: { value: `"yellow"` } }
                            ]
                        }
                    ]
                }
            },
            { type: "STATE",
                contextName: "hifiSwitch",
                state: "hifiSwitch",
                actions: [
                    { channel: "hifiVolume", affectation: { value: `50` } }
                ],
                allen: {
                    During: [
                        { type: "EVENT",
                            contextName: "lowVolume",
                            eventSource: "hifiLowButton",
                            actions: [
                                { channel: "hifiVolume", affectation: `hifiVolume - 10` }
                            ]
                        },
                        { type: "EVENT",
                            contextName: "highVolume",
                            eventSource: "hifiHighButton",
                            actions: [
                                { channel: "hifiVolume", affectation: `hifiVolume + 10` }
                            ]
                        }
                    ]
                }
            }
        ]
    }
};
//# sourceMappingURL=ProgEnfant_v2.js.map