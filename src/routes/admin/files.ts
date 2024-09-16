import express from 'express';
import Joi from 'joi';
import controllers from '../../controllers';
import requireAdmin from '../../middlewares/requireAdmin';
import { validateParams, validateQuery  } from '../../middlewares/validate';

const router = express.Router();

const getSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});

router.get('/:id', requireAdmin, validateParams(getSchema), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const file = await controllers.Files.get(req.params.id, req['user']);

    res.status(200).json({
      error: null,
      data: {
        file,
      }
    }).end();
  } catch (err) {
    next(err);
  }
});

const listSchema = Joi.object({
  ids: Joi.array().items(Joi.string().guid({ version: 'uuidv4' }).required()).required(),
});

router.get('/', requireAdmin, validateQuery(listSchema), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const files = await controllers.Files.list(req.query as { ids: ID[] }, req['user']);

    res.status(200).json({
      error: null,
      data: {
        files,
      }
    }).end();
  } catch (err) {
    next(err);
  }
});

const deleteSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});

router.delete('/:id', requireAdmin, validateParams(deleteSchema), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const file = await controllers.Files.delete(req.params.id, req['user']);

    res.status(200).json({
      error: null,
      data: {
        file,
      }
    }).end();
  } catch (err) {
    next(err);
  }
});

export default router;
