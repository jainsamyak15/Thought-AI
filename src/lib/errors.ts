export class ConfigurationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ConfigurationError';
    }
  }
  
  export class APIError extends Error {
    public originalError?: Error;
  
    constructor(message: string, originalError?: Error) {
      super(message);
      this.name = 'APIError';
      this.originalError = originalError;
    }
  }