import { useDispatch, useSelector } from 'react-redux';
import { getMoviesDetails } from "../../actions/moviesAction";
import { useEffect } from "react";
import Movies from "./Movies";

export default function LoginPage({ props }) {
  const movies = useSelector(state => state.movieReducer.items);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMoviesDetails());

  }, [])

  return (
    <div>
      <Movies movies={movies.Search}
        totalCount={parseInt(movies.totalResults)}
      />
    </div>
  )
}