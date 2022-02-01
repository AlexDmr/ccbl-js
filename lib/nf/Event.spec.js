import { CCBLTestClock } from "./Clock";
import { CCBLEvent } from "./Event";
import { CCBLEventOr } from "./EventOr";
import { CCBLEventAnd } from "./EventAnd";
import { CCBLEventSeq } from "./EventSeq";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
let clock = new CCBLTestClock();
let env = new CCBLEnvironmentExecution(clock);
describe("Event<string banco>:", () => {
    let event = new CCBLEvent({
        eventName: "pipo event",
        env,
        expressionFilter: `event.value == "banco"`
    });
    let events = [];
    event.on(evt => events.push(evt));
    it("trigger 'toto' => not catched", () => {
        event.trigger({ value: "toto" });
        expect(events.length).toEqual(0);
    });
    it("trigger 'banco' => catched", () => {
        event.trigger({ value: "banco" });
        expect(events.length).toEqual(1);
    });
});
describe("EventOr( Event<boolean>, Event<string banco> ):", () => {
    let eventBool = new CCBLEvent({ eventName: "eventBool", env });
    let eventBanco = new CCBLEvent({
        eventName: "eventBanco",
        env,
        expressionFilter: `event.value == "banco"`
    });
    let eventOr = new CCBLEventOr("eventOr", env, evt => evt);
    eventOr.append(eventBool, eventBanco);
    let events = [];
    eventOr.on(evt => events.push(evt));
    it("trigger eventBool => catched", () => {
        eventBool.trigger({ value: false });
        expect(events.length).toEqual(1);
    });
    it("trigger 'banco' => catched", () => {
        eventBanco.trigger({ value: "banco" });
        expect(events.length).toEqual(2);
    });
});
describe("EventAnd( Event<boolean>, Event<boolean>, Event<string banco> ) in 1000ms:", () => {
    let eventBool1 = new CCBLEvent({ eventName: "eventBool1", env });
    let eventBool2 = new CCBLEvent({ eventName: "eventBool2", env });
    let eventBanco = new CCBLEvent({
        eventName: "eventBanco",
        env,
        expressionFilter: `event.value == "banco"`
    });
    let eventAnd = new CCBLEventAnd("eventAnd", env, 1000, events => ({ value: "got all" }));
    eventAnd.append(eventBool1, eventBool2, eventBanco);
    let events = [];
    eventAnd.on(evt => events.push(evt));
    it("t0 trigger eventBool1 => 1 registered", () => {
        eventBool1.trigger({ value: false });
        expect(eventAnd.getNbEventsRegistered()).toEqual(1);
    });
    it("t100 trigger 'banco' => 2 registered", () => {
        clock.forward(100);
        eventBanco.trigger({ value: "banco" });
        expect(eventAnd.getNbEventsRegistered()).toEqual(2);
    });
    it("t1050 trigger eventBool2 => 2 registered", () => {
        clock.forward(950);
        eventBool2.trigger({ value: true });
        expect(eventAnd.getNbEventsRegistered()).toEqual(2);
    });
    it("t1100 trigger eventBool2 => trigger!", () => {
        clock.forward(50);
        eventBool1.trigger({ value: true });
        expect(events.length).toEqual(1);
    });
    it("t1100 trigger eventBool2 => 0 registered", () => {
        expect(eventAnd.getNbEventsRegistered()).toEqual(0);
    });
});
describe("EventAnd (eventBool1, eventBool1, eventBool1) in 1000ms:", () => {
    let eventBool1 = new CCBLEvent({ eventName: "eventBool1", env });
    let eventAnd = new CCBLEventAnd("eventAnd", env, 1000, events => { return { value: "got all" }; });
    eventAnd.append(eventBool1, eventBool1, eventBool1);
    let events = [];
    eventAnd.on(evt => events.push(evt));
    it("t0 trigger eventBool1 => 1 registered", () => {
        eventBool1.trigger({ value: false });
        expect(eventAnd.getNbEventsRegistered()).toEqual(1);
    });
    it("t100 trigger eventBool1 => 21 registered", () => {
        clock.forward(100);
        eventBool1.trigger({ value: false });
        expect(eventAnd.getNbEventsRegistered()).toEqual(2);
    });
    it("t2000 trigger eventBool1 => 0 registered", () => {
        clock.forward(100);
        eventBool1.trigger({ value: false });
        expect(eventAnd.getNbEventsRegistered()).toEqual(0);
    });
    it("t2000 trigger eventBool1 => trigger!", () => expect(events.length).toBe(1));
});
describe("EventSeq( eventBool1, Event<string banco>, eventBool2 ) in 1000ms:", () => {
    let eventBool1 = new CCBLEvent({ eventName: "eventBool1", env });
    let eventBool2 = new CCBLEvent({ eventName: "eventBool2", env });
    let eventBanco = new CCBLEvent({
        eventName: "eventBanco",
        env,
        expressionFilter: `event.value == "banco"`
    });
    let eventSeq = new CCBLEventSeq("eventSeq", env, 1000, events => { return { value: "got all" }; });
    eventSeq.append(eventBool1, eventBanco, eventBool2);
    let events = [];
    eventSeq.on(evt => events.push(evt));
    it("t0 trigger 'banco' => 1 registered", () => {
        eventBanco.trigger({ value: "banco" });
        expect(eventSeq.getNbEventsRegistered()).toEqual(1);
    });
    it("t100 trigger eventBool1 => 2 registered", () => {
        clock.forward(100);
        eventBool1.trigger({ value: false });
        return expect(eventSeq.getNbEventsRegistered()).toEqual(2);
    });
    it("t200 trigger eventBool2 => 3 registered", () => {
        clock.forward(100);
        eventBool2.trigger({ value: false });
        expect(eventSeq.getNbEventsRegistered()).toEqual(3);
    });
    it("t300 trigger 'banco' => 4 registered", () => {
        clock.forward(100);
        eventBanco.trigger({ value: "banco" });
        expect(eventSeq.getNbEventsRegistered()).toEqual(4);
    });
    it("t400 trigger eventBool2 => 2 registered", () => {
        clock.forward(100);
        eventBool2.trigger({ value: false });
        expect(eventSeq.getNbEventsRegistered()).toEqual(2);
    });
    it("t400 trigger eventBool2 => 2 registered", () => expect(events.length).toBe(1));
});
//# sourceMappingURL=Event.spec.js.map