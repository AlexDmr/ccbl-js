"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subProgHeating = {
    dependencies: {
        import: {
            emitters: [
                { name: 'tempInside', type: 'number' },
                { name: 'temp_min', type: 'number' },
                { name: 'temp_max', type: 'number' },
            ],
            channels: [
                { name: 'Heating', type: 'boolean' }
            ]
        }
    },
    actions: [
        { channel: 'Heating', affectation: { value: `false` } }
    ],
    allen: {
        During: [
            {
                contextName: 'Chauffe Marcel !',
                state: "",
                eventStart: { eventSource: '', eventExpression: 'tempInside < temp_min' },
                eventFinish: { eventSource: '', eventExpression: 'tempInside > temp_max' },
                actions: [
                    { channel: 'Heating', affectation: { value: `true` } },
                ]
            }
        ]
    }
};
exports.progHouse = {
    dependencies: {
        import: {
            events: [],
            emitters: [
                { name: 'Eve', type: 'People' },
                { name: 'tempOutside', type: 'number' },
            ],
            channels: [
                { name: 'Avatar', type: 'COLOR' },
                { name: 'openWindows', type: 'boolean' },
                { name: 'Heating', type: 'boolean' },
                { name: 'tempInside', type: 'number' },
            ]
        }
    },
    localChannels: [
        { name: 'deltaTime', type: 'number' },
        { name: 'deltaTemp', type: 'number' }
    ],
    actions: [
        { channel: 'openWindows', affectation: { value: `false` } },
        { channel: 'Heating', affectation: { value: `false` } },
        { channel: 'Avatar', affectation: { value: `"black"` } },
        { channel: 'tempInside', affectation: { value: `20` } }
    ],
    subPrograms: {
        subProgUser: exports.subProgHeating
    },
    allen: {
        During: [
            {
                contextName: 'Temperature interne devient temperature externe plus ou moins vite',
                state: 'true',
                actions: [
                    { channel: 'deltaTime', affectation: { value: '100' } },
                    { channel: 'deltaTemp', affectation: { value: 'sign(tempOutside - tempInside)' } }
                ],
                allen: {
                    During: [
                        {
                            contextName: 'Fenêtres fermé => faut voir',
                            state: 'not openWindows',
                            actions: [
                                { channel: 'deltaTime', affectation: { value: '1000' } }
                            ],
                            allen: {
                                During: [
                                    {
                                        contextName: 'chauffage',
                                        state: 'Heating',
                                        actions: [
                                            { channel: 'deltaTemp', affectation: { value: '1' } }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            contextName: 'change température',
                            state: 'deltaTemp != 0',
                            allen: {
                                During: [
                                    {
                                        contextName: 'Ajustement de temperature',
                                        state: 'true; false; deltaTime; waitEnd',
                                        actionsOnEnd: [
                                            { channel: 'tempInside', affectation: 'tempInside + deltaTemp' }
                                        ],
                                        allen: {
                                            Meet: {
                                                contextsSequence: [],
                                                loop: 0
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                as: 'subProgUser',
                mapInputs: {
                    temp_min: '18',
                    temp_max: '22'
                },
                programId: 'subProgUser'
            }
        ]
    }
};
//# sourceMappingURL=Heating.js.map