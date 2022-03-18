import { PROJECT_VIEW, WbsNode } from '@app/models';
import { Transformer } from './transformer.service';
const oneDeep: WbsNode[] = [
  {
    id: '12',
    levels: { p: [1], d: [2] },
    title: 'Hello',
  },
  {
    id: '34',
    levels: { p: [3], d: [1] },
    title: 'John',
  },
  {
    id: '56',
    levels: { p: [2], d: [3] },
    title: 'Doe',
  },
];
const twoDeep: WbsNode[] = [
  {
    id: '12',
    levels: { p: [1], d: [2] },
    title: 'Hello',
  },
  {
    id: '34',
    levels: { p: [3], d: [1] },
    title: 'John',
  },
  {
    id: '78',
    levels: { p: [2, 1], d: [1, 2] },
    title: 'Doe',
  },
  {
    id: '90',
    levels: { p: [2, 2], d: [1, 1] },
    title: 'Doe',
  },
  {
    id: '56',
    levels: { p: [2], d: [3] },
    title: 'Doe',
  },
];
const threeDeep: WbsNode[] = [
  {
    id: '12',
    levels: { p: [2, 1, 1], d: [1, 2, 1] },
    title: 'Hello',
  },
  {
    id: '34',
    levels: { p: [3], d: [1] },
    title: 'John',
  },
  {
    id: '78',
    levels: { p: [2, 1], d: [1, 2] },
    title: 'Doe',
  },
  {
    id: '90',
    levels: { p: [2, 2], d: [1, 1] },
    title: 'Doe',
  },
  {
    id: '56',
    levels: { p: [2], d: [3] },
    title: 'Doe',
  },
];
describe('Transformer - 1 Level Phase', () => {
  const results = Transformer.wbsNodeTree(PROJECT_VIEW.PHASE, oneDeep);

  it('should not be null and length of 3', () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(3);
  });
  it('should all have a depth of 1', () => {
    for (const node of results) expect(node.depth).toEqual(1);
  });
  const indexes = [
    [0, 0],
    [1, 2],
    [2, 1],
  ];
  for (const indexii of indexes) {
    const i1 = indexii[0];
    const i2 = indexii[1];
    it('check ' + i1, () => {
      expect(results[i1].id).toEqual(oneDeep[i2].id);
      expect(results[i1].title).toEqual(oneDeep[i2].title);
      expect(results[i1].level).toEqual(
        (oneDeep[i2].levels.p ?? [])[0].toString()
      );
    });
  }
});

describe('Transformer - 1 Level Discipline', () => {
  const results = Transformer.wbsNodeTree(PROJECT_VIEW.DISCIPLINE, oneDeep);

  it('should not be null and length of 3', () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(3);
  });
  it('should all have a depth of 1', () => {
    for (const node of results) expect(node.depth).toEqual(1);
  });
  const indexes = [
    [0, 1],
    [1, 0],
    [2, 2],
  ];
  for (const indexii of indexes) {
    const i1 = indexii[0];
    const i2 = indexii[1];
    it('check ' + i1, () => {
      expect(results[i1].id).toEqual(oneDeep[i2].id);
      expect(results[i1].title).toEqual(oneDeep[i2].title);
      expect(results[i1].level).toEqual(
        (oneDeep[i2].levels.d ?? [])[0].toString()
      );
    });
  }
});

describe('Transformer - 2 Level Phase', () => {
  const results = Transformer.wbsNodeTree(PROJECT_VIEW.PHASE, twoDeep);

  it('should not be null and length of 3', () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(3);
  });
  it('should all have a depth of 1', () => {
    for (const node of results) expect(node.depth).toEqual(1);
  });
  const indexes = [
    [0, 0],
    [1, 4],
    [2, 1],
  ];
  for (const indexii of indexes) {
    const i1 = indexii[0];
    const i2 = indexii[1];
    it('check ' + i1, () => {
      expect(results[i1].id).toEqual(twoDeep[i2].id);
      expect(results[i1].title).toEqual(twoDeep[i2].title);
      expect(results[i1].level).toEqual(
        (twoDeep[i2].levels.p ?? [])[0].toString()
      );
    });
  }

  it('check children by hand', () => {
    expect(results[0].children).toBeNull();
    expect(results[2].children).toBeNull();
    expect(results[1].children).not.toBeNull();

    if (results[1].children) {
      expect(results[1].children.length).toEqual(2);
      expect(results[1].children[0].id).toEqual('78');
      expect(results[1].children[1].id).toEqual('90');
      expect(results[1].children[0].depth).toEqual(2);
      expect(results[1].children[1].depth).toEqual(2);
    }
  });
});

