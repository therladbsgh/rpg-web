import { Router } from 'express';

const router = new Router();

// Get all Posts
router.route('/posts').get(() => { console.log('Hi') });

export default router;
