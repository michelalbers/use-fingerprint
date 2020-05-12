# useFingerprint

This is a convinient wrapper around https://github.com/Valve/fingerprintjs2 to use in react apps.

## usage

```JavaScript
  import useFingerprint from 'use-fingerprint';

  /* [..] */

  const myComponent = () => {
    const fingerprint = useFingerprint();

    return (
      <div>
        Your fingerprint is {fingerprint}
      </div>
    );
  }
```

## caveats

Note that getting the fingerprint happens asynchronously and the value will not be populated right away. See https://github.com/Valve/fingerprintjs2/issues/254 and https://github.com/Valve/fingerprintjs2/issues/307 for explanation on why that is.
