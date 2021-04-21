"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStartWith = exports.CCBLAllenStartWith = void 0;
const AllenInterface_1 = require("./AllenInterface");
const Allen_1 = require("./Allen");
const Serialiser_1 = require("./Serialiser");
class CCBLAllenStartWith extends Allen_1.CCBLAllen {
    constructor(parent, children = []) {
        super(null, children);
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
    getAllenType() { return AllenInterface_1.AllenType.StartWith; }
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
exports.CCBLAllenStartWith = CCBLAllenStartWith;
function initStartWith() {
    Serialiser_1.registerUnserializer("StartWith", (json, env) => {
        return new CCBLAllenStartWith(null, json.children.map(Cjson => Serialiser_1.Unserialize(Cjson, env)));
    });
}
exports.initStartWith = initStartWith;
//# sourceMappingURL=AllenStartWith.js.map