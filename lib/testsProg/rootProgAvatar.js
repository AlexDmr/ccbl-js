export const rootProgAvatar = {
    dependencies: {
        import: {
            channels: [
                { name: "lampAvatar", type: "color" }
            ],
            emitters: [
                { name: "BobAtHome", type: "boolean" },
                { name: "AliceAtHome", type: "boolean" },
                { name: "AliceAtBobHome", type: "boolean" },
                { name: "AliceAvailable", type: "boolean" },
                { name: "securityMode", type: "boolean" }
            ]
        },
        export: {
            channels: [
                { name: "MusicMode", type: "string" }
            ]
        }
    },
    actions: [
        { channel: "lampAvatar", affectation: { value: `"off"` } },
        { channel: "MusicMode", affectation: { value: `"off"` } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "rootProgChild",
                state: "true"
            },
            { type: "STATE",
                contextName: "security",
                state: "securityMode"
            }
        ]
    }
};
//# sourceMappingURL=rootProgAvatar.js.map