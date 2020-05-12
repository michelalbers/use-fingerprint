import Fingerprint2 from "fingerprintjs2";
import useFingerprint from "../useFingerprint";
import { request } from "http";
import { renderHook, act } from "@testing-library/react-hooks";

describe("useFingerprint hook", () => {
  beforeEach(() => {
    Fingerprint2.get = jest
      .fn()
      .mockImplementation((cb) => cb([{ key: "foo", value: "bar" }]));
  });

  it("should use requestIdleCallback when available", () => {
    spyOn(window, "setTimeout").and.callThrough();
    jest.useFakeTimers();

    // @ts-ignore
    window.requestIdleCallback = (cb) => cb();
    const { result } = renderHook(useFingerprint);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.error).toBeUndefined();
    expect(typeof result.current).toEqual("string");
    expect(result.current).toMatchSnapshot();
    expect(window.setTimeout).not.toHaveBeenCalledWith(expect.anything(), 500);
  });

  it("should fallback to setTimeout if requestIdleCallback is not available", () => {
    spyOn(window, "setTimeout").and.callThrough();
    jest.useFakeTimers();

    // @ts-ignore
    window.requestIdleCallback = undefined;
    const { result } = renderHook(useFingerprint);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.error).toBeUndefined();
    expect(typeof result.current).toEqual("string");
    expect(result.current).toMatchSnapshot();
    expect(window.setTimeout).toHaveBeenCalledWith(expect.anything(), 500);
  });
});
