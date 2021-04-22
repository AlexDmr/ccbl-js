import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLTestClock } from "./Clock";
import { Channel, registerChannel } from "./Channel";
import { CCBLContextState } from "./ContextState";
import { ChannelActionState } from "./ChannelActionState";
import { CCBLAllenDuring } from "./AllenDuring";
import { StructuralOrder } from "./ContextOrders";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
export let clock = new CCBLTestClock();
export let envExo4 = new CCBLEnvironmentExecution(clock);
export let LAMP_valueEmitter = new CCBLEmitterValue("OFF", { constant: false, id: "LAMP" });
export let LAMP_chan = new Channel(LAMP_valueEmitter);
export let AliceLocation = new CCBLEmitterValue("UNKNOWN", { constant: false, id: "AliceLocation" });
export let AliceAvailability = new CCBLEmitterValue("Unavailable", { constant: false, id: "AliceAvailability" });
export let MartinLocation = new CCBLEmitterValue("UNKNOWN", { constant: false, id: "MartinLocation" });
export let ProgExo4State = new CCBLEmitterValue(false);
export let EnvDescr4 = {
    EE: envExo4,
    events: [],
    inputs: [
        { type: "boolean",
            name: "ProgExo4State",
            typeValues: [true, false],
            valueEmitter: ProgExo4State
        },
        { type: "LOCATION",
            typeValues: ["Alice's Home", "Martin's Home", "UNKNOWN"],
            name: "AliceLocation",
            valueEmitter: AliceLocation
        },
        { type: "LOCATION",
            typeValues: ["Alice's Home", "Martin's Home", "UNKNOWN"],
            name: "MartinLocation",
            valueEmitter: MartinLocation
        },
        { type: "AVAILABILITY",
            typeValues: ["Available", "Unavailable"],
            name: "AliceAvailability",
            valueEmitter: AliceAvailability
        },
    ],
    outputs: [
        { type: "LAMP_STATE",
            typeValues: ["OFF", "WHITE", "ORANGE", "GREEN"],
            name: "LAMP",
            valueEmitter: LAMP_valueEmitter
        },
    ]
};
envExo4.register_CCBLEmitterValue("ProgExo4State", ProgExo4State)
    .register_CCBLEmitterValue("AliceLocation", AliceLocation)
    .register_CCBLEmitterValue("AliceAvailability", AliceAvailability)
    .register_CCBLEmitterValue("MartinLocation", MartinLocation)
    .register_Channel("LAMP", LAMP_chan);
export let ProgExo4 = new CCBLContextState({
    environment: envExo4,
    contextName: "pipo",
    state: new CCBLStateInExecutionEnvironment({
        stateName: "ProgExo4",
        env: envExo4,
        expression: "ProgExo4State"
    })
}).appendChannelActions(new ChannelActionState(LAMP_chan, envExo4, `"OFF"`)).appendParentOfAllenRelationships(new CCBLAllenDuring(undefined, [
    new CCBLContextState({
        environment: envExo4,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({
            stateName: "Martin is at home",
            env: envExo4,
            expression: `MartinLocation == "Martin's Home"`
        })
    }).appendParentOfAllenRelationships(new CCBLAllenDuring(undefined, [
        new CCBLContextState({
            environment: envExo4,
            contextName: "pipo",
            state: new CCBLStateInExecutionEnvironment({
                stateName: "Alice is at home",
                env: envExo4,
                expression: `AliceLocation == "Alice's Home"`
            })
        }).appendChannelActions(new ChannelActionState(LAMP_chan, envExo4, `"ORANGE"`)).appendParentOfAllenRelationships(new CCBLAllenDuring(undefined, [
            new CCBLContextState({
                environment: envExo4,
                contextName: "pipo",
                state: new CCBLStateInExecutionEnvironment({
                    stateName: "Alice is available",
                    env: envExo4,
                    expression: `AliceAvailability == "Available"`
                })
            }).appendChannelActions(new ChannelActionState(LAMP_chan, envExo4, `"GREEN"`))
        ])),
        new CCBLContextState({
            environment: envExo4,
            contextName: "pipo",
            state: new CCBLStateInExecutionEnvironment({
                stateName: "Alice is at Martin's home",
                env: envExo4,
                expression: `AliceLocation == "Martin's Home"`
            })
        }).appendChannelActions(new ChannelActionState(LAMP_chan, envExo4, `"WHITE"`))
    ]))
]));
registerChannel(LAMP_chan);
StructuralOrder(ProgExo4);
export function initProgExo4Env() {
    AliceLocation.set("UNKNOWN");
    MartinLocation.set("UNKNOWN");
    AliceAvailability.set("Unavailable");
    LAMP_valueEmitter.set("OFF");
}
//# sourceMappingURL=Z_Prog4.js.map