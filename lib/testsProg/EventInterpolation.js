"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventInterpolation = {
    dependencies: {
        import: {
            events: [
                { name: "resetVolume", type: "string" }
            ]
        }
    },
    localChannels: [
        { name: 'Volume', type: 'number' }
    ],
    actions: [
        { channel: "Volume", affectation: { value: `0` } }
    ],
    allen: {
        During: [
            {
                contextName: "Reset",
                eventSource: "resetVolume",
                actions: [{ channel: "Volume", affectation: "Volume; 100; 100; linear" }]
            }
        ]
    }
};
//# sourceMappingURL=EventInterpolation.js.map