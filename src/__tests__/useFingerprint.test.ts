import Fingerprint2 from "fingerprintjs2";
import useFingerprint from "../useFingerprint";
import { request } from "http";
import { renderHook, act } from "@testing-library/react-hooks";

describe("useFingerprint hook", () => {
  beforeEach(() => {
    spyOn(window, "setTimeout").and.callThrough();
    jest.useFakeTimers();
    Fingerprint2.get = jest.fn().mockImplementation(function () {
      if (arguments.length === 2) {
        arguments[1]([{ key: "foo", value: "bar" }]);
        return;
      }
      arguments[0]([{ key: "foo", value: "bar" }]);
    });
  });

  it("should use requestIdleCallback when available", () => {
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

  it("should allow to pass options", () => {
    const spiedFingerprint = spyOn(Fingerprint2, "get").and.callThrough();
    // @ts-ignore
    window.requestIdleCallback = (cb) => cb();
    const { result } = renderHook<Fingerprint2.Options, string>(
      useFingerprint,
      {
        initialProps: {
          audio: {
            excludeIOS11: false,
            timeout: 1000,
          },
        },
      }
    );
    expect(result.error).toBeUndefined();
    expect(typeof result.current).toEqual("string");
    expect(spiedFingerprint.calls.allArgs()[0][0]).toEqual({
      audio: { excludeIOS11: false, timeout: 1000 },
    });
    expect(result.current).toMatchSnapshot();
  });
});
