"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEndWith = exports.CCBLAllenEndWith = void 0;
const AllenInterface_1 = require("./AllenInterface");
const Allen_1 = require("./Allen");
const Serialiser_1 = require("./Serialiser");
class CCBLAllenEndWith extends Allen_1.CCBLAllen {
    constructor(parent, children = []) {
        super(parent, children);
        this.parent = parent;
        this.children = children;
        this.CB_active = (active) => {
            this.children.forEach(c => c.setActivable(active));
        };
        this.setParent(parent);
    }
    getAllenType() { return AllenInterface_1.AllenType.EndWith; }
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
exports.CCBLAllenEndWith = CCBLAllenEndWith;
function initEndWith() {
    Serialiser_1.registerUnserializer("EndWith", (json, env) => {
        return new CCBLAllenEndWith(null, json.children.map(Cjson => Serialiser_1.Unserialize(Cjson, env)));
    });
}
exports.initEndWith = initEndWith;
//# sourceMappingURL=AllenEndWith.js.map