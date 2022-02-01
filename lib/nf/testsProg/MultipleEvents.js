export const MultipleEvents = {
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
            { type: "EVENT",
                contextName: "Reset",
                eventSource: "resetVolume",
                actions: [{ channel: "N", affectation: "N; 100; 100; linear" }]
            }, { type: "EVENT",
                contextName: "Mute",
                eventSource: "muteVolume",
                actions: [{ channel: "N", affectation: `-1` }]
            }, { type: "EVENT",
                contextName: "Neutral",
                eventSource: "moreTest",
                actions: [{ channel: "N", affectation: `50` }]
            }
        ]
    }
};
//# sourceMappingURL=MultipleEvents.js.map