import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { registerUnserializer, Unserialize } from "./Serialiser";
export class CCBLAllenMeet extends CCBLAllen {
    constructor(parent, children = []) {
        super(undefined, []);
        this.parent = parent;
        this.children = children;
        this.lookingForAncestor = false;
        this.parentWasActive = false;
        this.CB_active = (active) => {
            var _a;
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
                        if (this.ancestor) {
                            const { allenType, firstMeetContext } = this.ancestor;
                            if (allenType === AllenType.During) {
                                firstMeetContext.setActivable(true);
                            }
                        }
                    }
                }
                this.parentWasActive = active;
                if (shouldPropagate) {
                    (_a = this.parent) === null || _a === void 0 ? void 0 : _a.setActivable(false);
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
    getAllenType() { return AllenType.Meet; }
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
                if (!active && !C.getParentOfAllenRelationships().find(R => R.getAllenType() === AllenType.Meet)) {
                    C.setActivable(false);
                    if (this.ancestor) {
                        const { allenType, firstMeetContext } = this.ancestor;
                        if (allenType === AllenType.During) {
                            firstMeetContext.setActivable(true);
                        }
                    }
                }
            });
        });
        return this;
    }
    getAncestor() {
        if (!this.lookingForAncestor) {
            this.lookingForAncestor = true;
            if (!this.ancestor && this.parent) {
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
function getAncestor(rel, from) {
    var _a, _b;
    const ancestor = rel.getAncestor();
    if (ancestor) {
        return ancestor;
    }
    const LR = (_b = (_a = rel.parent) === null || _a === void 0 ? void 0 : _a.getReferedByAllenRelationships()) !== null && _b !== void 0 ? _b : [];
    const R = LR.find(R => R.getAllenType() !== AllenType.Meet);
    if (R) {
        return { containingContext: R.getParent(), firstMeetContext: from, allenType: R.getAllenType() };
    }
    else {
        const relMeet = LR.find(R => R.getAllenType() === AllenType.Meet);
        if (relMeet && rel.parent) {
            return getAncestor(relMeet, rel.parent);
        }
        else {
            return undefined;
        }
    }
}
export function initMeet() {
    registerUnserializer("Meet", ((json, env) => {
        return new CCBLAllenMeet(undefined, json.children.map(Cjson => Unserialize(Cjson, env)));
    }));
}
//# sourceMappingURL=AllenMeet.js.map