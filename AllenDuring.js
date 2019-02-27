"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AllenInterface_1 = require("./AllenInterface");
const Allen_1 = require("./Allen");
const Serialiser_1 = require("./Serialiser");
class CCBLAllenDuring extends Allen_1.CCBLAllen {
    constructor(parent = null, children = []) {
        super(null, children);
        this.parent = parent;
        this.children = children;
        this.CB_active = (active) => {
            this.children.forEach(c => c.setActivable(active));
        };
        this.setParent(parent);
    }
    getAllenType() { return AllenInterface_1.AllenType.During; }
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
exports.CCBLAllenDuring = CCBLAllenDuring;
Serialiser_1.registerUnserializer("During", (json, env) => {
    return new CCBLAllenDuring(null, json.children.map(Cjson => Serialiser_1.Unserialize(Cjson, env)));
});
//# sourceMappingURL=AllenDuring.js.map