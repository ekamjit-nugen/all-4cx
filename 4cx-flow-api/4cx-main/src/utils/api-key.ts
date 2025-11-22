import crypto from "crypto"

export const generateAPIKeyByEncryption = (userId: string, organizationId: string, projectId: string): string => {
  const rawKey = `${userId}-${organizationId}-${projectId}-${Date.now()}`;
  return crypto.createHash("sha256").update(rawKey).digest("hex");
};