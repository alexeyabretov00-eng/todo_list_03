import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { ValidationErrorResponse } from '../../types/api';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({ field: rule.field, message: `${rule.field} is required` });
        continue;
      }

      // Skip further validation if field is not required and not provided
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type check
      if (rule.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rule.type) {
          errors.push({ field: rule.field, message: `${rule.field} must be of type ${rule.type}` });
          continue;
        }
      }

      // String validations
      if (typeof value === 'string') {
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.minLength} characters` });
        }
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
          errors.push({ field: rule.field, message: `${rule.field} must not exceed ${rule.maxLength} characters` });
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({ field: rule.field, message: `${rule.field} has invalid format` });
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.min}` });
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push({ field: rule.field, message: `${rule.field} must not exceed ${rule.max}` });
        }
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors.push({ field: rule.field, message: typeof result === 'string' ? result : `${rule.field} is invalid` });
        }
      }
    }

    if (errors.length > 0) {
      const response: ValidationErrorResponse = {
        error: 'ValidationError',
        message: 'Request validation failed',
        statusCode: 400,
        errors,
      };
      res.status(400).json(response);
      return;
    }

    next();
  };
};
