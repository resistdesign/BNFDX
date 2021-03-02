import Path from 'path';
import FS from 'fs';
import { svgPathDParser } from './parser';

const MOCK_DATA = FS.readFileSync(Path.join(__dirname, 'mock-data.txt'), { encoding: 'utf8' });

describe('parser', () => {
  test('should parse path data', () => {
    const result = svgPathDParser(MOCK_DATA);

    expect(result).toBeTruthy();
  });
});
