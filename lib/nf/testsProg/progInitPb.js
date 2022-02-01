export const progInitPb = {
    dependencies: {
        import: {
            emitters: [
                { name: "A", type: "number" },
                { name: "B", type: "number" }
            ]
        }
    },
    localChannels: [
        { name: "Cs", type: "string" },
        { name: "Cn", type: "number" },
        { name: 'LOG', type: 'string' },
        { name: 'deltaTime', type: 'number' }
    ],
    actions: [
        { channel: "Cs", affectation: { value: `"zéro"` } },
        { channel: "Cn", affectation: { value: "0" } },
        { channel: "LOG", affectation: { value: `"OUT"` } },
        { channel: "deltaTime", affectation: { value: "1111" } },
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "A != B",
                state: "A != B",
                actionsOnStart: [
                    { channel: "Cn", affectation: `Cn + 1` }
                ],
                actionsOnEnd: [
                    { channel: "Cn", affectation: `Cn + 9` }
                ],
                allen: {
                    During: [
                        { type: "STATE",
                            contextName: "yo",
                            state: "true; false; deltaTime; waitEnd",
                            actionsOnStart: [
                                { channel: "Cs", affectation: `"inside"` }
                            ],
                            actionsOnEnd: [
                                { channel: "Cs", affectation: `"outside"` }
                            ],
                            actions: [
                                { channel: "LOG", affectation: { value: `"IN"` } }
                            ]
                        }
                    ]
                }
            }
        ]
    }
};
//# sourceMappingURL=progInitPb.js.map