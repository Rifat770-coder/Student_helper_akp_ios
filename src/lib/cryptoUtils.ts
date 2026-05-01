// Password hashing utilities using Web Crypto API

// Hash password using SHA-256
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

// Verify password against hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Generate a random reset token
export const generateResetToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

// Hash reset token for storage
export const hashResetToken = async (token: string): Promise<string> => {
  return await hashPassword(token);
};
