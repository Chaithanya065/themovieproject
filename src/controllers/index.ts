import { Router } from 'express';
import { fetchMoviesByYear } from './movies.controller';

const router = Router();

router.get('/movies', fetchMoviesByYear);

export default router;
