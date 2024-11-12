import axios from 'axios';
import { TMDB_BEARER_TOKEN } from '../config';

const TMDBClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
});

export default TMDBClient;
