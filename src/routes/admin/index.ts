import express from 'express';
import files from './files';

const router = express.Router();

router.use('/file', files);

export default router;
