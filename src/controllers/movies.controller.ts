import { Request, Response } from 'express';
import TMDBClient from '../clients/tmdb';
import { TMDBMovieResult } from '../interfaces/movie.interface';
import { formatDate } from '../helper';

export const fetchMoviesByYear = async (
  request: Request,
  response: Response
) => {
  try {
    const year = request.query.year as string;
    const page = (request.query.page as string) || '1';

    if (isNaN(+year)) {
      // If year is not valid, give 400 error
      response.status(400).json({ error: 'Invalid year provided' });
      return;
    }

    // Fetch movies for the specified year
    const tmdbResults = await TMDBClient.get(
      `/discover/movie?language=en-US&page=${page}&primary_release_year=${year}&sort_by=popularity.desc`
    );

    const movieResults = tmdbResults.data?.results || [];

    // Fetch credits in parallel
    const creditsRequests = movieResults.map((movie: TMDBMovieResult) =>
      TMDBClient.get(`/movie/${movie.id}/credits?language=en-US`)
    );

    const creditsResponses = await Promise.allSettled(creditsRequests);

    // Map credits to movies by movie ID
    const editorsByMovieId = new Map();
    creditsResponses.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const crew = result.value.data?.crew || [];
        const editors = crew
          .filter((member: any) => member.known_for_department === 'Editing')
          .map((editor: any) => editor.name);
        editorsByMovieId.set(movieResults[index].id, editors);
      }
    });

    // Format the movie data
    const movies = movieResults.map((movie: TMDBMovieResult) => ({
      title: movie.title,
      vote_average: movie.vote_average,
      release_date: formatDate(movie.release_date),
      editors: editorsByMovieId.get(movie.id) || [],
    }));

    response.status(200).json({
      page: tmdbResults.data.page,
      movies,
      total_pages: tmdbResults.data.total_pages,
      total_results: tmdbResults.data.total_results,
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    response
      .status(500)
      .json({ error: 'An error occurred while fetching movies' });
  }
};
