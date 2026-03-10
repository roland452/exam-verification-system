import { Fido2Lib } from "fido2-lib";

export const f2l = new Fido2Lib({
    timeout: 60000,
    rpId: "localhost",
    rpName: "KASU Exam Portal",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "required",
        userVerification: "required"
    }
});

// SAFE CONVERSION: Prevents the "received undefined" error
export const base64urlToBuffer = (base64url) => {
    if (!base64url || typeof base64url !== 'string') {
        console.error("Critical Error: base64urlToBuffer received:", base64url);
        throw new Error("Invalid biometric data received from browser");
    }
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    return Buffer.from(padded, 'base64');
};

export default f2l;
