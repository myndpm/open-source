import stylus2scss from './stylus2scss';

describe('stylus2scss', () => {
  it('should work', () => {
    const spy = jest.spyOn(stylus2scss, 'start')
    stylus2scss.start();
    expect(spy).toBeCalled();
  });
});
