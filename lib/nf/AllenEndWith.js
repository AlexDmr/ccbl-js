import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { registerUnserializer, Unserialize } from "./Serialiser";
export class CCBLAllenEndWith extends CCBLAllen {
    constructor(parent, children = []) {
        super(parent, children);
        this.parent = parent;
        this.children = children;
        this.CB_active = (active) => {
            this.children.forEach(c => c.setActivable(active));
        };
        this.setParent(parent);
    }
    getAllenType() { return AllenType.EndWith; }
    setParent(parent) {
        if (this.parent) {
            this.parent.offActiveUpdated(this.CB_active);
        }
        super.setParent(parent);
        if (this.parent) {
            this.parent.onActiveUpdated(this.CB_active);
        }
        return this;
    }
}
export function initEndWith() {
    registerUnserializer("EndWith", ((json, env) => {
        return new CCBLAllenEndWith(undefined, json.children.map(Cjson => Unserialize(Cjson, env)));
    }));
}
//# sourceMappingURL=AllenEndWith.js.map