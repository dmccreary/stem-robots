# Private Network Access

If you are using the Pico W or other wireless controllers you may have diffuculty accessing your web servers due to new security features added to Chrome.  This is called the blocking of "Private Networks".

## Symptom

You can access a host via IP address using `curl`, however you can't access that asme address with your browser.

Example:

```http://10.0.0.13``` will return the error: 


## Solution

## Sample Shell Script

This shell script will startup Chrome, but it will disable the feature that blocks access to your Pico W web server.

```sh
#!/bin/bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessChecks,IsolateOrigins,site-per-process,NetworkServiceInProcess,UseDNSHttpsSvcb \
--disable-network-service \
--user-data-dir=/tmp/test-profile
```

## References

[W3C Private Network Access](https://wicg.github.io/private-network-access/)