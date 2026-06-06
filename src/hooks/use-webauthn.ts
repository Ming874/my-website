import { useState, useCallback, useEffect } from 'react';

export function useWebAuthn() {
  const [credentialId, setCredentialId] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('auth_credential_id');
      if (id) setCredentialId(id);
      
      if (!window.PublicKeyCredential) {
        setIsSupported(false);
      }
    }
  }, []);

  const registerDevice = useCallback(async () => {
    if (!isSupported) throw new Error("Biometrics not supported in this browser.");
    
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const userID = window.crypto.getRandomValues(new Uint8Array(16));
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: { name: "Secure Authenticator" },
      user: { id: userID, name: "user@local", displayName: "Local User" },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" }
      ],
      authenticatorSelection: { 
        authenticatorAttachment: "platform", 
        userVerification: "required" 
      },
      timeout: 60000
    };

    const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
    if (!credential) throw new Error("Credential creation failed.");

    const idBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
    localStorage.setItem('auth_credential_id', idBase64);
    setCredentialId(idBase64);
  }, [isSupported]);

  const verifyDevice = useCallback(async () => {
    if (!isSupported) throw new Error("Biometrics not supported in this browser.");
    if (!credentialId) throw new Error("Device not registered.");

    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const rawId = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0));
    
    const publicKey: PublicKeyCredentialRequestOptions = { 
      challenge, 
      allowCredentials: [{ id: rawId, type: 'public-key' }], 
      userVerification: "required", 
      timeout: 60000 
    };

    await navigator.credentials.get({ publicKey });
  }, [credentialId, isSupported]);

  const authenticate = useCallback(async () => {
    if (!credentialId) {
      await registerDevice();
    } else {
      await verifyDevice();
    }
  }, [credentialId, registerDevice, verifyDevice]);

  return {
    isSupported,
    hasCredential: !!credentialId,
    authenticate
  };
}
