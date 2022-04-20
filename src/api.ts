const movieApi = "f2d97896a7b8f93a3b0c012fd1cfdefc";
const baseUrl = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface ITv {
  backdrop_path: string;
  first_air_date: "2022-03-30";
  id: number;
  name: "Moon Knight";
  overview: "When Steven Grant, a mild-mannered gift-shop employee, becomes plagued with blackouts and memories of another life, he discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As Steven/Marc’s enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt.";
  poster_path: "/x6FsYvt33846IQnDSFxla9j0RX8.jpg";
  vote_average: 8.6;
}
export interface IGetTvResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${baseUrl}/movie/now_playing?api_key=${movieApi}`).then((res) =>
    res.json()
  );
}

export function getTvs() {
  return fetch(`${baseUrl}/tv/popular?api_key=${movieApi}`).then((res) =>
    res.json()
  );
}
