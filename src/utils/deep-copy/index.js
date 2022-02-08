// TODO: fix typescript
export const deepCopy = (value) => {
  if(typeof value !== "object") return value;
  if(value === null) return null;

  if(Array.isArray(value)) {
    const newArrayValue = []
    const { length } = value;
    for(let i = 0; i < length; i += 1) {
      newArrayValue.push(deepCopy(value[i]));
    }
    return newArrayValue;
  }

  if(typeof value === "object") {
    const keys = Object.keys(value);
    const values = Object.values(value);

    const newObjectValue = {};

    for(let i = 0; i < keys.length; i += 1) {
      newObjectValue[keys[i]] = deepCopy(values[i]);
    }
    return newObjectValue;
  }

  return value;
}