export const Concurrency = {
    localChannels: [
        { name: 'N', type: 'number' }
    ],
    actions: [
        { channel: "N", affectation: { value: `0` } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "First",
                state: "true; false; 10; waitEnd",
                actionsOnEnd: [
                    { channel: "N", affectation: "N + 1" }
                ],
                allen: {
                    Meet: {
                        contextsSequence: [],
                        loop: 0
                    }
                }
            }, { type: "STATE",
                contextName: "Second",
                state: "true; false; 10; waitEnd",
                actionsOnEnd: [
                    { channel: "N", affectation: "N + 1" }
                ],
                allen: {
                    Meet: {
                        contextsSequence: [],
                        loop: 0
                    }
                }
            }
        ]
    }
};
//# sourceMappingURL=MultipleTimers.js.map