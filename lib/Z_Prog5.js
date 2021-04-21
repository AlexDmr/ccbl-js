"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvDescr5 = exports.initProgExo5Env = exports.ProgExo5 = exports.ProgExo5State = exports.TV_evtChanM = exports.TV_evtChanP = exports.TV_evtVolM = exports.TV_evtVolP = exports.chanVarBeta = exports.TV_volume = exports.TV_channel = exports.TV_State = exports.TV_isOn = exports.Phoning = exports.DomiCubeRotation = exports.DomiCubeFace = exports.envExo5 = exports.clock = void 0;
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const Clock_1 = require("./Clock");
const Channel_1 = require("./Channel");
const ContextState_1 = require("./ContextState");
const Event_1 = require("./Event");
const ChannelActionState_1 = require("./ChannelActionState");
const AllenDuring_1 = require("./AllenDuring");
const ContextOrders_1 = require("./ContextOrders");
const EmitterValue_1 = require("./EmitterValue");
const ContextEvent_1 = require("./ContextEvent");
const ChannelActionEvent_1 = require("./ChannelActionEvent");
const StateInExecutionEnvironment_1 = require("./StateInExecutionEnvironment");
const ConstraintValue_1 = require("./ConstraintValue");
exports.clock = new Clock_1.CCBLTestClock();
exports.envExo5 = new ExecutionEnvironment_1.CCBLEnvironmentExecution(exports.clock);
exports.DomiCubeFace = new EmitterValue_1.CCBLEmitterValue("undefined", { constant: false, id: "DomiCubeFace" });
exports.DomiCubeRotation = new EmitterValue_1.CCBLEmitterValue(0, { constant: false, id: "DomiCubeRotation" });
exports.Phoning = new EmitterValue_1.CCBLEmitterValue(false, { constant: false, id: "Phoning" });
exports.TV_isOn = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(false, { constant: false, id: "TV_isOn" }));
exports.TV_State = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue("PLAY", { constant: false, id: "TV_State" }));
exports.TV_channel = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(1, { constant: false, id: "TV_channel" }));
exports.TV_volume = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(100, { constant: false, id: "TV_volume" }));
exports.chanVarBeta = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(undefined));
exports.TV_evtVolP = new Event_1.CCBLEvent({ env: exports.envExo5, eventName: "Volume +" });
exports.TV_evtVolM = new Event_1.CCBLEvent({ env: exports.envExo5, eventName: "Volume -" });
exports.TV_evtChanP = new Event_1.CCBLEvent({ env: exports.envExo5, eventName: "Channel +" });
exports.TV_evtChanM = new Event_1.CCBLEvent({ env: exports.envExo5, eventName: "Channel -" });
exports.ProgExo5State = new EmitterValue_1.CCBLEmitterValue(false);
Channel_1.registerChannel(exports.TV_isOn, exports.TV_State, exports.TV_channel, exports.TV_volume, exports.chanVarBeta);
exports.envExo5.register_CCBLEmitterValue("ProgExo5State", exports.ProgExo5State)
    .register_CCBLEmitterValue("DomiCubeFace", exports.DomiCubeFace)
    .register_CCBLEmitterValue("DomiCubeRotation", exports.DomiCubeRotation)
    .register_CCBLEmitterValue("Phoning", exports.Phoning)
    .register_Channel("TV_channel", exports.TV_channel)
    .register_Channel("TV_volume", exports.TV_volume)
    .register_Channel("chanVarBeta", exports.chanVarBeta);
