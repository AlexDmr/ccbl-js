export const rootProg = {
    dependencies: {
        import: {
            emitters: [
                { name: "E", type: "boolean" },
            ]
        }
    },
    actions: [
        { channel: "C", affectation: { type: "expression", value: `0` } }
    ],
    localChannels: [
        { name: "C", type: "number" },
        { name: "D", type: "number" }
    ],
    allen: {
        During: [{ type: "STATE",
                contextName: "subProgRootFirst",
                state: "true"
            }, { type: "STATE",
                contextName: "middle",
                state: "E",
                actions: [
                    { channel: "C", affectation: { type: "expression", value: `5` } }
                ]
            }, { type: "STATE",
                contextName: "subProgRootLast",
                state: "true"
            }]
    }
};
export const childProg = {
    dependencies: {
        import: {
            channels: [
                { name: "C", type: "number" },
                { name: "D", type: "number" },
            ]
        }
    },
    actions: [
        { channel: "C", affectation: { type: "expression", value: `100` } },
        { channel: "D", affectation: { type: "expression", value: `100` } }
    ],
};
//# sourceMappingURL=rootProgLoadUnload.js.map