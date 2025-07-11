
export const SENSITIVE_FIELDS = [
  'password',
  'refreshToken',
  'lastLoginIp',
  'resetPasswordToken',
  'emailVerificationToken',
  'twoFactorSecret',
  'apiKey',
  'internalNotes'
];

export function getSafeAttributes(additionalExcludes: string[] = []): { exclude: string[] } {
  return {
    exclude: [...SENSITIVE_FIELDS, ...additionalExcludes]
  };
}


export function sanitizeUserData(userData: any): any {
  if (!userData) return userData;
  
  const sanitized = { ...userData };
  
  SENSITIVE_FIELDS.forEach(field => {
    delete sanitized[field];
  });
  
  return sanitized;
}

export function isSensitiveField(fieldName: string): boolean {
  return SENSITIVE_FIELDS.includes(fieldName);
}

export function safeUserReturn(user: any): any {
  if (!user) return user;
  
  const userData = user.toJSON ? user.toJSON() : user;
  
  return sanitizeUserData(userData);
}
