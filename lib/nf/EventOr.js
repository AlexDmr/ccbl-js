import { CCBLEvent } from "./Event";
export class CCBLEventOr extends CCBLEvent {
    constructor(eventName = "OR", env, fctOR) {
        super({ eventName, env });
        this.env = env;
        this.fctOR = fctOR;
        this.children = [];
        this.subscribeCB = (event) => {
            this.trigger(this.fctOR(event));
        };
    }
    dispose() {
        this.remove(...this.children);
        this.children.forEach(evt => evt.dispose());
        super.dispose();
    }
    append(...eventNodes) {
        eventNodes.forEach(eventNode => {
            if (this.children.indexOf(eventNode) === -1) {
                this.children.push(eventNode);
                eventNode.on(this.subscribeCB);
            }
        });
        return this;
    }
    remove(...eventNodes) {
        eventNodes.forEach(eventNode => {
            let pos = this.children.indexOf(eventNode);
            if (pos !== -1) {
                this.children.splice(pos, 1)[0].off(this.subscribeCB);
            }
        });
        return this;
    }
}
//# sourceMappingURL=EventOr.js.map