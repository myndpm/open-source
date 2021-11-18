import pug2html from './pug2html';

describe('pug2html', () => {
  it('should work', () => {
    const spy = jest.spyOn(pug2html, 'start')
    pug2html.start();
    expect(spy).toBeCalled();
  });
});
