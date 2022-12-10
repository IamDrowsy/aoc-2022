import { asNumber } from "./common";

type Selector<PointType> = (point: PointType) => PointType[];

export interface Grid<PointType, ValueType> {
  get(point: PointType): ValueType;
  getAll(points: PointType[]): ValueType[];
  getSelected(point: PointType, selector: Selector<PointType>): ValueType[];
  put(point: PointType, value: ValueType): Grid<PointType, ValueType>;
  keys(): PointType[];
}

export class RecordGrid<PointType extends [...number[]], ValueType>
  implements Grid<PointType, ValueType>
{
  grid: Record<string, ValueType> = {};
  defaultValue: ValueType;
  fromPointType(point: PointType): string {
    return point.join(":");
  }
  toPointType(s: string): PointType {
    return s.split(":").map(asNumber) as PointType;
  }

  get(point: PointType): ValueType {
    const result = this.grid[this.fromPointType(point)];
    if (result === undefined) {
      return this.defaultValue;
    } else {
      return result;
    }
  }
  getAll(points: PointType[]): ValueType[] {
    return points.map(this.get);
  }
  getSelected(point: PointType, selector: Selector<PointType>): ValueType[] {
    return this.getAll(selector(point));
  }

  put(point: PointType, value: ValueType) {
    this.grid[this.fromPointType(point)] = value;
    return this;
  }
  keys(): PointType[] {
    return Object.keys(this.grid).map(this.toPointType);
  }
}
