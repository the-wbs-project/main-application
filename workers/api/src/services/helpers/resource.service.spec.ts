import { ResourceService } from './resource.service';

describe('ResourceService - Check Empty', () => {
  const resources = new ResourceService({});

  it('It should return whatever you send it', () => {
    for (const x of ['General.Test', 'Hello.World', 'Category_Phase.Initial']) {
      expect(resources.get(x)).toEqual(x);
    }
  });
});

describe('ResourceService - Check Normal', () => {
  const resources = new ResourceService({
    General: {
      Hello: 'World',
      Nova: 'Scotia',
    },
    Identity: {
      User: 'User',
    },
  });

  it('It should return properly', () => {
    expect(resources.get('General.Hello')).toEqual('World');
    expect(resources.get('Identity.User')).toEqual('User');
  });
  it('It should return what you send it', () => {
    expect(resources.get('General.Hello2')).toEqual('General.Hello2');
    expect(resources.get('Hello.World')).toEqual('Hello.World');
  });
});
