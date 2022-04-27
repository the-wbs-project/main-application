import { Project, PROJECT_STATI, WbsNode } from '../../models';
import { Resources } from '../resource.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';

const resources = new Resources({
  Category_Phase: {
    Initial: 'Initial Phase',
    Planning: 'Planning Phase',
    Execution: 'Execution Phase',
    Contract: 'Contract Phase',
  },
});
const project: Project = {
  id: '123',
  owner: 'acme_engineering',
  title: 'Market Research Project',
  status: PROJECT_STATI.PLANNING,
  activity: [],
  lastModified: new Date(),
  categories: {
    discipline: ['mechanical', 'electrical', 'structural', 'survey'],
    phase: ['initial', 'planning', 'execution', 'contract'],
  },
  nodes: [],
};
const cats = [
  {
    id: 'initial',
    label: 'Category_Phase.Initial',
    tags: ['Initial', 'Initial Phase'],
  },
  {
    id: 'planning',
    label: 'Category_Phase.Planning',
    tags: ['Planning', 'Planning Phase'],
  },
  {
    id: 'execution',
    label: 'Category_Phase.Execution',
    tags: ['Execution', 'Execution Phase'],
  },
  {
    id: 'contract',
    label: 'Category_Phase.Contract',
    tags: ['Contract', 'Contract Phase'],
  },
];
const oneDeep: WbsNode[] = [
  {
    id: '321',
    phase: {
      parentId: 'initial',
      order: 1,
      levels: [1, 1],
    },
    title: 'Hello',
  },
  {
    id: '32221',
    phase: {
      parentId: 'initial',
      order: 2,
      levels: [1, 2],
    },
    title: 'Hello 2',
  },
  {
    id: '56',
    phase: {
      parentId: 'planning',
      order: 1,
      levels: [2, 1],
    },
    title: 'Doe',
  },
];
/*
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
];*/

const service = new WbsNodePhaseTransformer(cats, [], resources);
describe('WbsNodePhaseTransformer - 1 Level Phase', () => {
  project.nodes = [];

  const results = service.run(project);

  it('should not be null and length of 4', () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(4);
  });
  for (let i = 0; i < project.categories.phase.length; i++) {
    const catId = project.categories.phase[i];

    it('check cat ' + i, () => {
      expect(results[i].id).toEqual(catId);
    });
  }
});
describe('WbsNodePhaseTransformer - 2 Level Phase', () => {
  project.nodes = oneDeep;

  const results = service.run(project);
  const length = project.categories.phase.length + project.nodes.length;

  it('should not be null and length of ' + length, () => {
    expect(results).not.toBeNull();
    expect(results.length).toEqual(length);
  });

  it('cat 1 should have 2 children', () => {
    const cat1Id = 'initial';
    const cat1Children = results.filter((x) => x.parentId === cat1Id);
    expect(cat1Children.length).toEqual(2);

    const ex1 = oneDeep[0];
    const ex2 = oneDeep[1];

    expect(cat1Children[0].id).toEqual(ex1.id);
    expect(cat1Children[0].levelText).toEqual(ex1.phase?.levels.join('.'));
    expect(cat1Children[0].levels).toEqual(ex1.phase?.levels);
    expect(cat1Children[0].order).toEqual(ex1.phase?.order);
    expect(cat1Children[0].parentId).toEqual(ex1.phase?.parentId);
    expect(cat1Children[0].title).toEqual(ex1.title);

    expect(cat1Children[1].id).toEqual(ex2.id);
    expect(cat1Children[1].levelText).toEqual(ex2.phase?.levels.join('.'));
    expect(cat1Children[1].levels).toEqual(ex2.phase?.levels);
    expect(cat1Children[1].order).toEqual(ex2.phase?.order);
    expect(cat1Children[1].parentId).toEqual(ex2.phase?.parentId);
    expect(cat1Children[1].title).toEqual(ex2.title);
  });

  it('cat 2 should have 1 children', () => {
    const cat2Id = project.categories.phase[1];
    const cat2Children = results.filter((x) => x.parentId === cat2Id);
    expect(cat2Children.length).toEqual(1);

    const ex1 = oneDeep[2];

    expect(cat2Children[0].id).toEqual(ex1.id);
    expect(cat2Children[0].levelText).toEqual(ex1.phase?.levels.join('.'));
    expect(cat2Children[0].levels).toEqual(ex1.phase?.levels);
    expect(cat2Children[0].order).toEqual(ex1.phase?.order);
    expect(cat2Children[0].parentId).toEqual(ex1.phase?.parentId);
    expect(cat2Children[0].title).toEqual(ex1.title);
  });

  it('cat 3 should have no children', () => {
    const cat3Id = project.categories.phase[2];
    const cat3Children = results.filter((x) => x.parentId === cat3Id);
    expect(cat3Children.length).toEqual(0);
  });

  it('cat 4 should have no children', () => {
    const cat4Id = project.categories.phase[3];
    const cat4Children = results.filter((x) => x.parentId === cat4Id);
    expect(cat4Children.length).toEqual(0);
  });
});

/*
describe('Transformer - 3 Level Phase', () => {
  const results = Transformer.wbsNodeTree(PROJECT_NODE_VIEW.PHASE, threeDeep);

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
        (twoDeep[i2].levels.p ?? [])[0].toString(),
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
  const results = Transformer.wbsNodeTree(PROJECT_NODE_VIEW.DISCIPLINE, threeDeep);

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
        (twoDeep[i2].levels.d ?? [])[0].toString(),
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

*/
