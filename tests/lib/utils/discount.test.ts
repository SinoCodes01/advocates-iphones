import { calculateDiscountPercentage } from "../../../lib/utils";

describe("calculateDiscountPercentage", () => {
  it("calculates correct discount percentage", () => {
    expect(calculateDiscountPercentage(80, 100)).toBe(20);
    expect(calculateDiscountPercentage(50, 100)).toBe(50);
    expect(calculateDiscountPercentage(90, 100)).toBe(10);
  });

  it("returns 0 if price is equal to or greater than compareAtPrice", () => {
    expect(calculateDiscountPercentage(100, 100)).toBe(0);
    expect(calculateDiscountPercentage(120, 100)).toBe(0);
  });

  it("handles rounding correctly", () => {
    // 33.333...% -> 33%
    expect(calculateDiscountPercentage(66.67, 100)).toBe(33);
  });
});