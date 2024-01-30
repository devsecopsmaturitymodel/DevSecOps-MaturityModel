import { ToStringValuePipe } from './to-string-value.pipe';

describe('ToStringValuePipe', () => {
  it('create an instance', () => {
    const pipe = new ToStringValuePipe();
    expect(pipe).toBeTruthy();
  });
});
