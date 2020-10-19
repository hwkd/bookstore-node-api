export class ValidationError extends Error {
  constructor(public error: any) {
    super("Validation error");
    this.name = "ValidationError";
  }
}

export class DuplicateEntryError extends Error {
  constructor(public entity: string) {
    super(`Duplicate entry for ${entity}`);
    this.name = "DuplicateEntryError";
  }
}
