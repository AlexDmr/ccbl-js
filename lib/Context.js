import { AllenType } from "./AllenInterface";
import { CCBLEmitter } from "./Emitter";
export class CCBLContext {
    constructor() {
        this.priority = 0;
        this.parentOfAllenRelationships = [];
        this.referedByAllenRelationships = [];
        this.activable = false;
        this.channelActions = new Map();
        this.jsonDirty = true;
        this.emitterActive = new CCBLEmitter();
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
        this.removeReferedByAllenRelationships(...this.referedByAllenRelationships);
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
                type: this.getType(),
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
    getContextName() {
        return this.contextName;
    }
    getChannelActions() {
        return [...this.channelActions.values()];
    }
    appendParentOfAllenRelationships(...allens) {
        this.setJsonDirty();
        allens.forEach(R => {
            if (this.parentOfAllenRelationships.indexOf(R) === -1) {
                this.parentOfAllenRelationships.push(R);
                R.setParent(this);
            }
        });
        return this;
    }
    removeParentOfAllenRelationships(...allens) {
        this.setJsonDirty();
        this.parentOfAllenRelationships = this.parentOfAllenRelationships.filter(R => allens.indexOf(R) === -1);
        allens.forEach(R => R.setParent(undefined));
        return this;
    }
    appendReferedByAllenRelationships(...allens) {
        this.setJsonDirty();
        allens.forEach(R => {
            if (this.referedByAllenRelationships.indexOf(R) === -1) {
                this.referedByAllenRelationships.push(R);
                R.appendChildren(this);
            }
        });
        return this;
    }
    removeReferedByAllenRelationships(...allens) {
        this.setJsonDirty();
        this.referedByAllenRelationships = this.referedByAllenRelationships.filter(R => allens.indexOf(R) === -1);
        allens.forEach(R => R.setParent(undefined));
        return this;
    }
    getActivable() { return this.activable; }
    setActivable(value = true) {
        this.setJsonDirty();
        this.activable = value;
        return this;
    }
    onceActiveUpdated(cb) {
        this.emitterActive.once(cb);
        return this;
    }
    onActiveUpdated(cb) {
        this.emitterActive.on(cb);
        return this;
    }
    offActiveUpdated(cb) {
        this.emitterActive.off(cb);
        return this;
    }
    getActive() { return true; }
    appendChannelActions(...actions) {
        this.setJsonDirty();
        actions.forEach(a => {
            let prev_a = this.channelActions.get(a.channel);
            if (prev_a) {
                prev_a.attachTo(undefined);
                prev_a.jsonDirty.off(this.cbActionDirty);
            }
            this.channelActions.set(a.channel, a);
            a.attachTo(this);
            a.jsonDirty.on(this.cbActionDirty);
        });
        return this;
    }
    removeChannelActions(...actions) {
        this.setJsonDirty();
        actions.forEach(a => {
            if (this.channelActions.get(a.channel) === a) {
                this.channelActions.delete(a.channel);
                a.attachTo(undefined);
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
        const R = LR.find(R => R.getAllenType() !== AllenType.Meet);
        if (R) {
            return R.getParent();
        }
        else {
            const relMeet = LR.find(R => R.getAllenType() === AllenType.Meet);
            if (relMeet) {
                return relMeet.parent?.getContainingStateContext();
            }
            else {
                return undefined;
            }
        }
    }
}
//# sourceMappingURL=Context.js.map