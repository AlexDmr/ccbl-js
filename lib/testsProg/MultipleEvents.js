"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleEvents = {
    dependencies: {
        import: {
            events: [
                { name: "resetVolume", type: "string" },
                { name: "moreTest", type: "string" },
                { name: "muteVolume", type: "string" }
            ]
        }
    },
    localChannels: [
        { name: 'N', type: 'number' }
    ],
    actions: [
        { channel: "N", affectation: { value: `0` } }
    ],
    allen: {
        During: [
            {
                contextName: "Reset",
                eventSource: "resetVolume",
                actions: [{ channel: "N", affectation: "N; 100; 100; linear" }]
            }, {
                contextName: "Mute",
                eventSource: "muteVolume",
                actions: [{ channel: "N", affectation: `-1` }]
            }, {
                contextName: "Neutral",
                eventSource: "moreTest",
                actions: [{ channel: "N", affectation: `50` }]
            }
        ]
    }
};
//# sourceMappingURL=MultipleEvents.js.map