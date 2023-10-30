export const mongoFormatter = (obj: Record<string, any>) => {
    const result: Record<string, any> = {};

    for (let [k, v] of Object.entries(obj)) {
        if (k === '_id' || k === '__v' || k === 'createdAt' || k === 'updatedAt') continue;
        result[k] = v;
    }

    return result;
};