describe('Transformer - 2 Level Discipline', () => {
  const results = Transformer.wbsNodeTree(PROJECT_VIEW.DISCIPLINE, twoDeep);

  it('should not be null and length of 3', () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(3);
  });
  it('should all have a depth of 1', () => {
    for (const node of results) expect(node.depth).toEqual(1);
  });
  const indexes = [
    [0, 1],
    [1, 0],
    [2, 4],
  ];
  for (const indexii of indexes) {
    const i1 = indexii[0];
    const i2 = indexii[1];
    it('check ' + i1, () => {
      expect(results[i1].id).toEqual(twoDeep[i2].id);
      expect(results[i1].title).toEqual(twoDeep[i2].title);
      expect(results[i1].level).toEqual(
        (twoDeep[i2].levels.d ?? [])[0].toString()
      );
    });
  }

  it('check children by hand', () => {
    expect(results[1].children).toBeNull();
    expect(results[2].children).toBeNull();
    expect(results[0].children).not.toBeNull();

    if (results[0].children) {
      expect(results[0].children.length).toEqual(2);
      expect(results[0].children[0].id).toEqual('90');
      expect(results[0].children[1].id).toEqual('78');
      expect(results[0].children[0].depth).toEqual(2);
      expect(results[0].children[1].depth).toEqual(2);
    }
  });
});

describe('Transformer - 3 Level Phase', () => {
  const results = Transformer.wbsNodeTree(PROJECT_VIEW.PHASE, threeDeep);

  it('should not be null and length of 3', () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(2);
  });
  it('should all have a depth of 1', () => {
    for (const node of results) expect(node.depth).toEqual(1);
  });
  const indexes = [
    [0, 4],
    [1, 1],
  ];
  for (const indexii of indexes) {
    const i1 = indexii[0];
    const i2 = indexii[1];
    it('check ' + i1, () => {
      expect(results[i1].id).toEqual(twoDeep[i2].id);
      expect(results[i1].title).toEqual(twoDeep[i2].title);
      expect(results[i1].level).toEqual(
        (twoDeep[i2].levels.p ?? [])[0].toString()
      );
    });
  }

  it('check children by hand', () => {
    expect(results[1].children).toBeNull();
    expect(results[0].children).not.toBeNull();

    if (results[0].children) {
      expect(results[0].children.length).toEqual(2);
      expect(results[0].children[0].id).toEqual('78');
      expect(results[0].children[1].id).toEqual('90');
      expect(results[0].children[0].depth).toEqual(2);
      expect(results[0].children[1].depth).toEqual(2);

      if (results[0].children[0].children) {
        expect(results[0].children[0].children.length).toEqual(1);
        expect(results[0].children[0].children[0].id).toEqual('12');
        expect(results[0].children[0].children[0].depth).toEqual(3);
      }
    }
  });
});
describe('Transformer - 3 Level Discipline', () => {
  const results = Transformer.wbsNodeTree(PROJECT_VIEW.DISCIPLINE, threeDeep);

  it('should not be null and length of 3', () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(2);
  });
  it('should all have a depth of 1', () => {
    for (const node of results) expect(node.depth).toEqual(1);
  });
  const indexes = [
    [0, 1],
    [1, 4],
  ];
  for (const indexii of indexes) {
    const i1 = indexii[0];
    const i2 = indexii[1];
    it('check ' + i1, () => {
      expect(results[i1].id).toEqual(twoDeep[i2].id);
      expect(results[i1].title).toEqual(twoDeep[i2].title);
      expect(results[i1].level).toEqual(
        (twoDeep[i2].levels.d ?? [])[0].toString()
      );
    });
  }

  it('check children by hand', () => {
    expect(results[1].children).toBeNull();
    expect(results[0].children).not.toBeNull();

    if (results[0].children) {
      expect(results[0].children.length).toEqual(2);
      expect(results[0].children[0].id).toEqual('90');
      expect(results[0].children[1].id).toEqual('78');
      expect(results[0].children[0].depth).toEqual(2);
      expect(results[0].children[1].depth).toEqual(2);

      if (results[0].children[0].children) {
        expect(results[0].children[0].children.length).toEqual(1);
        expect(results[0].children[0].children[0].id).toEqual('12');
        expect(results[0].children[0].children[0].depth).toEqual(3);
      }
    }
  });
});
