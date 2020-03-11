"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsWithExpression = {
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
            {
                contextName: "DEBUT",
                state: "A + B < 10",
                eventFinish: { eventSource: "", eventExpression: "A > 10 or B > 10" },
                actions: [
                    { channel: "N", affectation: { value: "10" } }
                ]
            }
        ],
        During: [
            {
                contextName: "On appuie sur plus...",
                eventSource: "EvtPlus",
                eventFilter: "event.value == true",
                actions: [
                    { channel: "N", affectation: "N + 1" }
                ]
            }, {
                contextName: "On appuie sur moins...",
                eventSource: "EvtMinus",
                eventFilter: "event.value == true",
                actions: [
                    { channel: "N", affectation: "N - 1" }
                ]
            },
            {
                contextName: "Pour voir start pendant fin...",
                state: "A + B > 0",
                eventStart: { eventSource: "", eventExpression: "A > 0" },
                eventFinish: { eventSource: "", eventExpression: "B < 0" },
                actions: [
                    { channel: "N", affectation: { value: "50" } }
                ]
            },
            { contextName: "new event context", eventSource: "", eventExpression: "true", actions: [] }
        ],
        EndWith: [
            {
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