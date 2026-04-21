import { Router } from 'express';
import { body, query } from 'express-validator';
import { addSchool, listSchools } from '../controllers/schoolController';

const router = Router();

router.post(
  '/addSchool',
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Length cannot exceed 255'),
    body('address').notEmpty().withMessage('Address is required').isLength({ max: 500 }).withMessage('Length cannot exceed 500'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  ],
  addSchool
);

router.get(
  '/listSchools',
  [
    query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  ],
  listSchools
);

export default router;
