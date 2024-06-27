import express from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.use(cookieParser());

// Middleware to set a unique ID for each visitor
router.use((req, res, next) => {
  // If the visitor doesn't have a tracking cookie, set one
  if (!req.cookies.trackingId) {
    res.cookie('trackingId', uuidv4(), { maxAge: 900000, httpOnly: true });
  }

  next();
});

// Middleware to log each page visit
router.use((req, res, next) => {
  console.log(`Visitor ${req.cookies.trackingId} visited ${req.originalUrl}`);
  next();
});

export default router;
