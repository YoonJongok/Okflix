import { AnimatePresence, motion } from "framer-motion";
import { off } from "process";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, getTvs, IGetMoviesResult, IGetTvResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled(motion.div)`
  width: 100%;
  height: 200vh;
`;

const Banner = styled(motion.div)<{ photo: string }>`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
  padding: 60px;
`;

const InfoContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: ${(props) => props.theme.white.lighter};
  padding-bottom: 120px;
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 15px;
  }
  p {
    width: 40%;
    font-size: 1.2rem;
    font-weight: 400;
  }
`;

const Slider = styled(motion.div)`
  position: relative;
  top: -230px;
  h2 {
    color: ${(props) => props.theme.white.lighter};
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
`;

const Row = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
`;

const SlideItem = styled(motion.div)<{ photo: string }>`
  height: 230px;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
`;

const sliderVariants = {
  toLeft: {
    x: window.outerWidth + 10,
  },
  center: { x: 0 },
  toRight: {
    x: -window.outerWidth - 10,
  },
};

const offset = 6;

function Home() {
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResult>(
    ["tvs"],
    getTvs
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const onIncreaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeavning();
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeavning = () => setLeaving((prev) => !prev);

  const loading = movieLoading || tvLoading;

  return (
    <Wrapper>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {movieData && tvData && (
            <>
              <Banner
                onClick={onIncreaseIndex}
                photo={makeImagePath(movieData.results[0].backdrop_path)}
              >
                <InfoContainer>
                  <h1>{movieData.results[0].title}</h1>
                  <p>{movieData.results[0].overview}</p>
                </InfoContainer>
                <Slider>
                  <h2>Now Playing</h2>
                  <AnimatePresence
                    initial={false}
                    onExitComplete={toggleLeavning}
                  >
                    <Row
                      key={index}
                      variants={sliderVariants}
                      initial={"toLeft"}
                      animate={"center"}
                      exit={"toRight"}
                      transition={{ type: "tween", duration: 1 }}
                    >
                      {movieData.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((movie) => (
                          <SlideItem
                            key={movie.id}
                            photo={makeImagePath(movie.backdrop_path, "w500")}
                          >
                            <h1>{movie.title}</h1>
                          </SlideItem>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
              </Banner>
            </>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
