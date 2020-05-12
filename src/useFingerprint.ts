import React from "react";
import Fingerprint2 from "fingerprintjs2";

export default function () {
  const [fingerprint, setFingerprint] = React.useState<string>(null);

  React.useEffect(() => {
    if (typeof window !== "object") return; // Run on the server side - ignore

    const setFingerprintFromComponents = () => {
      Fingerprint2.get((components) => {
        const fingerprint = Fingerprint2.x64hash128(
          components.map((c) => c.value).join(""),
          31
        );
        setFingerprint(fingerprint);
      });
    };

    // @ts-ignore
    if (window.requestIdleCallback) {
      // @ts-ignore
      window.requestIdleCallback(setFingerprintFromComponents);
    } else {
      setTimeout(setFingerprintFromComponents, 500);
    }
  }, []);

  return fingerprint;
}
