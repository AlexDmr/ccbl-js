import { MessageForThread, PayloadForMain, PayloadForThread, ResponseForMain } from "./ccbl-exec-data";
import { WorkerComm } from "./ccbl-exec-worker";
export declare function initWorker(W: WorkerComm<MessageForThread<PayloadForThread>, ResponseForMain<PayloadForMain>>): void;
