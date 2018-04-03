"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AllenInterface_1 = require("./AllenInterface");
const Allen_1 = require("./Allen");
const Serialiser_1 = require("./Serialiser");
class CCBLAllenEndWith extends Allen_1.CCBLAllen {
    constructor(parent, children = []) {
        super(parent, children);
        this.parent = parent;
        this.children = children;
        if (this.parent) {
            this.parent.onActiveUpdated(active => {
                this.children.forEach(c => c.setActivable(active));
            });
        }
    }
    getAllenType() { return AllenInterface_1.AllenType.EndWith; }
}
exports.CCBLAllenEndWith = CCBLAllenEndWith;
Serialiser_1.registerUnserializer("EndWith", (json, env) => {
    return new CCBLAllenEndWith(null, json.children.map(Cjson => Serialiser_1.Unserialize(Cjson, env)));
});
//# sourceMappingURL=AllenEndWith.js.map