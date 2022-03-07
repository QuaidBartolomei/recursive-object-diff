const testCases = [
  {
    old: {
      oranges: 1,
      apples: 2,
      grapes: 2,
    },
    new: {
      oranges: 2,
      apples: 1,
    },
    result: [
      ['+', 'oranges', 1],
      ['-', 'grapes', 2],
      ['-', 'apples', 1],
    ],
  },
  {
    old: {
      oranges: 1,
      grapes: 2,
    },
    new: {
      oranges: {
        navel: 2,
        valencian: 3,
      },
    },
    result: [
      ['-', 'oranges', 1],
      ['-', 'grapes', 2],
      ['+', 'oranges.navel', 2],
      ['+', 'oranges.valencian', 3],
    ],
  },
  {
    old: {
      oranges: {
        ripe: {
          navel: 1,
          valencian: 2,
        },
        unripe: 3,
      },
      grapes: 2,
    },
    new: {
      oranges: 1,
      grapes: 2,
    },
    result: [
      ['-', 'oranges.ripe.navel', 1],
      ['-', 'oranges.ripe.valencian', 2],
      ['-', 'oranges.unripe', 3],
      ['+', 'oranges', 1],
    ],
  },
];

// function copied from https://stackoverflow.com/a/61602592/16777502
// $roots keeps previous parent properties as they will be added as a prefix for each prop.
// $sep is just a preference if you want to seperate nested paths other than dot.
const flatten = (obj, roots = [], sep = '.') =>
  Object
    // find props of given object
    .keys(obj)
    // return an object by iterating props
    .reduce(
      (memo, prop) =>
        Object.assign(
          // create a new object
          {},
          // include previously returned object
          memo,
          Object.prototype.toString.call(obj[prop]) === '[object Object]'
            ? // keep working if value is an object
              flatten(obj[prop], roots.concat([prop]), sep)
            : // include current prop and value and prefix prop with the roots
              { [roots.concat([prop]).join(sep)]: obj[prop] }
        ),
      {}
    );

function diff(oldCode, newCode) {
  const oldFlat = flatten(oldCode);
  const newFlat = flatten(newCode);

  const diff1 = Object.keys(oldFlat).map(key => {
    const oldValue = oldFlat[key];
    const newValue = newFlat[key];
    if (!newValue) return ['-', key, oldValue];
    if (newValue > oldValue) return ['+', key, newValue - oldValue];
    if (newValue < oldValue) return ['-', key, oldValue - newValue];
  });

  const diff2 = Object.keys(newFlat).map(key => {
    const oldValue = oldFlat[key];
    const newValue = newFlat[key];
    if (!oldValue) return ['+', key, newValue];
  });

  return [...diff1, ...diff2].filter(Boolean);
}

it('test', () => {
  testCases.forEach(testCase => {
    expect(diff(testCase.old, testCase.new)).toIncludeSameMembers(
      testCase.result
    );
  });
});
