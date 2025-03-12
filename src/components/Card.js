import React, { useContext } from "react";
import { MusicContext } from "../Context";
import AudioPlayer from "./AudioPlayer";

function Card({ element }) {
  const musicContext = useContext(MusicContext);
  const setLikedMusic = musicContext.setLikedMusic;
  const setPinnedMusic = musicContext.setPinnedMusic;

  const handlePin = () => {
    let pinnedMusic = JSON.parse(localStorage.getItem("pinnedMusic")) || [];
    let updatedPinnedMusic = pinnedMusic.some((item) => item.id === element.id)
      ? pinnedMusic.filter((item) => item.id !== element.id)
      : pinnedMusic.length < 4
      ? [...pinnedMusic, element]
      : pinnedMusic;

    setPinnedMusic(updatedPinnedMusic);
    localStorage.setItem("pinnedMusic", JSON.stringify(updatedPinnedMusic));
  };

  const handleLike = () => {
    let likedMusic = JSON.parse(localStorage.getItem("likedMusic")) || [];
    let updatedLikedMusic = likedMusic.some((item) => item.id === element.id)
      ? likedMusic.filter((item) => item.id !== element.id)
      : [...likedMusic, element];

    setLikedMusic(updatedLikedMusic);
    localStorage.setItem("likedMusic", JSON.stringify(updatedLikedMusic));
  };

  return (
    <div key={element.id} className="col-lg-3 col-md-6 py-2">
      <div className="card">
        <div className="ratio ratio-1x1 bg-secondary bg-opacity-25">
          <img
            src={element?.album?.images?.[0]?.url || "fallback.jpg"}
            className="card-img-top"
            alt="Album Cover"
          />
        </div>
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between">
            {element.name}
            <div className="add-options d-flex align-items-start">
              <button onClick={handlePin} className="btn btn-outline-dark mx-1">
                <i className="bi bi-pin-angle"></i>
              </button>
              <button onClick={handleLike} className="btn btn-outline-dark">
                <i className="bi bi-heart"></i>
              </button>
            </div>
          </h5>
          <p className="card-text">Artist: {element?.album?.artists?.[0]?.name || "Unknown"}</p>
          <p className="card-text">Release date: {element?.album?.release_date || "N/A"}</p>

          {/* Debug: Ensure preview URL exists */}
          {console.log("Preview URL:", element?.preview_url)}

          {/* Audio Player */}
          {element?.preview_url ? (
            <AudioPlayer audioSrc={element.preview_url} />
          ) : (
            <p>No Preview Available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
