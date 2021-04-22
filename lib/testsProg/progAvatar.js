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
            {
                contextName: "BobAtHome",
                state: "BobAtHome",
                allen: {
                    During: [
                        {
                            contextName: "AliceAtHome",
                            state: "AliceAtHome",
                            actions: [
                                { channel: "lampAvatar", affectation: { value: `"orange"` } }
                            ],
                            allen: {
                                During: [
                                    {
                                        contextName: "AliceAvailable",
                                        state: "AliceAvailable",
                                        actions: [
                                            { channel: "lampAvatar", affectation: { value: `"green"` } }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
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