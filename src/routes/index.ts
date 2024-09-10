import express from 'express';
import upload from './upload';
import files from './files';
import admin from './admin';

const router = express.Router();

router.use('/file', upload);
router.use('/file', files);
router.use('/admin', admin);

export default router;
