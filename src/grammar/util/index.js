export function join(obj) {
  for (let key in obj) {
    const value = obj[key];
    if (value === undefined) continue;
    else if (typeof value === 'function') obj[key] = value(o => o.toObject());
    else if (value.toObject) obj[key] = value.toObject();
  }
  return obj;
}

export function first(obj) { return obj.toObject()[0]; }

export function prepend(first, rest) { return [first.toObject()].concat(rest.toObject()); }