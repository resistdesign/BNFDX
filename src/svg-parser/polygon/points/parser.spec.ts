import Path from 'path';
import FS from 'fs';
import { svgPolygonPointsParser } from './parser';
import { SVGPoint } from './types';

const MOCK_DATA = FS.readFileSync(Path.join(__dirname, 'mock-data.txt'), { encoding: 'utf8' });

describe('parser', () => {
  test('should parse polygon points', () => {
    const result: SVGPoint[] = svgPolygonPointsParser(MOCK_DATA) as SVGPoint[];
    const [{ x: x1, y: y1 }, skip2, skip3, { x: x4, y: y4 }] = result;

    expect(result).toHaveLength(7);
    expect(x1).toStrictEqual(60);
    expect(y1).toStrictEqual(60);
    expect(skip2).toBeInstanceOf(Object);
    expect(skip3).toBeInstanceOf(Object);
    expect(x4).toStrictEqual(2e2);
    expect(y4).toStrictEqual(90e44);
  });
});
