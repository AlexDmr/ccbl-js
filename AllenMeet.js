"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AllenInterface_1 = require("./AllenInterface");
const Allen_1 = require("./Allen");
const Serialiser_1 = require("./Serialiser");
class CCBLAllenMeet extends Allen_1.CCBLAllen {
    constructor(parent, children = []) {
        super(null, []);
        this.parent = parent;
        this.children = children;
        this.lookingForAncestor = false;
        this.parentWasActive = false;
        this.CB_active = (active) => {
            this.getAncestor();
            const shouldPropagate = this.parentWasActive
                && !active
                && this.ancestor.containingContext.getActive();
            if (this.children.length && this.children[0] !== this.parent) {
                if (shouldPropagate) {
                    let shouldReinit = true;
                    if (this.children.length) {
                        this.children.forEach(c => c.setActivable(true));
                        const oneActive = this.children.reduce((acc, C) => acc || C.getActive(), false);
                        shouldReinit = !oneActive;
                    }
                    if (shouldReinit) {
                        this.children.filter(C => C !== this.parent).forEach(c => c.setActivable(false));
                        const { allenType, firstMeetContext } = this.ancestor;
                        if (allenType === AllenInterface_1.AllenType.During) {
                            firstMeetContext.setActivable(true);
                        }
                    }
                }
                this.parentWasActive = active;
                if (shouldPropagate) {
                    this.parent.setActivable(false);
                }
            }
            else {
                this.parentWasActive = active;
                if (this.children.length && this.children[0] === this.parent && !active && this.ancestor.containingContext.getActive()) {
                    this.parent.setActivable(false);
                    this.parent.setActivable(true);
                }
            }
        };
        this.setParent(parent);
        this.appendChildren(...children);
    }
    getAllenType() { return AllenInterface_1.AllenType.Meet; }
    setParent(parent) {
        if (this.parent) {
            this.parent.offActiveUpdated(this.CB_active);
        }
        super.setParent(parent);
        if (this.parent) {
            this.parent.onActiveUpdated(this.CB_active);
            this.parentWasActive = this.parent.getActive();
            this.ancestor = this.getAncestor();
        }
        return this;
    }
    appendChildren(...children) {
        super.appendChildren(...children);
        this.children.forEach(C => {
            C.onActiveUpdated(active => {
                if (C === this.parent) {
                    return;
                }
                if (!active && !C.getParentOfAllenRelationships().find(R => R.getAllenType() === AllenInterface_1.AllenType.Meet)) {
                    C.setActivable(false);
                    const { allenType, firstMeetContext } = this.ancestor;
                    if (allenType === AllenInterface_1.AllenType.During) {
                        firstMeetContext.setActivable(true);
                    }
                }
            });
        });
        return this;
    }
    getAncestor() {
        if (!this.lookingForAncestor) {
            this.lookingForAncestor = true;
            if (!this.ancestor) {
                this.ancestor = getAncestor(this, this.parent);
                if (this.ancestor) {
                    const { containingContext } = this.ancestor;
                    containingContext.onActiveUpdated(active => {
                        if (!active) {
                            this.children.forEach(C => C.setActivable(false));
                        }
                    });
                }
            }
            this.lookingForAncestor = false;
        }
        return this.ancestor;
    }
}
exports.CCBLAllenMeet = CCBLAllenMeet;
function getAncestor(rel, from) {
    const ancestor = rel.getAncestor();
    if (ancestor) {
        return ancestor;
    }
    const LR = rel.parent.getReferedByAllenRelationships();
    const R = LR.find(R => R.getAllenType() !== AllenInterface_1.AllenType.Meet);
    if (R) {
        return { containingContext: R.getParent(), firstMeetContext: from, allenType: R.getAllenType() };
    }
    else {
        const relMeet = LR.find(R => R.getAllenType() === AllenInterface_1.AllenType.Meet);
        if (relMeet) {
            return getAncestor(relMeet, rel.parent);
        }
        else {
            return undefined;
        }
    }
}
Serialiser_1.registerUnserializer("Meet", (json, env) => {
    return new CCBLAllenMeet(null, json.children.map(Cjson => Serialiser_1.Unserialize(Cjson, env)));
});
//# sourceMappingURL=AllenMeet.js.map