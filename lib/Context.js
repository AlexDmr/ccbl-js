"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AllenInterface_1 = require("./AllenInterface");
class CCBLContext {
    constructor() {
        this.priority = 0;
        this.parentOfAllenRelationships = [];
        this.referedByAllenRelationships = [];
        this.activable = false;
        this.channelActions = new Map();
        this.jsonDirty = true;
        this.cbActionDirty = (dirty) => {
            if (dirty) {
                this.setJsonDirty();
            }
        };
    }
    dispose() {
        this.channelActions.forEach((ca) => {
            ca.dispose();
        });
        this.channelActions.clear();
        this.parentOfAllenRelationships.forEach(r => r.dispose());
    }
    setJsonDirty() {
        if (!this.jsonDirty) {
            this.jsonDirty = true;
            this.referedByAllenRelationships.forEach(R => R.setJsonDirty());
        }
        return this;
    }
    toJSON() {
        if (this.jsonDirty) {
            this.jsonDirty = false;
            let actions = [...this.channelActions.values()];
            return this.lastJSON = {
                type: "CCBLContext",
                parentOfAllenRelationships: this.parentOfAllenRelationships.map(r => r.toJSON()),
                channelActions: actions.map(a => a.toJSON()),
                activable: this.activable,
                contextName: this.contextName
            };
        }
        else {
            return this.lastJSON;
        }
    }
    getChannelActions() {
        return [...this.channelActions.values()];
    }
    appendParentOfAllenRelationships(...allens) {
        this.jsonDirty = true;
        allens.forEach(R => {
            if (this.parentOfAllenRelationships.indexOf(R) === -1) {
                this.parentOfAllenRelationships.push(R);
                R.setParent(this);
            }
        });
        return this;
    }
    removeParentOfAllenRelationships(...allens) {
        this.jsonDirty = true;
        this.parentOfAllenRelationships = this.parentOfAllenRelationships.filter(R => allens.indexOf(R) === -1);
        allens.forEach(R => R.setParent(null));
        return this;
    }
    appendReferedByAllenRelationships(...allens) {
        this.jsonDirty = true;
        allens.forEach(R => {
            if (this.referedByAllenRelationships.indexOf(R) === -1) {
                this.referedByAllenRelationships.push(R);
                R.appendChildren(this);
            }
        });
        return this;
    }
    removeReferedByAllenRelationships(...allens) {
        this.jsonDirty = true;
        this.referedByAllenRelationships = this.referedByAllenRelationships.filter(R => allens.indexOf(R) === -1);
        allens.forEach(R => R.setParent(null));
        return this;
    }
    getActivable() { return this.activable; }
    setActivable(value = true) {
        this.jsonDirty = true;
        this.activable = value;
        return this;
    }
    getActive() { return true; }
    appendChannelActions(...actions) {
        this.jsonDirty = true;
        actions.forEach(a => {
            let prev_a = this.channelActions.get(a.channel);
            if (prev_a) {
                prev_a.attachTo(null);
                prev_a.jsonDirty.off(this.cbActionDirty);
            }
            this.channelActions.set(a.channel, a);
            a.attachTo(this);
            a.jsonDirty.on(this.cbActionDirty);
        });
        return this;
    }
    removeChannelActions(...actions) {
        this.jsonDirty = true;
        actions.forEach(a => {
            if (this.channelActions.get(a.channel) === a) {
                this.channelActions.delete(a.channel);
                a.attachTo(null);
                a.jsonDirty.off(this.cbActionDirty);
            }
        });
        return this;
    }
    getPriority() { return this.priority; }
    setPriority(P) {
        this.priority = P;
        return this;
    }
    getParentOfAllenRelationships() {
        return this.parentOfAllenRelationships;
    }
    getReferedByAllenRelationships() {
        return this.referedByAllenRelationships;
    }
    getContainingStateContext() {
        const LR = this.getReferedByAllenRelationships();
        const R = LR.find(R => R.getAllenType() !== AllenInterface_1.AllenType.Meet);
        if (R) {
            return R.getParent();
        }
        else {
            const relMeet = LR.find(R => R.getAllenType() === AllenInterface_1.AllenType.Meet);
            if (relMeet) {
                return relMeet.parent.getContainingStateContext();
            }
            else {
                return undefined;
            }
        }
    }
}
exports.CCBLContext = CCBLContext;
//# sourceMappingURL=Context.js.map