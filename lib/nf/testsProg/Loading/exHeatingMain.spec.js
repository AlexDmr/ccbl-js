import { getNewChannel } from "../../Channel";
import { CCBLTestClock } from "../../Clock";
import { CCBLEmitterValue } from "../../EmitterValue";
import { CCBLEvent } from "../../Event";
import { CCBLEnvironmentExecution } from "../../ExecutionEnvironment";
import { CCBLProgramObject } from "../../ProgramObject";
const pipo = {
    dependencies: {
        import: {
            events: [],
            emitters: [
                { name: "Eve", type: "People" },
                { name: "tempOutside", type: "number" },
            ],
            channels: [
                { name: "Avatar", type: "COLOR" },
                { name: "openWindows", type: "boolean" },
                { name: "Heating", type: "boolean" },
                { name: "tempInside", type: "number" },
            ],
        },
    },
    localChannels: [
        { name: "deltaTime", type: "number" },
        { name: "deltaTemp", type: "number" },
    ],
    actions: [
        { channel: "openWindows", affectation: { value: "false" } },
        { channel: "Heating", affectation: { value: "false" } },
        { channel: "Avatar", affectation: { value: "'black'" } },
        { channel: "tempInside", affectation: { value: "20" } },
    ],
    allen: {
        During: [
            {
                type: "STATE",
                contextName: "Temperature interne devient temperature externe plus ou moins vite",
                state: "true",
                actions: [
                    { channel: "deltaTime", affectation: { value: "100" } },
                    {
                        channel: "deltaTemp",
                        affectation: { value: "sign(tempOutside - tempInside)" },
                    },
                ],
                allen: {
                    During: [
                        {
                            type: "STATE",
                            contextName: "Fenêtres fermé => faut voir",
                            state: "not openWindows",
                            actions: [
                                { channel: "deltaTime", affectation: { value: "1000" } },
                            ],
                            allen: {
                                During: [
                                    {
                                        type: "STATE",
                                        contextName: "chauffage",
                                        state: "Heating",
                                        actions: [
                                            { channel: "deltaTemp", affectation: { value: "1" } },
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            type: "STATE",
                            contextName: "change température",
                            state: "deltaTemp != 0",
                            allen: {
                                During: [
                                    {
                                        type: "STATE",
                                        contextName: "Ajustement de temperature",
                                        state: "true; false; deltaTime; waitEnd",
                                        actionsOnEnd: [
                                            {
                                                channel: "tempInside",
                                                affectation: "tempInside + deltaTemp",
                                            },
                                        ],
                                        allen: { Meet: { contextsSequence: [], loop: 0 } },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            { type: "STATE", contextName: "subProgRoot" },
        ],
    },
};
console.log(pipo);
const str = `
{
    "dependencies": {
        "import": {
            "events": [],
            "emitters": [
                { "name": "Eve", "type": "People" },
                { "name": "tempOutside", "type": "number" }
            ],
            "channels": [
                { "name": "Avatar", "type": "COLOR" },
                { "name": "openWindows", "type": "boolean" },
                { "name": "Heating", "type": "boolean" },
                { "name": "tempInside", "type": "number" }
            ]
        }
    },
    "localChannels": [
        { "name": "deltaTime", "type": "number" },
        { "name": "deltaTemp", "type": "number" }
    ],
    "actions": [
        { "channel": "openWindows", "affectation": { "value": "false" } },
        { "channel": "Heating", "affectation": { "value": "false" } },
        { "channel": "Avatar", "affectation": { "value": "'black'" } },
        { "channel": "tempInside", "affectation": { "value": "20" } }
    ],
    "allen": {
        "During": [
            { "type": "STATE",
                "contextName": "Temperature interne devient temperature externe plus ou moins vite",
                "state": "true",
                "actions": [
                    { "channel": "deltaTime", "affectation": { "value": "100" } },
                    { "channel": "deltaTemp", "affectation": { "value": "sign(tempOutside - tempInside)" } }
                ],
                "allen": {
                    "During": [
                        { "type": "STATE",
                            "contextName": "Fenêtres fermé => faut voir",
                            "state": "not openWindows",
                            "actions": [
                                { "channel": "deltaTime", "affectation": { "value": "1000" } }
                            ],
                            "allen": {
                                "During": [
                                    { "type": "STATE",
                                        "contextName": "chauffage",
                                        "state": "Heating",
                                        "actions": [
                                            { "channel": "deltaTemp", "affectation": { "value": "1" } }
                                        ]
                                    }
                                ]
                            }
                        },
                        { "type": "STATE",
                            "contextName": "change température",
                            "state": "deltaTemp != 0",
                            "allen": {
                                "During": [
                                    {   "type": "STATE",
                                    "contextName": "Ajustement de temperature",
                                        "state": "true; false; deltaTime; waitEnd",
                                        "actionsOnEnd": [
                                            { "channel": "tempInside", "affectation": "tempInside + deltaTemp" }
                                        ],
                                        "allen": {
                                            "Meet": {
                                                "contextsSequence": [],
                                                "loop": 0
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }, {
                "type": "STATE",
                "contextName": "subProgRoot"
            }
        ]
    }
}
`;
const P = JSON.parse(str);
describe("Loading Heating main", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("progRoot", clock);
    const env = new CCBLEnvironmentExecution(clock);
    it("should be possible to create the environment", () => {
        const Lchan = P.dependencies?.import?.channels ?? [];
        const Lemit = P.dependencies?.import?.emitters ?? [];
        const Levts = P.dependencies?.import?.events ?? [];
        Lchan.forEach((vd) => {
            const chan = getNewChannel(undefined);
            env.register_Channel(vd.name, chan);
        });
        Lemit.forEach((vd) => {
            const emitter = new CCBLEmitterValue(undefined);
            env.register_CCBLEmitterValue(vd.name, emitter);
        });
        Levts.forEach((vd) => {
            const eventer = new CCBLEvent({
                eventName: vd.name,
                env: env,
            });
            env.registerCCBLEvent(vd.name, eventer);
        });
    });
    it("should be possible to load program", () => {
        prog.loadHumanReadableProgram(P, env, {});
    });
});
//# sourceMappingURL=exHeatingMain.spec.js.map