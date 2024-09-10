import express from 'express';
import controllers from '../controllers';
import requireAuth from '../middlewares/requireAuth';

const router = express.Router();

router.get('/:id', /* requireAuth, */ async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const file = await controllers.Files.getFile(req.params.id, req['user']);

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

router.get('/', requireAuth, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const files = await controllers.Files.listFiles(req.query, req['user']);

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

router.delete('/:id', requireAuth, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const file = await controllers.Files.deleteFile(req.params.id, req['user']);

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
