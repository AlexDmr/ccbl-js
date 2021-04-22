import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLTestClock } from "./Clock";
import { Channel, registerChannel } from "./Channel";
import { CCBLContextState } from "./ContextState";
import { CCBLEvent } from "./Event";
import { ChannelActionState } from "./ChannelActionState";
import { CCBLAllenDuring } from "./AllenDuring";
import { StructuralOrder } from "./ContextOrders";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLContextEvent } from "./ContextEvent";
import { ChannelActionEvent } from "./ChannelActionEvent";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { CCBLConstraintValue } from "./ConstraintValue";
export let clock = new CCBLTestClock();
export let envExo5 = new CCBLEnvironmentExecution(clock);
export let DomiCubeFace = new CCBLEmitterValue("undefined", { constant: false, id: "DomiCubeFace" });
export let DomiCubeRotation = new CCBLEmitterValue(0, { constant: false, id: "DomiCubeRotation" });
export let Phoning = new CCBLEmitterValue(false, { constant: false, id: "Phoning" });
export let TV_isOn = new Channel(new CCBLEmitterValue(false, { constant: false, id: "TV_isOn" }));
export let TV_State = new Channel(new CCBLEmitterValue("PLAY", { constant: false, id: "TV_State" }));
export let TV_channel = new Channel(new CCBLEmitterValue(1, { constant: false, id: "TV_channel" }));
export let TV_volume = new Channel(new CCBLEmitterValue(100, { constant: false, id: "TV_volume" }));
export let chanVarBeta = new Channel(new CCBLEmitterValue(undefined));
export let TV_evtVolP = new CCBLEvent({ env: envExo5, eventName: "Volume +" });
export let TV_evtVolM = new CCBLEvent({ env: envExo5, eventName: "Volume -" });
export let TV_evtChanP = new CCBLEvent({ env: envExo5, eventName: "Channel +" });
export let TV_evtChanM = new CCBLEvent({ env: envExo5, eventName: "Channel -" });
export let ProgExo5State = new CCBLEmitterValue(false);
registerChannel(TV_isOn, TV_State, TV_channel, TV_volume, chanVarBeta);
envExo5.register_CCBLEmitterValue("ProgExo5State", ProgExo5State)
    .register_CCBLEmitterValue("DomiCubeFace", DomiCubeFace)
    .register_CCBLEmitterValue("DomiCubeRotation", DomiCubeRotation)
    .register_CCBLEmitterValue("Phoning", Phoning)
    .register_Channel("TV_channel", TV_channel)
    .register_Channel("TV_volume", TV_volume)
    .register_Channel("chanVarBeta", chanVarBeta);
export let ProgExo5 = new CCBLContextState({
    environment: envExo5,
    contextName: "pipo",
    state: new CCBLStateInExecutionEnvironment({
        stateName: "ProgExo5State",
        env: envExo5,
        expression: "ProgExo5State"
    })
}).appendChannelActions(new ChannelActionState(TV_isOn, envExo5, "false"), new ChannelActionState(TV_State, envExo5, `"PLAY"`), new ChannelActionState(TV_volume, envExo5, "0"), new ChannelActionState(TV_channel, envExo5, "1")).appendParentOfAllenRelationships(new CCBLAllenDuring(undefined, [
    new CCBLContextState({
        environment: envExo5,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({
            stateName: "Automations",
            env: envExo5,
            expression: "true"
        })
    }),
    new CCBLContextState({
        environment: envExo5,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({
            stateName: "Direct controls",
            env: envExo5,
            expression: "true"
        })
    }).appendChannelActions(new ChannelActionState(TV_volume, envExo5, "chanVarBeta"), new ChannelActionState(chanVarBeta, envExo5, "50")).appendParentOfAllenRelationships(new CCBLAllenDuring(undefined, [
        new CCBLContextEvent("pipo", TV_evtVolP).appendChannelActions(new ChannelActionEvent(chanVarBeta, envExo5, "chanVarBeta + 1")),
        new CCBLContextEvent("pipo", TV_evtVolM).appendChannelActions(new ChannelActionEvent(chanVarBeta, envExo5, "chanVarBeta - 1")),
        new CCBLContextEvent("pipo", TV_evtChanP).appendChannelActions(new ChannelActionEvent(TV_channel, envExo5, "TV_channel + 1")),
        new CCBLContextEvent("pipo", TV_evtChanM).appendChannelActions(new ChannelActionEvent(TV_channel, envExo5, "TV_channel - 1")),
    ])),
    new CCBLContextState({
        environment: envExo5,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({
            stateName: "Phoning",
            env: envExo5,
            expression: "Phoning"
        })
    }).appendChannelActions(new ChannelActionState(TV_volume, envExo5, new CCBLConstraintValue(envExo5, "min(value, 30)")), new ChannelActionState(TV_channel, envExo5, new CCBLConstraintValue(envExo5, "max(value, 0)")))
]));
StructuralOrder(ProgExo5);
export function initProgExo5Env() {
    ProgExo5State.set(false);
    DomiCubeFace.set("undefined");
    DomiCubeRotation.set(0);
    TV_channel.updateValue(0);
    TV_volume.updateValue(0);
}
initProgExo5Env();
export let EnvDescr5 = {
    EE: envExo5,
    events: [
        { type: "boolean",
            name: "Increase Volume",
            ccblEvent: TV_evtVolP
        },
        { type: "boolean",
            name: "Decrease Volume",
            ccblEvent: TV_evtVolM
        },
        { type: "boolean",
            name: "Increase Channel",
            ccblEvent: TV_evtChanP
        },
        { type: "boolean",
            name: "Decrease Channel",
            ccblEvent: TV_evtChanM
        }
    ],
    inputs: [
        { type: "boolean",
            name: "ProgExo5State",
            valueEmitter: ProgExo5State
        },
        { type: "boolean",
            name: "Phoning",
            valueEmitter: Phoning
        },
        { type: "number",
            name: "DomiCubeRotation",
            valueEmitter: DomiCubeRotation
        },
        { type: "FACE_CUBE",
            typeValues: ["undefined", "Volume", "Channel"],
            name: "DomiCubeFace",
            valueEmitter: DomiCubeFace
        },
    ],
    outputs: [
        { type: "boolean",
            name: "TV is ON",
            valueEmitter: TV_isOn.valueEmitter
        },
        { type: "PLAY_STATE",
            typeValues: ["PLAY", "PAUSE"],
            name: "TV in state",
            valueEmitter: TV_State.valueEmitter
        },
        { type: "number",
            name: "TV channelN",
            valueEmitter: TV_channel.valueEmitter
        },
        { type: "number",
            name: "TV volume",
            valueEmitter: TV_volume.valueEmitter
        },
        { type: "number",
            name: "Beta",
            valueEmitter: chanVarBeta.valueEmitter
        },
    ]
};
//# sourceMappingURL=Z_Prog5.js.map