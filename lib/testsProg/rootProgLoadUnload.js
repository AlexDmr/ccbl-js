"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.childProg = exports.rootProg = void 0;
exports.rootProg = {
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
        During: [{
                contextName: "subProgRootFirst",
                state: "true"
            }, {
                contextName: "middle",
                state: "E",
                actions: [
                    { channel: "C", affectation: { type: "expression", value: `5` } }
                ]
            }, {
                contextName: "subProgRootLast",
                state: "true"
            }]
    }
};
exports.childProg = {
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