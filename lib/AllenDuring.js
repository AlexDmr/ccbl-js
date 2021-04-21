"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDuring = exports.CCBLAllenDuring = void 0;
const AllenInterface_1 = require("./AllenInterface");
const Allen_1 = require("./Allen");
const Serialiser_1 = require("./Serialiser");
class CCBLAllenDuring extends Allen_1.CCBLAllen {
    constructor(parent = undefined, children = []) {
        super(undefined, children);
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
function initDuring() {
    Serialiser_1.registerUnserializer("During", ((json, env) => {
        return new CCBLAllenDuring(undefined, json.children.map(Cjson => Serialiser_1.Unserialize(Cjson, env)));
    }));
}
exports.initDuring = initDuring;
//# sourceMappingURL=AllenDuring.js.map