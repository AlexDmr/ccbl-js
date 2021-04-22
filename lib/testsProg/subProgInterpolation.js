export const subProgInterpolation = {
    dependencies: {
        import: {
            emitters: [
                { name: "N", type: "number" }
            ]
        }
    },
    subPrograms: {
        SP: {
            dependencies: {
                import: {
                    emitters: [
                        { name: "N", type: "number" }
                    ]
                }
            },
            localChannels: [
                { name: "C", type: "number" }
            ],
            allen: {
                During: [
                    {
                        contextName: "garde 1",
                        state: "N > 110",
                        actions: [
                            { channel: "C", affectation: { value: "100" } }
                        ],
                        allen: {
                            During: [
                                {
                                    contextName: "interpolation",
                                    state: "true; false; 1000; waitEnd"
                                }
                            ]
                        }
                    },
                    {
                        contextName: "garde 2",
                        state: "N > 150",
                        actions: [
                            { channel: "C", affectation: { value: "150" } }
                        ],
                        allen: {
                            During: [
                                {
                                    contextName: "interpolation",
                                    state: "true; false; 1000; waitEnd"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    },
    actions: [],
    allen: {
        During: [
            {
                contextName: "garde 1",
                state: "N > 100",
                allen: {
                    During: [
                        {
                            as: "SP1",
                            mapInputs: {},
                            programId: "SP"
                        }
                    ]
                }
            }
        ]
    }
};
//# sourceMappingURL=subProgInterpolation.js.map