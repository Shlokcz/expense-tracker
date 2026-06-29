import { Router } from 'express';

import * as expenseController from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/summary', expenseController.summary);
router.get('/', validate(expenseController.expenseQuerySchema, 'query'), expenseController.list);
router.post('/', validate(expenseController.createExpenseSchema), expenseController.create);
router.get('/:id', expenseController.getOne);
router.put('/:id', validate(expenseController.updateExpenseSchema), expenseController.update);
router.delete('/:id', expenseController.remove);

export default router;
