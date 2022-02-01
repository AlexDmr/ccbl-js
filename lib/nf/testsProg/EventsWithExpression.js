export const eventsWithExpression = {
    dependencies: {
        import: {
            emitters: [
                { name: "A", type: "number" },
                { name: "B", type: "number" }
            ],
            events: [
                { name: "EvtPlus", type: "boolean" },
                { name: "EvtMinus", type: "boolean" }
            ]
        }
    },
    localChannels: [
        { name: "N", type: "number" }
    ],
    actions: [
        { channel: "N", affectation: { value: `0` } }
    ],
    allen: {
        StartWith: [
            { type: "STATE",
                contextName: "DEBUT",
                state: "A + B < 10",
                eventFinish: { eventSource: "", eventExpression: "A > 10 or B > 10" },
                actions: [
                    { channel: "N", affectation: { value: "10" } }
                ]
            }
        ],
        During: [
            { type: "EVENT",
                contextName: "On appuie sur plus...",
                eventSource: "EvtPlus",
                eventFilter: "event.value == true",
                actions: [
                    { channel: "N", affectation: "N + 1" }
                ]
            }, { type: "EVENT",
                contextName: "On appuie sur moins...",
                eventSource: "EvtMinus",
                eventFilter: "event.value == true",
                actions: [
                    { channel: "N", affectation: "N - 1" }
                ]
            },
            { type: "STATE",
                contextName: "Pour voir start pendant fin...",
                state: "A + B > 0",
                eventStart: { eventSource: "", eventExpression: "A > 0" },
                eventFinish: { eventSource: "", eventExpression: "B < 0" },
                actions: [
                    { channel: "N", affectation: { value: "50" } }
                ]
            },
            { type: "STATE", contextName: "new event context", eventSource: "", eventExpression: "true", actions: [] }
        ],
        EndWith: [
            { type: "STATE",
                contextName: "Fin",
                eventStart: {
                    eventSource: "",
                    eventExpression: "A > 100"
                },
                actions: [
                    { channel: "N", affectation: { value: `100` } }
                ]
            }
        ]
    }
};
//# sourceMappingURL=EventsWithExpression.js.map