import { AllenType } from "./AllenInterface";
let AllenTypeName = new Map();
AllenTypeName.set(AllenType.StartWith, "StartWith");
AllenTypeName.set(AllenType.EndWith, "EndWith");
AllenTypeName.set(AllenType.During, "During");
AllenTypeName.set(AllenType.After, "After");
AllenTypeName.set(AllenType.Meet, "Meet");
export function getAllenTypeName(rel) {
    return AllenTypeName.get(rel);
}
export class CCBLAllen {
    constructor(parent, children = []) {
        this.parent = parent;
        this.children = [];
        this.jsonDirty = true;
        this.setChildren(children);
    }
    dispose() {
        this.setParent(undefined);
        this.children.forEach(c => c.dispose());
        this.children = [];
    }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        if (this.parent !== parent) {
            if (this.parent) {
                const oldParent = this.parent;
                this.parent = undefined;
                oldParent.removeParentOfAllenRelationships(this);
            }
            this.parent = parent;
            if (this.parent) {
                this.parent.appendParentOfAllenRelationships(this);
            }
            this.setJsonDirty();
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
        this.setJsonDirty();
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
//# sourceMappingURL=Allen.js.map