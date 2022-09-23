import { pgBlink } from "./alternateBlink";
export const pgTestDomus = {
    name: "LivingRoom lights",
    description: "Just a test program for Domus",
    subPrograms: {
        pgBlink: pgBlink
    },
    dependencies: {
        import: {
            channels: [
                { name: "dLivingroomLight1", type: "Dimmer [0-100]" },
                { name: "dLivingroomLight2", type: "Dimmer [0-100]" },
                { name: "dKitchenLight1", type: "Dimmer" },
                { name: "dKitchenLight2", type: "Dimmer" },
            ],
            emitters: [
                { name: "Buttons6BathroomMiddleRight", type: "Dimmer" },
                { name: "nTempLivingroom", type: "Number:Temperature" },
                { name: "nHydroLivingroom", type: "Number:Dimensionless" },
                { name: "nCo2Livingroom", type: "Number" },
                { name: "sKitchenLight3", type: "Switch" },
            ]
        },
        export: {
            channels: [
                { name: "mode", type: "enum: none | pg1 | pg2" }
            ]
        },
    },
    localChannels: [
        { name: "N", type: "Number" },
    ],
    actions: [
        { channel: "N", affectation: { value: "3000" } },
        { channel: "dLivingroomLight1", affectation: { value: "30" } },
        { channel: "dLivingroomLight2", affectation: { value: "20" } },
        { channel: "dKitchenLight1", affectation: { value: "0" } },
        { channel: "dKitchenLight2", affectation: { value: "0" } },
        { channel: "mode", affectation: { value: `"pg1"` } },
    ],
    allen: {
        During: [
            {
                type: "STATE", contextName: "expé1", state: `mode == "pg1"`,
                allen: {
                    During: [
                        { programId: "pgBlink", as: "expé_1_livingroom",
                            description: "A blinking test experiment in livingroom",
                            mapInputs: {
                                Light1: "dLivingroomLight1",
                                Light2: "dLivingroomLight2",
                                min: "0", max: "100", dt: "3000"
                            }
                        },
                    ]
                }
            },
            {
                type: "STATE", contextName: "expé2", state: `mode == "pg2"`,
                allen: {
                    During: [
                        { programId: "pgBlink", as: "expé_2_kitchen",
                            description: "An experiment for the kitchen",
                            mapInputs: {
                                Light1: "dKitchenLight1",
                                Light2: "dKitchenLight2",
                                min: "20", max: "100", dt: "2000"
                            }
                        },
                    ]
                }
            },
        ]
    }
};
//# sourceMappingURL=pgTestDomus.js.map