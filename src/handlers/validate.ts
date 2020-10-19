import { ValidationError } from "../types"

interface ValidationSchema {
  validate: (obj: any) => Promise<any>;
}

export default async (schema: ValidationSchema, obj: any) => {
  try {
    await schema.validate(obj);
  } catch (e) {
    throw new ValidationError(e.errors);
  }
};
