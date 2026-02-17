import { Router, Request, Response } from 'express';
import { TodoListService } from '../../services/TodoListService';
import { TodoElementService } from '../../services/TodoElementService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/lists
 * Get all todo lists
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const includeElements = req.query.includeElements === 'true';
  const lists = await TodoListService.getAllLists(includeElements);
  res.json(lists);
}));

/**
 * POST /api/lists
 * Create a new todo list
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  
  if (!name) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      code: 'VALIDATION_ERROR',
      message: 'Name is required',
    });
    return;
  }
  
  try {
    const list = await TodoListService.createList(name);
    res.status(201).json(list);
  } catch (error) {
    if (error instanceof Error) {
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
 * GET /api/lists/:listId
 * Get a single todo list
 */
router.get('/:listId', asyncHandler(async (req: Request, res: Response) => {
  const listId = (Array.isArray(req.params.listId) ? req.params.listId[0] : req.params.listId) as string;
  const includeElements = req.query.includeElements === 'true';
  
  const list = await TodoListService.getListById(listId, includeElements);
  
  if (!list) {
    res.status(404).json({
      error: 'NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'List not found',
    });
    return;
  }
  
  res.json(list);
}));

/**
 * PUT /api/lists/:listId
 * Update a todo list
 */
router.put('/:listId', asyncHandler(async (req: Request, res: Response) => {
  const listId = (Array.isArray(req.params.listId) ? req.params.listId[0] : req.params.listId) as string;
  const { name, displayOrder } = req.body;
  
  if (name === undefined && displayOrder === undefined) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      code: 'VALIDATION_ERROR',
      message: 'At least one field (name or displayOrder) is required',
    });
    return;
  }
  
  try {
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (displayOrder !== undefined) updates.displayOrder = displayOrder;
    
    const list = await TodoListService.updateList(listId, updates);
    
    if (!list) {
      res.status(404).json({
        error: 'NOT_FOUND',
        code: 'NOT_FOUND',
        message: 'List not found',
      });
      return;
    }
    
    res.json(list);
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
 * DELETE /api/lists/:listId
 * Delete a todo list
 */
router.delete('/:listId', asyncHandler(async (req: Request, res: Response) => {
  const listId = (Array.isArray(req.params.listId) ? req.params.listId[0] : req.params.listId) as string;
  
  const deleted = await TodoListService.deleteList(listId);
  
  if (!deleted) {
    res.status(404).json({
      error: 'NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'List not found',
    });
    return;
  }
  
  res.status(204).send();
}));

/**
 * GET /api/lists/:listId/elements
 * Get all elements for a list
 */
router.get('/:listId/elements', asyncHandler(async (req: Request, res: Response) => {
  const listId = (Array.isArray(req.params.listId) ? req.params.listId[0] : req.params.listId) as string;
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
router.post('/:listId/elements', asyncHandler(async (req: Request, res: Response) => {
  const listId = (Array.isArray(req.params.listId) ? req.params.listId[0] : req.params.listId) as string;
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
 * PUT /api/lists/reorder
 * Reorder all todo lists
 */
router.put('/reorder', asyncHandler(async (req: Request, res: Response) => {
  const { listIds } = req.body;
  
  if (!listIds || !Array.isArray(listIds) || listIds.length === 0) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      code: 'VALIDATION_ERROR',
      message: 'listIds array is required',
    });
    return;
  }
  
  try {
    await TodoListService.reorderLists(listIds);
    res.json({ message: 'Lists reordered successfully' });
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
