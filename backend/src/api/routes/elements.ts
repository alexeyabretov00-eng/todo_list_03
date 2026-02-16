import { Router, Request, Response } from 'express';
import { TodoElementService } from '../../services/TodoElementService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/lists/:listId/elements
 * Get all elements for a list
 */
router.get('/lists/:listId/elements', asyncHandler(async (req: Request, res: Response) => {
  const { listId } = req.params;
  const includeSubItems = req.query.includeSubItems === 'true';
  
  try {
    const elements = await TodoElementService.getElementsByListId(listId, includeSubItems);
    res.json(elements);
  } catch (error) {
    if (error instanceof Error && error.message === 'List not found') {
      res.status(404).json({
        error: 'NOT_FOUND',
        code: 'NOT_FOUND',
        message: error.message,
      });
      return;
    }
    throw error;
  }
}));

/**
 * POST /api/lists/:listId/elements
 * Create a new element in a list
 */
router.post('/lists/:listId/elements', asyncHandler(async (req: Request, res: Response) => {
  const { listId } = req.params;
  const { text } = req.body;
  
  if (!text) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      code: 'VALIDATION_ERROR',
      message: 'Text is required',
    });
    return;
  }
  
  try {
    const element = await TodoElementService.createElement(listId, text);
    res.status(201).json(element);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'List not found') {
        res.status(404).json({
          error: 'NOT_FOUND',
          code: 'NOT_FOUND',
          message: error.message,
        });
        return;
      }
      if (error.message.includes('Maximum')) {
        res.status(400).json({
          error: 'LIMIT_EXCEEDED',
          code: 'LIMIT_EXCEEDED',
          message: error.message,
        });
        return;
      }
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        code: 'VALIDATION_ERROR',
        message: error.message,
      });
      return;
    }
    throw error;
  }
}));

/**
 * GET /api/elements/:elementId
 * Get a single element
 */
router.get('/:elementId', asyncHandler(async (req: Request, res: Response) => {
  const { elementId } = req.params;
  const includeSubItems = req.query.includeSubItems === 'true';
  
  const element = await TodoElementService.getElementById(elementId, includeSubItems);
  
  if (!element) {
    res.status(404).json({
      error: 'NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'Element not found',
    });
    return;
  }
  
  res.json(element);
}));

/**
 * PUT /api/elements/:elementId
 * Update an element
 */
router.put('/:elementId', asyncHandler(async (req: Request, res: Response) => {
  const { elementId } = req.params;
  const { text, isCompleted, displayOrder } = req.body;
  
  if (text === undefined && isCompleted === undefined && displayOrder === undefined) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      code: 'VALIDATION_ERROR',
      message: 'At least one field (text, isCompleted, or displayOrder) is required',
    });
    return;
  }
  
  try {
    const updates: any = {};
    if (text !== undefined) updates.text = text;
    if (isCompleted !== undefined) updates.isCompleted = isCompleted;
    if (displayOrder !== undefined) updates.displayOrder = displayOrder;
    
    const element = await TodoElementService.updateElement(elementId, updates);
    
    if (!element) {
      res.status(404).json({
        error: 'NOT_FOUND',
        code: 'NOT_FOUND',
        message: 'Element not found',
      });
      return;
    }
    
    res.json(element);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        code: 'VALIDATION_ERROR',
        message: error.message,
      });
      return;
    }
    throw error;
  }
}));

/**
 * DELETE /api/elements/:elementId
 * Delete an element
 */
router.delete('/:elementId', asyncHandler(async (req: Request, res: Response) => {
  const { elementId } = req.params;
  
  const deleted = await TodoElementService.deleteElement(elementId);
  
  if (!deleted) {
    res.status(404).json({
      error: 'NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'Element not found',
    });
    return;
  }
  
  res.status(204).send();
}));

/**
 * PUT /api/elements/:elementId/complete
 * Toggle element completion
 */
router.put('/:elementId/complete', asyncHandler(async (req: Request, res: Response) => {
  const { elementId } = req.params;
  const { isCompleted } = req.body;
  
  if (typeof isCompleted !== 'boolean') {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      code: 'VALIDATION_ERROR',
      message: 'isCompleted must be a boolean',
    });
    return;
  }
  
  const element = await TodoElementService.toggleElementComplete(elementId, isCompleted);
  
  if (!element) {
    res.status(404).json({
      error: 'NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'Element not found',
    });
    return;
  }
  
  res.json(element);
}));

export default router;
