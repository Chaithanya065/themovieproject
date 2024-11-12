import server from '../app';
import supertest from 'supertest';
const requestWithSupertest = supertest(server);

import TMDBClient from '../clients/tmdb';
jest.mock('../clients/tmdb');

const mockedTMDBClient = TMDBClient as jest.Mocked<typeof TMDBClient>;

describe('GET /api/movies', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fail with 400 status for invalid year', async () => {
    const res = await requestWithSupertest.get('/api/movies?year=invalid');
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual('Invalid year provided');
  });

  it('should return 200 with movies data when request is successful', async () => {
    mockedTMDBClient.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            title: 'Movie 1',
            vote_average: 7.5,
            release_date: '2020-01-01',
          },
          {
            id: 2,
            title: 'Movie 2',
            vote_average: 8.0,
            release_date: '2020-02-02',
          },
        ],
        page: 1,
        total_pages: 10,
        total_results: 100,
      },
    });

    mockedTMDBClient.get
      .mockResolvedValueOnce({
        data: {
          crew: [
            { known_for_department: 'Editing', name: 'Editor 1' },
            { known_for_department: 'Editing', name: 'Editor 2' },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          crew: [{ known_for_department: 'Editing', name: 'Editor 3' }],
        },
      });

    const res = await requestWithSupertest.get('/api/movies?year=2020');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      page: 1,
      movies: [
        {
          title: 'Movie 1',
          vote_average: 7.5,
          release_date: 'January 1, 2020',
          editors: ['Editor 1', 'Editor 2'],
        },
        {
          title: 'Movie 2',
          vote_average: 8.0,
          release_date: 'February 2, 2020',
          editors: ['Editor 3'],
        },
      ],
      total_pages: 10,
      total_results: 100,
    });
  });

  it('should handle partial failures when fetching credits', async () => {
    mockedTMDBClient.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            title: 'Movie 1',
            vote_average: 7.5,
            release_date: '2020-01-01',
          },
          {
            id: 2,
            title: 'Movie 2',
            vote_average: 8.0,
            release_date: '2020-02-02',
          },
        ],
        page: 1,
        total_pages: 10,
        total_results: 100,
      },
    });

    mockedTMDBClient.get
      .mockResolvedValueOnce({
        data: {
          crew: [{ known_for_department: 'Editing', name: 'Editor 1' }],
        },
      })
      .mockRejectedValueOnce(new Error('Failed to fetch credits'));

    const res = await requestWithSupertest.get('/api/movies?year=2020');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      page: 1,
      movies: [
        {
          title: 'Movie 1',
          vote_average: 7.5,
          release_date: 'January 1, 2020',
          editors: ['Editor 1'],
        },
        {
          title: 'Movie 2',
          vote_average: 8.0,
          release_date: 'February 2, 2020',
          editors: [],
        },
      ],
      total_pages: 10,
      total_results: 100,
    });
  });

  it('should return 500 if there is an error fetching movies', async () => {
    mockedTMDBClient.get.mockRejectedValueOnce(
      new Error('Failed to fetch movies')
    );
    const res = await requestWithSupertest.get('/api/movies?year=2020');

    expect(res.status).toEqual(500);
    expect(res.body).toEqual({
      error: 'An error occurred while fetching movies',
    });
  });
});
