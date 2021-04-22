export const progPbClock = {
    actions: [
        {
            channel: "lamp",
            affectation: {
                type: "expression",
                value: "\"black\" "
            }
        },
        {
            channel: "R",
            affectation: {
                type: "expression",
                value: "0 "
            }
        },
        {
            channel: "ambiance",
            affectation: {
                type: "expression",
                value: "\"black\" "
            }
        },
        {
            channel: "M",
            affectation: {
                type: "expression",
                value: "[\"red\" , \"green\" , \"blue\" ] "
            }
        }
    ],
    localChannels: [
        {
            name: "M",
            type: "MATRIX[string]"
        }
    ],
    subPrograms: {
        OSCILLO: {
            name: "OSCILLO",
            description: "Oscillation of <b>val</b> (output). <br/>\nval : <b>Vmin</b> to <b>Vmax</b> to <b>Vmin</b> and loop\ninterpolations are made during <b>tps</b> milliseconds. <br/>\n<b>btStart</b> starts the oscillation and <b>btStop</b> stop it.\n",
            actions: [
                {
                    channel: "val",
                    affectation: {
                        type: "expression",
                        value: "Vmin"
                    }
                },
                {
                    channel: "log",
                    affectation: {
                        type: "expression",
                        value: "\"root\""
                    }
                }
            ],
            dependencies: {
                import: {
                    emitters: [
                        {
                            "name": "Vmin",
                            "type": "number"
                        },
                        {
                            "name": "Vmax",
                            "type": "number"
                        },
                        {
                            "name": "tps",
                            "type": "number"
                        }
                    ],
                    "events": [
                        {
                            "name": "btStart",
                            "type": "boolean"
                        },
                        {
                            "name": "btStop",
                            "type": "boolean"
                        }
                    ]
                },
                "export": {
                    "emitters": [
                        {
                            "name": "val",
                            "type": "number"
                        },
                        {
                            "name": "log",
                            "type": "string"
                        }
                    ]
                }
            },
            "allen": {
                "During": [
                    {
                        "contextName": "subProgRootFirst",
                        "id": "state root subprog Oscillo",
                        "allen": {
                            "During": [
                                {
                                    "contextName": "Up",
                                    "id": "reset event context",
                                    "state": "true; false; tps; waitEnd",
                                    "actions": [
                                        {
                                            "channel": "val",
                                            "affectation": {
                                                "type": "expression",
                                                "value": "Vmin; Vmax; tps; easeInOut"
                                            }
                                        },
                                        {
                                            "channel": "log",
                                            "affectation": {
                                                "type": "expression",
                                                "value": "\"Up\""
                                            }
                                        }
                                    ],
                                    "allen": {
                                        "Meet": {
                                            "contextsSequence": [
                                                {
                                                    "contextName": "Down",
                                                    "state": "true; false; tps; waitEnd",
                                                    "actions": [
                                                        {
                                                            "channel": "val",
                                                            "affectation": {
                                                                "type": "expression",
                                                                "value": "Vmax; Vmin; tps; linear"
                                                            }
                                                        },
                                                        {
                                                            "channel": "log",
                                                            "affectation": {
                                                                "type": "expression",
                                                                "value": "\"Down\""
                                                            }
                                                        }
                                                    ]
                                                }
                                            ],
                                            "loop": 0
                                        }
                                    }
                                }
                            ]
                        },
                        "eventStart": {
                            "eventSource": "btStart",
                            "id": "start trigger"
                        },
                        "eventFinish": {
                            "eventSource": "btStop",
                            "id": "stop trigger"
                        }
                    }
                ]
            }
        },
        "GUIRELANDE": {
            "name": "GUIRELANDE",
            "description": "loop over colors",
            "actions": [
                {
                    "channel": "i",
                    "affectation": {
                        "type": "expression",
                        "value": "1 "
                    }
                },
                {
                    "channel": "color",
                    "affectation": {
                        "type": "expression",
                        "value": "colors[i ] "
                    }
                }
            ],
            "localChannels": [
                {
                    "name": "i",
                    "type": "number"
                }
            ],
            "dependencies": {
                "import": {
                    "emitters": [
                        {
                            "name": "tps",
                            "type": "number"
                        },
                        {
                            "name": "colors",
                            "type": "COLOR[]"
                        },
                        {
                            "name": "nb",
                            "type": "number"
                        }
                    ]
                },
                "export": {
                    "emitters": [
                        {
                            "name": "color",
                            "type": "COLOR"
                        }
                    ]
                }
            },
            "allen": {
                "During": [
                    {
                        "contextName": "C",
                        "id": "SC:108",
                        "state": "true ; false ; tps ; waitEnd",
                        "allen": {
                            "Meet": {
                                "contextsSequence": [],
                                "loop": 0
                            }
                        },
                        "actionsOnEnd": [
                            {
                                "channel": "i",
                                "affectation": "1 + i % nb "
                            }
                        ]
                    }
                ]
            }
        }
    },
    dependencies: {
        import: {
            channels: [
                {
                    name: "R",
                    type: "number"
                },
                {
                    name: "lamp",
                    type: "color"
                },
                {
                    name: "ambiance",
                    type: "COLOR"
                }
            ],
            emitters: [
                {
                    name: "presenceAlice",
                    type: "boolean"
                },
                {
                    name: "presenceBob",
                    type: "boolean"
                }
            ],
            events: [
                {
                    name: "bt1",
                    type: "boolean"
                },
                {
                    name: "bt2",
                    type: "boolean"
                }
            ]
        },
        export: {}
    },
    allen: {
        "During": [
            {
                "contextName": "C",
                "state": "presenceAlice ",
                "actions": [
                    {
                        "channel": "R",
                        "affectation": {
                            "type": "expression",
                            "value": "round( oscilloR.val ) "
                        }
                    },
                    {
                        "channel": "lamp",
                        "affectation": {
                            "type": "expression",
                            "value": "concat( \"rgb(\" , string( R ) , \", \" , string( 255 - R ) , \", 0 )\" ) "
                        }
                    }
                ],
                "allen": {
                    "During": [
                        {
                            "as": "oscilloR",
                            "programId": "OSCILLO",
                            "mapInputs": {
                                "Vmin": "0 ",
                                "Vmax": "255 ",
                                "tps": "1000 ",
                                "btStart": {
                                    "eventSource": "bt1"
                                },
                                "btStop": {
                                    "eventSource": "bt1"
                                }
                            }
                        }
                    ]
                },
                "actionsOnStart": [],
                "actionsOnEnd": []
            },
            {
                "contextName": "C",
                "state": "presenceBob ",
                "actions": [
                    {
                        "channel": "ambiance",
                        "affectation": {
                            "type": "expression",
                            "value": "G.color "
                        }
                    }
                ],
                "allen": {
                    "During": [
                        {
                            "as": "G",
                            "programId": "GUIRELANDE",
                            "mapInputs": {
                                "tps": "1000 ",
                                "colors": "[\"red\" , \"green\" , \"blue\" , \"yellow\" , \"cyan\" , \"magenta\" ] ",
                                "nb": "6 "
                            }
                        }
                    ]
                },
                "actionsOnStart": [],
                "actionsOnEnd": []
            }
        ]
    }
};
//# sourceMappingURL=progPbClock.js.map