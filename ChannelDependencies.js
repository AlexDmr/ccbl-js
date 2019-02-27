"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapDependencies = new Map();
function getAllDependencies(emitter) {
    const L = [];
    if (mapDependencies.has(emitter)) {
        const map = mapDependencies.get(emitter);
        map.forEach(LE => L.push(...LE));
    }
    return L;
}
exports.getAllDependencies = getAllDependencies;
function updateDependencies(emitter, expression, dependencies) {
    if (emitter) {
        if (!mapDependencies.has(emitter)) {
            mapDependencies.set(emitter, new Map());
        }
        const map = mapDependencies.get(emitter);
        map.set(expression, dependencies);
        const LL = [[emitter]];
        while (LL.length) {
            const path = LL.pop();
            const lastEmitter = path[path.length - 1];
            const Ldep = getAllDependencies(lastEmitter);
            const Lcircular = Ldep.filter(id => id === path[0]).map(id => [...path, id]);
            if (Lcircular.length) {
                const Lstr = Lcircular.reduce((acc, Lid) => [...acc, Lid.reduce((S, id) => `${S}<-${id.get_Id()}`, "")], []);
                console.error("CIRCULAR DEPENDENCIES:");
                Lstr.forEach(str => console.error(`\t* ${str}`));
                throw { message: "CIRCULAR DEPENDENCIES:", circularities: Lstr };
            }
            else {
                LL.push(...Ldep.map(e => [...path, e]));
            }
        }
    }
    else {
        mapDependencies.forEach((map, em) => {
            if (map.has(expression)) {
                updateDependencies(em, expression, dependencies);
            }
        });
    }
}
exports.updateDependencies = updateDependencies;
//# sourceMappingURL=ChannelDependencies.js.map