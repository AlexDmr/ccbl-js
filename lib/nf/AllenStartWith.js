import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { registerUnserializer, Unserialize } from "./Serialiser";
export class CCBLAllenStartWith extends CCBLAllen {
    constructor(parent, children = []) {
        super(undefined, children);
        this.parent = parent;
        this.children = children;
        this.CB_active = (act) => {
            this.children.forEach(c => {
                c.setActivable(act);
                if (c.getActive()) {
                    c.onceActiveUpdated((active) => {
                        if (!active) {
                            c.setActivable(false);
                        }
                    });
                }
                else {
                    c.setActivable(false);
                }
            });
        };
        this.setParent(parent);
    }
    getAllenType() { return AllenType.StartWith; }
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
export function initStartWith() {
    registerUnserializer("StartWith", ((json, env) => {
        return new CCBLAllenStartWith(undefined, json.children.map(Cjson => Unserialize(Cjson, env)));
    }));
}
//# sourceMappingURL=AllenStartWith.js.map