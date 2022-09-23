export const pgBlink = {
    name: "LivingRoom lights",
    description: "lights 1 and 2 alternatively blink from min to max during dt ms.",
    dependencies: {
        import: {
            channels: [
                { name: "Light1", type: "Dimmer [0-100]" },
                { name: "Light2", type: "Dimmer [0-100]" },
            ],
            emitters: [
                { name: "dt", type: "Number" },
                { name: "min", type: "Number" },
                { name: "max", type: "Number" },
            ]
        },
    },
    actions: [],
    allen: {
        During: [
            {
                type: "STATE", contextName: "ping", state: "true; false; dt; waitEnd",
                actions: [
                    { channel: "Light1", affectation: { value: "min" } },
                    { channel: "Light2", affectation: { value: "max" } }
                ], allen: {
                    Meet: {
                        contextsSequence: [
                            {
                                type: "STATE", contextName: "pong", state: "true; false; dt; waitEnd",
                                actions: [
                                    { channel: "Light1", affectation: { value: "max" } },
                                    { channel: "Light2", affectation: { value: "min" } }
                                ]
                            },
                        ],
                        loop: 0
                    }
                }
            },
        ]
    },
};
//# sourceMappingURL=alternateBlink.js.map