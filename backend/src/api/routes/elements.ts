import { Router, Request, Response } from 'express';
import { TodoElementService } from '../../services/TodoElementService';
import { SubItemService } from '../../services/SubItemService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/elements/:elementId
 * Get a single element with optional sub-items and progress counts
 */
router.get('/:elementId', asyncHandler(async (req: Request, res: Response) => {
  const elementId = (Array.isArray(req.params.elementId) ? req.params.elementId[0] : req.params.elementId) as string;
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
  
  // Compute progress information
  const subItemCount = await SubItemService.getSubItemCount(elementId);
  const completedSubItemCount = await SubItemService.getCompletedSubItemCount(elementId);
  
  const responseElement = {
    ...element,
    subItemCount,
    completedSubItemCount,
  };
  
  res.json(responseElement);
}));

/**
 * PUT /api/elements/:elementId
 * Update an element
 */
router.put('/:elementId', asyncHandler(async (req: Request, res: Response) => {
  const elementId = (Array.isArray(req.params.elementId) ? req.params.elementId[0] : req.params.elementId) as string;
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
  const elementId = (Array.isArray(req.params.elementId) ? req.params.elementId[0] : req.params.elementId) as string;
  
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
  const elementId = (Array.isArray(req.params.elementId) ? req.params.elementId[0] : req.params.elementId) as string;
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

/**
 * GET /api/elements/:elementId/subitems
 * Get all sub-items for an element
 */
router.get('/:elementId/subitems', asyncHandler(async (req: Request, res: Response) => {
  const elementId = (Array.isArray(req.params.elementId) ? req.params.elementId[0] : req.params.elementId) as string;

  try {
    const subItems = await SubItemService.getSubItemsByElementId(elementId);
    res.json(subItems);
  } catch (error) {
    if (error instanceof Error && error.message === 'Element not found') {
      res.status(404).json({
        error: 'NOT_FOUND',
        code: 'NOT_FOUND',
        message: 'Element not found',
      });
      return;
    }
    throw error;
  }
}));

/**
 * POST /api/elements/:elementId/subitems
 * Create a new sub-item
 */
router.post('/:elementId/subitems', asyncHandler(async (req: Request, res: Response) => {
  const elementId = (Array.isArray(req.params.elementId) ? req.params.elementId[0] : req.params.elementId) as string;
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
    const subItem = await SubItemService.createSubItem(elementId, text);
    res.status(201).json(subItem);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Element not found') {
        res.status(404).json({
          error: 'NOT_FOUND',
          code: 'NOT_FOUND',
          message: 'Element not found',
        });
      } else {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          code: 'VALIDATION_ERROR',
          message: error.message,
        });
      }
      return;
    }
    throw error;
  }
}));

export default router;
