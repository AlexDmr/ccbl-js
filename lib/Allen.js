"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AllenInterface_1 = require("./AllenInterface");
let AllenTypeName = new Map();
AllenTypeName.set(AllenInterface_1.AllenType.StartWith, "StartWith");
AllenTypeName.set(AllenInterface_1.AllenType.EndWith, "EndWith");
AllenTypeName.set(AllenInterface_1.AllenType.During, "During");
AllenTypeName.set(AllenInterface_1.AllenType.After, "After");
AllenTypeName.set(AllenInterface_1.AllenType.Meet, "Meet");
function getAllenTypeName(rel) {
    return AllenTypeName.get(rel);
}
exports.getAllenTypeName = getAllenTypeName;
class CCBLAllen {
    constructor(parent, children = []) {
        this.parent = parent;
        this.children = [];
        this.jsonDirty = true;
        this.setChildren(children);
    }
    dispose() {
        this.children.forEach(c => c.dispose());
        this.children = [];
    }
    getAllenType() { return undefined; }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        if (this.parent !== parent) {
            if (this.parent) {
                const oldParent = this.parent;
                this.parent = null;
                oldParent.removeParentOfAllenRelationships(this);
            }
            this.parent = parent;
            if (this.parent) {
                this.parent.appendParentOfAllenRelationships(this);
            }
        }
        return this;
    }
    setChildren(children) {
        if (this.children) {
            this.children.forEach(C => C.removeReferedByAllenRelationships(this));
        }
        this.children = [];
        return this.appendChildren(...children);
    }
    appendChildren(...children) {
        this.children = this.children || [];
        this.children.push(...children.filter(C => this.children.indexOf(C) === -1));
        children.forEach(C => C.appendReferedByAllenRelationships(this));
        return this;
    }
    getChildren() {
        return this.children;
    }
    setJsonDirty() {
        this.jsonDirty = true;
        if (this.parent) {
            this.parent.setJsonDirty();
        }
        return this;
    }
    toJSON() {
        if (this.jsonDirty) {
            return this.lastJSON = {
                type: AllenTypeName.get(this.getAllenType()),
                children: this.children.map(c => c.toJSON())
            };
        }
        else {
            return this.lastJSON;
        }
    }
}
exports.CCBLAllen = CCBLAllen;
//# sourceMappingURL=Allen.js.map