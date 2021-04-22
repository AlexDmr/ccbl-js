let map_Unserialize = new Map();
export function registerUnserializer(id, fct) {
    if (map_Unserialize.has(id) && (map_Unserialize.get(id) !== fct)) {
        throw "ERROR: Cannot associate two unserialization function to a same identifier";
    }
    map_Unserialize.set(id, fct);
}
export function Unserialize(json, env) {
    let fct = map_Unserialize.get(json.type);
    if (fct) {
        return fct(json, env);
    }
    else {
        throw `Unserialize:: No type or unknown type (type = ${json.type}) for json ${json}`;
    }
}
export function DisplayDeepEqual(json1, json2, dec = "") {
    console.log(`${dec}${json1.type}`);
    let keys1 = Object.keys(json1);
    let keys2 = Object.keys(json2);
    let missingIn2 = keys1.filter(k => keys2.indexOf(k) === -1);
    let missingIn1 = keys2.filter(k => keys1.indexOf(k) === -1);
    let commonKeys = keys1.filter(k => keys2.indexOf(k) !== -1);
    if (missingIn2.length) {
        console.error(`${dec}- Missing keys in arg 2:`, ...missingIn2.map(k => k));
    }
    if (missingIn1.length) {
        console.error(`${dec}- Missing keys in arg 1:`, ...missingIn1.map(k => k));
    }
    commonKeys.forEach(k => {
        let type1 = typeof json1[k];
        let type2 = typeof json2[k];
        if (type1 !== type2) {
            console.error(`${dec}- Key ${k} is typed ${type1} / ${type2}`);
        }
        else {
            if (type1 === "object" && json1[k] && json2[k]) {
                console.log(`${dec}${k}`);
                DisplayDeepEqual(json1[k], json2[k], `${dec}  | `);
            }
            else {
                if (json1[k] === json2[k]) {
                    console.log(`${dec}- ${k} = ${json1[k]}`);
                }
                else {
                    console.error(`${dec}- ${k} : ${json1[k]} !== ${json2[k]}`);
                }
            }
        }
    });
}
//# sourceMappingURL=Serialiser.js.map