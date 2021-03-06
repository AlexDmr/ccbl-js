export const ChauffageState = {
    dependencies: {
        import: {
            emitters: [
                { name: "temp", type: "number" },
                { name: "tempMin", type: "number" },
                { name: "tempMax", type: "number" }
            ],
            channels: [
                { name: "chauffage", type: "number" }
            ]
        }
    },
    actions: [
        { channel: "chauffage", affectation: { value: "false" } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "Chauffe Marcel !",
                eventStart: { eventSource: "", eventExpression: "temp < tempMin" },
                eventFinish: { eventSource: "", eventExpression: "temp > tempMax" },
                actions: [
                    { channel: "chauffage", affectation: { value: "true" } }
                ]
            }
        ]
    }
};
export const Hysteresis = {
    dependencies: {
        import: {
            emitters: [
                { name: "temp", type: "number" }
            ],
            channels: [
                { name: "chauffage", type: "number" }
            ]
        }
    },
    actions: [
        { channel: "chauffage", affectation: { value: "false" } }
    ],
    subPrograms: {
        ChauffageState: ChauffageState
    },
    allen: {
        During: [
            {
                programId: "ChauffageState",
                mapInputs: {
                    tempMin: "18",
                    tempMax: "22"
                },
                as: "chauffeState"
            }
        ]
    }
};
//# sourceMappingURL=Hysteresis.js.map