/**
 * @jest-environment node
 */

import Fingerprint2 from "fingerprintjs2";
import useFingerprint from "../useFingerprint";
import { renderHook, act } from "@testing-library/react-hooks";

describe("useFingerprint hook", () => {
  beforeEach(() => {
    Fingerprint2.get = jest
      .fn()
      .mockImplementation((cb) => cb([{ key: "foo", value: "bar" }]));
  });

  it("should return null and not crash if window is undefined", () => {
    jest.useFakeTimers();

    const { result } = renderHook(useFingerprint);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.error).toBeUndefined();
    expect(result.current).toMatchSnapshot();
    expect(result.current).toBe(null);
  });
});
