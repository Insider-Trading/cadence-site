export const familyNames = Object.freeze({cyan:'ih',orange:'eh',pink:'long e',violet:'long ai'});
export function createCorrections(tokens) {
  const original = new Map(tokens.map(token => [token.word.toLowerCase(), token.family]));
  let overrides = new Map();
  const history = [];
  const family = word => overrides.has(word.toLowerCase()) ? overrides.get(word.toLowerCase()) : original.get(word.toLowerCase());
  const change = (word, target) => {
    const key = word.toLowerCase();
    if (!original.has(key) || (target !== null && !Object.hasOwn(familyNames,target))) return false;
    if (family(key) === target) return false;
    history.push(new Map(overrides));
    if (target === original.get(key)) overrides.delete(key);
    else overrides.set(key,target);
    return true;
  };
  return {
    family, change,
    members: target => [...original.keys()].filter(word => family(word) === target),
    get changed() { return overrides.size; },
    get canUndo() { return history.length > 0; },
    undo() { if (!history.length) return false; overrides = history.pop(); return true; },
    reset() { if (!overrides.size) return false; history.push(new Map(overrides)); overrides.clear(); return true; }
  };
}
