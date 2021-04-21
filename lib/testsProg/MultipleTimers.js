"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concurrency = void 0;
exports.Concurrency = {
    localChannels: [
        { name: 'N', type: 'number' }
    ],
    actions: [
        { channel: "N", affectation: { value: `0` } }
    ],
    allen: {
        During: [
            {
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
            }, {
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