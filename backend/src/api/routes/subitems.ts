import { Router, Request, Response } from 'express';
import { SubItemService } from '../../services/SubItemService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/subitems/:subItemId
 * Get a single sub-item
 */
router.get('/:subItemId', asyncHandler(async (req: Request, res: Response) => {
  const subItemId = req.params.subItemId as string;

  const subItem = await SubItemService.getSubItem(subItemId);

  if (!subItem) {
    res.status(404).json({
      error: 'NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'Sub-item not found',
    });
    return;
  }

  res.json(subItem);
}));

/**
 * PUT /api/subitems/:subItemId
 * Update a sub-item
 */
router.put('/:subItemId', asyncHandler(async (req: Request, res: Response) => {
  const subItemId = req.params.subItemId as string;
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

    const subItem = await SubItemService.updateSubItem(subItemId, updates);

    if (!subItem) {
      res.status(404).json({
        error: 'NOT_FOUND',
        code: 'NOT_FOUND',
        message: 'Sub-item not found',
      });
      return;
    }

    res.json(subItem);
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
 * DELETE /api/subitems/:subItemId
 * Delete a sub-item
 */
router.delete('/:subItemId', asyncHandler(async (req: Request, res: Response) => {
  const subItemId = req.params.subItemId as string;

  const deleted = await SubItemService.deleteSubItem(subItemId);

  if (!deleted) {
    res.status(404).json({
      error: 'NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'Sub-item not found',
    });
    return;
  }

  res.status(204).send();
}));

/**
 * PUT /api/subitems/:subItemId/complete
 * Toggle sub-item completion
 */
router.put('/:subItemId/complete', asyncHandler(async (req: Request, res: Response) => {
  const subItemId = req.params.subItemId as string;
  const { isCompleted } = req.body;

  if (isCompleted === undefined) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      code: 'VALIDATION_ERROR',
      message: 'isCompleted field is required',
    });
    return;
  }

  try {
    const subItem = await SubItemService.toggleSubItemComplete(subItemId, isCompleted);

    if (!subItem) {
      res.status(404).json({
        error: 'NOT_FOUND',
        code: 'NOT_FOUND',
        message: 'Sub-item not found',
      });
      return;
    }

    res.json(subItem);
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

export default router;
