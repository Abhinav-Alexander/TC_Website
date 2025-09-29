/**
 * Simple test to verify Jest setup
 */
const { JSDOM } = require('jsdom');

// Create a mock DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div id="test">Hello World</div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

describe('Simple Test Suite', () => {
  test('should have a working DOM environment', () => {
    expect(document.getElementById('test')).toBeTruthy();
    expect(document.getElementById('test').textContent).toBe('Hello World');
  });

  test('should have basic Jest functionality', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('hello');
  });

  test('should have mock functions available', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
