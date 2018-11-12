export default arr => {
    const clone = [];

    for (const original of arr) {
        clone.push({
            ...original,
            start: new Date(original.start),
            end: new Date(original.end)
        })
    }

    return clone;
}