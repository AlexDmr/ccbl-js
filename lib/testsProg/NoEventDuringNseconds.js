export const NoEventDuringNsec = {
    dependencies: {
        import: {
            events: [
                { name: "E", type: "any" }
            ],
            emitters: [
                { name: "Vout", type: "T" },
                { name: "Vin", type: "T" },
                { name: "N", type: "number" }
            ]
        },
        export: {
            channels: [
                { name: "V", type: "T" }
            ]
        }
    },
    actions: [
        { channel: "V", affectation: { value: `Vout` } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "SeenEDuringLastNsec",
                eventStart: { eventSource: "E" },
                state: "true; false; N; waitEnd",
                actions: [
                    { channel: "V", affectation: { value: `Vin` } }
                ]
            }
        ]
    }
};
//# sourceMappingURL=NoEventDuringNseconds.js.map