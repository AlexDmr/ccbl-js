import { AllenType } from "./AllenInterface";
export let StructuralOrder = (root, priority = 0, doneContexts = []) => {
    if (doneContexts.indexOf(root) >= 0) {
        return undefined;
    }
    else {
        doneContexts.push(root);
    }
    root.setPriority(priority++);
    let allens = root.getParentOfAllenRelationships();
    let allenMeet = allens.filter(a => a.getAllenType() === AllenType.Meet);
    let allenAfter = allens.filter(a => a.getAllenType() === AllenType.After);
    let allenEndWith = allens.filter(a => a.getAllenType() === AllenType.EndWith);
    let allenStartWith = allens.filter(a => a.getAllenType() === AllenType.StartWith);
    let allenDuring = allens.filter(a => a.getAllenType() === AllenType.During);
    let allensOrdered = [...allenDuring, ...allenStartWith, ...allenEndWith, ...allenAfter, ...allenMeet];
    allensOrdered.forEach(a => {
        a.getChildren().forEach(c => priority = StructuralOrder(c, priority, doneContexts) || priority);
    });
    return priority;
};
//# sourceMappingURL=ContextOrders.js.map