exports.ProgExo5 = new ContextState_1.CCBLContextState({
    environment: exports.envExo5,
    contextName: "pipo",
    state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
        stateName: "ProgExo5State",
        env: exports.envExo5,
        expression: "ProgExo5State"
    })
}).appendChannelActions(new ChannelActionState_1.ChannelActionState(exports.TV_isOn, exports.envExo5, "false"), new ChannelActionState_1.ChannelActionState(exports.TV_State, exports.envExo5, `"PLAY"`), new ChannelActionState_1.ChannelActionState(exports.TV_volume, exports.envExo5, "0"), new ChannelActionState_1.ChannelActionState(exports.TV_channel, exports.envExo5, "1")).appendParentOfAllenRelationships(new AllenDuring_1.CCBLAllenDuring(undefined, [
    new ContextState_1.CCBLContextState({
        environment: exports.envExo5,
        contextName: "pipo",
        state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
            stateName: "Automations",
            env: exports.envExo5,
            expression: "true"
        })
    }),
    new ContextState_1.CCBLContextState({
        environment: exports.envExo5,
        contextName: "pipo",
        state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
            stateName: "Direct controls",
            env: exports.envExo5,
            expression: "true"
        })
    }).appendChannelActions(new ChannelActionState_1.ChannelActionState(exports.TV_volume, exports.envExo5, "chanVarBeta"), new ChannelActionState_1.ChannelActionState(exports.chanVarBeta, exports.envExo5, "50")).appendParentOfAllenRelationships(new AllenDuring_1.CCBLAllenDuring(undefined, [
        new ContextEvent_1.CCBLContextEvent("pipo", exports.TV_evtVolP).appendChannelActions(new ChannelActionEvent_1.ChannelActionEvent(exports.chanVarBeta, exports.envExo5, "chanVarBeta + 1")),
        new ContextEvent_1.CCBLContextEvent("pipo", exports.TV_evtVolM).appendChannelActions(new ChannelActionEvent_1.ChannelActionEvent(exports.chanVarBeta, exports.envExo5, "chanVarBeta - 1")),
        new ContextEvent_1.CCBLContextEvent("pipo", exports.TV_evtChanP).appendChannelActions(new ChannelActionEvent_1.ChannelActionEvent(exports.TV_channel, exports.envExo5, "TV_channel + 1")),
        new ContextEvent_1.CCBLContextEvent("pipo", exports.TV_evtChanM).appendChannelActions(new ChannelActionEvent_1.ChannelActionEvent(exports.TV_channel, exports.envExo5, "TV_channel - 1")),
    ])),
    new ContextState_1.CCBLContextState({
        environment: exports.envExo5,
        contextName: "pipo",
        state: new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
            stateName: "Phoning",
            env: exports.envExo5,
            expression: "Phoning"
        })
    }).appendChannelActions(new ChannelActionState_1.ChannelActionState(exports.TV_volume, exports.envExo5, new ConstraintValue_1.CCBLConstraintValue(exports.envExo5, "min(value, 30)")), new ChannelActionState_1.ChannelActionState(exports.TV_channel, exports.envExo5, new ConstraintValue_1.CCBLConstraintValue(exports.envExo5, "max(value, 0)")))
]));
ContextOrders_1.StructuralOrder(exports.ProgExo5);
function initProgExo5Env() {
    exports.ProgExo5State.set(false);
    exports.DomiCubeFace.set("undefined");
    exports.DomiCubeRotation.set(0);
    exports.TV_channel.updateValue(0);
    exports.TV_volume.updateValue(0);
}
exports.initProgExo5Env = initProgExo5Env;
initProgExo5Env();
exports.EnvDescr5 = {
    EE: exports.envExo5,
    events: [
        { type: "boolean",
            name: "Increase Volume",
            ccblEvent: exports.TV_evtVolP
        },
        { type: "boolean",
            name: "Decrease Volume",
            ccblEvent: exports.TV_evtVolM
        },
        { type: "boolean",
            name: "Increase Channel",
            ccblEvent: exports.TV_evtChanP
        },
        { type: "boolean",
            name: "Decrease Channel",
            ccblEvent: exports.TV_evtChanM
        }
    ],
    inputs: [
        { type: "boolean",
            name: "ProgExo5State",
            valueEmitter: exports.ProgExo5State
        },
        { type: "boolean",
            name: "Phoning",
            valueEmitter: exports.Phoning
        },
        { type: "number",
            name: "DomiCubeRotation",
            valueEmitter: exports.DomiCubeRotation
        },
        { type: "FACE_CUBE",
            typeValues: ["undefined", "Volume", "Channel"],
            name: "DomiCubeFace",
            valueEmitter: exports.DomiCubeFace
        },
    ],
    outputs: [
        { type: "boolean",
            name: "TV is ON",
            valueEmitter: exports.TV_isOn.valueEmitter
        },
        { type: "PLAY_STATE",
            typeValues: ["PLAY", "PAUSE"],
            name: "TV in state",
            valueEmitter: exports.TV_State.valueEmitter
        },
        { type: "number",
            name: "TV channelN",
            valueEmitter: exports.TV_channel.valueEmitter
        },
        { type: "number",
            name: "TV volume",
            valueEmitter: exports.TV_volume.valueEmitter
        },
        { type: "number",
            name: "Beta",
            valueEmitter: exports.chanVarBeta.valueEmitter
        },
    ]
};
//# sourceMappingURL=Z_Prog5.js.map