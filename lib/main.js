import { initDuring } from "./AllenDuring";
import { initStartWith } from "./AllenStartWith";
import { initMeet } from "./AllenMeet";
import { initEndWith } from "./AllenEndWith";
import { initContextEvent } from "./ContextEvent";
import { initConstraintValue } from "./ConstraintValue";
import { initChannelActionEvent } from "./ChannelActionEvent";
import { initChannelActionState } from "./ChannelActionState";
import { initStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { initEvent } from "./Event";
import { initEmitterValue } from "./EmitterValue";
let initialized = false;
export function initCCBL() {
    if (!initialized) {
        initDuring();
        initStartWith();
        initMeet();
        initEndWith();
        initContextEvent();
        initConstraintValue();
        initChannelActionEvent();
        initChannelActionState();
        initStateInExecutionEnvironment();
        initEvent();
        initEmitterValue();
        initialized = true;
    }
}
//# sourceMappingURL=main.js.map