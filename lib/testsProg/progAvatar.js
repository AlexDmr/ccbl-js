export const AvatarProgDescr = {
    dependencies: {
        import: {
            channels: [
                { name: "lampAvatar", type: "color" }
            ],
            emitters: [
                { name: "BobAtHome", type: "boolean" },
                { name: "AliceAtHome", type: "boolean" },
                { name: "AliceAtBobHome", type: "boolean" },
                { name: "AliceAvailable", type: "boolean" },
            ]
        },
        export: {
            channels: [
                { name: "MusicMode", type: "string" }
            ]
        }
    },
    localChannels: [],
    actions: [
        { channel: "lampAvatar", affectation: { value: `"off"` } },
        { channel: "MusicMode", affectation: { value: `"off"` } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "BobAtHome",
                state: "BobAtHome",
                allen: {
                    During: [
                        { type: "STATE",
                            contextName: "AliceAtHome",
                            state: "AliceAtHome",
                            actions: [
                                { channel: "lampAvatar", affectation: { value: `"orange"` } }
                            ],
                            allen: {
                                During: [
                                    { type: "STATE",
                                        contextName: "AliceAvailable",
                                        state: "AliceAvailable",
                                        actions: [
                                            { channel: "lampAvatar", affectation: { value: `"green"` } }
                                        ]
                                    }
                                ]
                            }
                        },
                        { type: "STATE",
                            contextName: "AliceAtBobHome",
                            state: "AliceAtBobHome",
                            actions: [
                                { channel: "lampAvatar", affectation: { value: `"white"` } },
                                { channel: "MusicMode", affectation: { value: `"Barry White"` } }
                            ]
                        }
                    ]
                }
            }
        ]
    }
};
//# sourceMappingURL=progAvatar.js.map