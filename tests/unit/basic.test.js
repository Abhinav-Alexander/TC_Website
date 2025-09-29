/**
 * Basic test to verify Jest setup
 */

describe('Basic Test Suite', () => {
  test('should have basic Jest functionality', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('hello');
  });

  test('should have mock functions available', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  test('should handle async operations', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    expect(result).toBe('success');
  });
});
