import "./App.css";
import { useContext, useEffect, useState } from "react";
import Card from "./components/Card";
import CreatePlaylist from "./components/CreatePlaylist";
import { initializePlaylist } from "./initialize";
import Navbar from "./components/Navbar";
import { MusicContext } from "./Context";

function App() {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState(null);

  const musicContext = useContext(MusicContext);
  const isLoading = musicContext.isLoading;
  const setIsLoading = musicContext.setIsLoading;
  const setLikedMusic = musicContext.setLikedMusic;
  const setpinnedMusic = musicContext.setPinnedMusic;
  const resultOffset = musicContext.resultOffset;
  const setResultOffset = musicContext.setResultOffset;

  const fetchMusicData = async () => {
    setTracks([]);
    window.scrollTo(0, 0);
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${keyword}&type=track&offset=${resultOffset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch music data");
      }

      const jsonData = await response.json();

      setTracks(jsonData.tracks.items);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setResultOffset(0);
      fetchMusicData();
    }
  };

  useEffect(() => {
    initializePlaylist();

    // current client credentials will be deleted in few days
    const fetchToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=a77073181b7d48eb90003e3bb94ff88a&client_secret=68790982a0554d1a83427e061e371507",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const jsonData = await response.json();
        setToken(jsonData.access_token);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToken();
    setLikedMusic(JSON.parse(localStorage.getItem("likedMusic")));
    setpinnedMusic(JSON.parse(localStorage.getItem("pinnedMusic")));
  }, [setIsLoading, setLikedMusic, setpinnedMusic]);

  return (
    <>
      <Navbar
        keyword={keyword}
        setKeyword={setKeyword}
        handleKeyPress={handleKeyPress}
        fetchMusicData={fetchMusicData}
      />

      <div className="container">
        <div className={`row ${isLoading ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <div className="row">
          {tracks.map((element) => {
            return <Card key={element.id} element={element} />;
          })}
        </div>
        <div className="row" hidden={tracks.length === 0}>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous - 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
              disabled={resultOffset === 0}
            >
              Previous Next Page: {resultOffset / 20}
            </button>
          </div>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous + 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
            >
              Next Page: {resultOffset / 20 + 2}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h4 className="text-center text-danger py-2">{message}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12 py-5 text-center">
            <h1>
              <i className="bi bi-music-note-list mx-3"></i>
              Life of Rhythms
            </h1>
            <h3 className="py-5 text-center">
  🎶 <strong>Welcome to Life of Rhythms</strong> 🎶  
  <br />
  <em>"Where words fail, music speaks." – Hans Christian Andersen</em>
  <br /><br />

  <strong>Feel the beat, live the rhythm!</strong>  
  <br />
  🚀 Discover trending tracks & hidden gems  
  <br />
  🎧 Immerse yourself in music that moves you  
  <br />
  🎼 Let your soul dance to the melody of life  
  <br /><br />

  🔥 <strong>Explore the Magic of Music</strong> 🔥  
  <br />
  🎵 <strong>Discover Unlimited Music</strong> – Search & play 30-second previews of your favorite songs  
  <br />
  🎤 <strong>Artist Spotlight</strong> – Featuring a new trending artist every day!  
  <br />
  📌 <strong>Personalized Playlists</strong> – Create, Like, and Pin your favorite tracks  
  <br />
  🚀 <strong>Trending Now</strong> – Stay ahead with the top 5 global hits updated in real-time  
  <br /><br />

  💬 <strong>Quote of the Day</strong>  
  <br />
  <em>"Without music, life would be a mistake." – Friedrich Nietzsche</em>  
  <br /><br />

  🎧 <strong>Ready to dive into the rhythm?</strong>  
  <br />
  🔗 <strong>Start Listening Now</strong>  
</h3>

          
          </div>
        </div>
      </div>
      <div
        className="modal fade position-absolute"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <CreatePlaylist />
      </div>
    </>
  );
}

export default App;
