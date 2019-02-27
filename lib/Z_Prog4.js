"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const Clock_1 = require("./Clock");
const Channel_1 = require("./Channel");
const ContextState_1 = require("./ContextState");
const ChannelActionState_1 = require("./ChannelActionState");
const AllenDuring_1 = require("./AllenDuring");
const ContextOrders_1 = require("./ContextOrders");
const EmitterValue_1 = require("./EmitterValue");
const StateInExecutionEnvironment_1 = require("./StateInExecutionEnvironment");
exports.clock = new Clock_1.CCBLTestClock();
exports.envExo4 = new ExecutionEnvironment_1.CCBLEnvironmentExecution(exports.clock);
exports.LAMP_valueEmitter = new EmitterValue_1.CCBLEmitterValue("OFF", { constant: false, id: "LAMP" });
exports.LAMP_chan = new Channel_1.Channel(exports.LAMP_valueEmitter);
exports.AliceLocation = new EmitterValue_1.CCBLEmitterValue("UNKNOWN", { constant: false, id: "AliceLocation" });
exports.AliceAvailability = new EmitterValue_1.CCBLEmitterValue("Unavailable", { constant: false, id: "AliceAvailability" });
exports.MartinLocation = new EmitterValue_1.CCBLEmitterValue("UNKNOWN", { constant: false, id: "MartinLocation" });
exports.ProgExo4State = new EmitterValue_1.CCBLEmitterValue(false);
exports.EnvDescr4 = {
    EE: exports.envExo4,
    events: [],
    inputs: [
        { type: "boolean",
            name: "ProgExo4State",
            typeValues: [true, false],
            valueEmitter: exports.ProgExo4State
        },
        { type: "LOCATION",
            typeValues: ["Alice's Home", "Martin's Home", "UNKNOWN"],
            name: "AliceLocation",
            valueEmitter: exports.AliceLocation
        },
        { type: "LOCATION",
            typeValues: ["Alice's Home", "Martin's Home", "UNKNOWN"],
            name: "MartinLocation",
            valueEmitter: exports.MartinLocation
        },
        { type: "AVAILABILITY",
            typeValues: ["Available", "Unavailable"],
            name: "AliceAvailability",
            valueEmitter: exports.AliceAvailability
        },
    ],
    outputs: [
        { type: "LAMP_STATE",
            typeValues: ["OFF", "WHITE", "ORANGE", "GREEN"],
            name: "LAMP",
            valueEmitter: exports.LAMP_valueEmitter
        },
    ]
};
exports.envExo4.register_CCBLEmitterValue("ProgExo4State", exports.ProgExo4State)
    .register_CCBLEmitterValue("AliceLocation", exports.AliceLocation)
    .register_CCBLEmitterValue("AliceAvailability", exports.AliceAvailability)
    .register_CCBLEmitterValue("MartinLocation", exports.MartinLocation)
    .register_CCBLEmitterValue("LAMP", exports.LAMP_valueEmitter)
    .register_Channel("LAMP", exports.LAMP_chan);
exports.ProgExo4 = new ContextState_1.CCBLContextState({
    environment: exports.envExo4,
    contextName: "pipo",
    state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
        stateName: "ProgExo4",
        env: exports.envExo4,
        expression: "ProgExo4State"
    })
}).appendChannelActions(new ChannelActionState_1.ChannelActionState(exports.LAMP_chan, exports.envExo4, `"OFF"`)).appendParentOfAllenRelationships(new AllenDuring_1.CCBLAllenDuring(null, [
    new ContextState_1.CCBLContextState({
        environment: exports.envExo4,
        contextName: "pipo",
        state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
            stateName: "Martin is at home",
            env: exports.envExo4,
            expression: `MartinLocation == "Martin's Home"`
        })
    }).appendParentOfAllenRelationships(new AllenDuring_1.CCBLAllenDuring(null, [
        new ContextState_1.CCBLContextState({
            environment: exports.envExo4,
            contextName: "pipo",
            state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
                stateName: "Alice is at home",
                env: exports.envExo4,
                expression: `AliceLocation == "Alice's Home"`
            })
        }).appendChannelActions(new ChannelActionState_1.ChannelActionState(exports.LAMP_chan, exports.envExo4, `"ORANGE"`)).appendParentOfAllenRelationships(new AllenDuring_1.CCBLAllenDuring(null, [
            new ContextState_1.CCBLContextState({
                environment: exports.envExo4,
                contextName: "pipo",
                state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
                    stateName: "Alice is available",
                    env: exports.envExo4,
                    expression: `AliceAvailability == "Available"`
                })
            }).appendChannelActions(new ChannelActionState_1.ChannelActionState(exports.LAMP_chan, exports.envExo4, `"GREEN"`))
        ])),
        new ContextState_1.CCBLContextState({
            environment: exports.envExo4,
            contextName: "pipo",
            state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
                stateName: "Alice is at Martin's home",
                env: exports.envExo4,
                expression: `AliceLocation == "Martin's Home"`
            })
        }).appendChannelActions(new ChannelActionState_1.ChannelActionState(exports.LAMP_chan, exports.envExo4, `"WHITE"`))
    ]))
]));
Channel_1.registerChannel(exports.LAMP_chan);
ContextOrders_1.StructuralOrder(exports.ProgExo4);
function initProgExo4Env() {
    exports.AliceLocation.set("UNKNOWN");
    exports.MartinLocation.set("UNKNOWN");
    exports.AliceAvailability.set("Unavailable");
    exports.LAMP_valueEmitter.set("OFF");
}
exports.initProgExo4Env = initProgExo4Env;
//# sourceMappingURL=Z_Prog4.js.map