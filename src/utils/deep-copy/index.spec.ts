import { describe, expect, it } from "@jest/globals";
import { deepCopy } from "./index";

describe("deep-copy", () => {
  it("undefined", () => {
    const copied = deepCopy(undefined);
    
    expect(copied).toBeUndefined();
  })

  it("null", () => {
    const copied = deepCopy(null);
    expect(copied).toBeNull();
  })
  
  it("string", () => {
    const copied = deepCopy("string")
    expect(copied).toBe("string");
  })
  it("long string", () => {
    const copied = deepCopy("long string long string long string long string long string long string long string long string long string long string");
    expect(copied).toBe("long string long string long string long string long string long string long string long string long string long string")
  })

  it("number", () => {
    const copied = deepCopy(12345);
    expect(copied).toBe(12345);
  })

  it("1deps array", () => {
    const arr = [1,2,3,4,5,"str",undefined, null];
    const copied = deepCopy(arr);
    expect(arr !== copied).toBe(true);

    arr.forEach((el, index) => {
      expect(copied[index] === el).toBe(true);
    })
  })
  
  it("2deps array", () => {
    const arr = [1,2,3,[1,2,3,4],{ a:"1",b:"2" }];
    const copied = deepCopy(arr);
    expect(arr !== copied).toBe(true);
    expect(arr.length === copied.length).toBe(true);

    expect(Array.isArray(copied[3])).toBe(true);
    const arrInCopied = copied[3] as Array<number>;
    expect(arrInCopied[0]).toBe(1);
    expect(arrInCopied !== arr[3]).toBe(true);

    expect(typeof copied[4] === "object");
    const objInCopied = copied[4] as Record<string, string>;
    expect(objInCopied.a).toBe("1");
    expect(objInCopied.b).toBe("2");
    expect(objInCopied !== arr[4]).toBe(true);
  })

  it("1deps object", () => {
    const obj = { a:1, b:2, c:2, d:null, e:undefined }
    const copied = deepCopy(obj);

    expect(copied !== obj).toBe(true);
    expect(Object.keys(copied).length === Object.keys(obj).length).toBe(true);

    expect(copied.a === 1).toBe(true);
    expect(copied.b === 2).toBe(true);
    expect(copied.c === 2).toBe(true);
    expect(copied.d).toBeNull();
    expect(copied.e).toBeUndefined();
  })

  it("2deps object", () => {
    const obj = { a:1, b: { c:1 }, d:[5] }
    const copied = deepCopy(obj);

    expect(copied !== obj).toBe(true);
    expect(Object.keys(copied).length === Object.keys(obj).length).toBe(true);

    expect(copied.a).toBe(1);
    expect(copied.b.c).toBe(1);
    expect(copied.d[0]).toBe(5);
  })
})