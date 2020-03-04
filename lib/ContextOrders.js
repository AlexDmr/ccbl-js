"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AllenInterface_1 = require("./AllenInterface");
exports.StructuralOrder = (root, priority = 0, doneContexts = []) => {
    if (doneContexts.indexOf(root) >= 0) {
        return undefined;
    }
    else {
        doneContexts.push(root);
    }
    root.setPriority(priority++);
    let allens = root.getParentOfAllenRelationships();
    let allenMeet = allens.filter(a => a.getAllenType() === AllenInterface_1.AllenType.Meet);
    let allenAfter = allens.filter(a => a.getAllenType() === AllenInterface_1.AllenType.After);
    let allenEndWith = allens.filter(a => a.getAllenType() === AllenInterface_1.AllenType.EndWith);
    let allenStartWith = allens.filter(a => a.getAllenType() === AllenInterface_1.AllenType.StartWith);
    let allenDuring = allens.filter(a => a.getAllenType() === AllenInterface_1.AllenType.During);
    let allensOrdered = [...allenDuring, ...allenStartWith, ...allenEndWith, ...allenAfter, ...allenMeet];
    allensOrdered.forEach(a => {
        a.getChildren().forEach(c => priority = exports.StructuralOrder(c, priority, doneContexts) || priority);
    });
    return priority;
};
//# sourceMappingURL=ContextOrders.js.map