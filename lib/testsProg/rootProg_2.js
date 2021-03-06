import { AvatarProgDescr } from "./progAvatar";
export const rootProgDescr_2 = {
    subPrograms: {
        Avatar: AvatarProgDescr
    },
    dependencies: {
        import: {
            emitters: [
                { name: "BobLocation", type: "LOCATION" },
                { name: "AliceLocation", type: "LOCATION" },
                { name: "AliceAvailable", type: "boolean" }
            ],
            channels: [
                { name: "lampAvatar", type: "COLOR" },
            ],
            events: [
                { name: "btToggleAvatarOnOff", type: "string" }
            ]
        }
    },
    localChannels: [
        { name: "BobAtHome", type: "boolean" },
        { name: "AliceAtHome", type: "boolean" },
        { name: "AliceAtBobHome", type: "boolean" }
    ],
    actions: [
        { channel: "BobAtHome", affectation: { type: "expression", value: `BobLocation == "Bob's home"` } },
        { channel: "AliceAtHome", affectation: { type: "expression", value: `AliceLocation == "Alice's home"` } },
        { channel: "AliceAtBobHome", affectation: { type: "expression", value: `AliceLocation == "Bob's home"` } },
        { channel: "lampAvatar", affectation: { type: "expression", value: `"off"` } },
        { channel: "AvatarAlice.isOn", affectation: { type: "expression", value: `true` } },
    ],
    allen: {
        During: [{
                programId: "Avatar",
                as: "AvatarAlice",
                mapInputs: {}
            }, { type: "EVENT",
                contextName: "toggleAvatarAliceOnOff",
                eventSource: "btToggleAvatarOnOff",
                actions: [{
                        channel: "AvatarAlice.isOn",
                        affectation: "not AvatarAlice.isOn"
                    }]
            }]
    }
};
//# sourceMappingURL=rootProg_2.js.map