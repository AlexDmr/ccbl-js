import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { registerUnserializer, Unserialize } from "./Serialiser";
export class CCBLAllenDuring extends CCBLAllen {
    constructor(parent = undefined, children = []) {
        super(undefined, children);
        this.parent = parent;
        this.children = children;
        this.CB_active = (active) => {
            this.children.forEach(c => c.setActivable(active));
        };
        this.setParent(parent);
    }
    getAllenType() { return AllenType.During; }
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
export function initDuring() {
    registerUnserializer("During", ((json, env) => {
        return new CCBLAllenDuring(undefined, json.children.map(Cjson => Unserialize(Cjson, env)));
    }));
}
//# sourceMappingURL=AllenDuring.js.map