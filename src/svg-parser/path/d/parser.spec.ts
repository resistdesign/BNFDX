import Path from 'path';
import FS from 'fs';
import { svgPathDParser } from './parser';
import { SVGPathDCommand } from './command-types';

const MOCK_DATA = FS.readFileSync(Path.join(__dirname, 'mock-data.txt'), { encoding: 'utf8' });

describe('parser', () => {
  test('should parse path data', () => {
    const result: SVGPathDCommand[] = svgPathDParser(MOCK_DATA) as SVGPathDCommand[];
    const [{ command: m1 }, { command: c1 }, { command: l1 }, { command: c2 }, { command: z1 }] = result;

    expect(result).toHaveLength(5);
    expect(m1).toStrictEqual('m');
    expect(c1).toStrictEqual('c');
    expect(l1).toStrictEqual('l');
    expect(c2).toStrictEqual('c');
    expect(z1).toStrictEqual('z');
  });
});
