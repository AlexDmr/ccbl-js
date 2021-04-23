export const ContextStateEventsStartFinish = {
    dependencies: {
        import: {
            events: [
                { name: "bt", type: "boolean" }
            ],
            emitters: [
                { name: "temp", type: "number" }
            ],
            channels: [
                { name: "ambiance", type: "color" }
            ]
        }
    },
    actions: [
        { channel: "ambiance", affectation: { value: "'black'" } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "start state finish",
                eventStart: { eventSource: "bt" },
                eventFinish: { eventSource: "bt" },
                state: "temp > 20",
                actions: [
                    { channel: "ambiance", affectation: { value: "'yellow'" } }
                ]
            }
        ]
    }
};
//# sourceMappingURL=ContextStateEventsStartFinish.js.map