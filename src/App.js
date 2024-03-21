import {useState} from 'react';
import './App.css';
import axios from 'axios';
import DisplayImage from "./Components/DisplayImage";
import ColorThief from "colorthief";

function App() {
  const [inputWord, setInputWord] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [colorPalette, setColorPalette] = useState(null);
  const [loading,setLoading]= useState(false);

  const handleReset = ()=>{
    setInputWord('');
    setUploadedImage('');
    setColorPalette(null);
  }

  const handleInputChange = (event) => {
    setInputWord(event.target.value);
  };

  const handleSubmit =async (event) => {
    event.preventDefault();
    if (inputWord) {
      await fetchImages(inputWord);
    }
  };

  const fetchImages = async (word) => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          q: word,
          cx: '10a9f8f6488d74fa0',
          key: 'AIzaSyB-Pprec0WO_W-Q1JFop2sAgCQ8CoI0vg4',
          searchType: 'image',
          num: 10
        }
      });
      
      const imageUrls = response.data.items.map(item => item.link);
      for (let i = 0; i < imageUrls.length; i++) {
        const imgUrl = imageUrls[i];
        try {
          await loadImageAndExtractColors(imgUrl);
          setUploadedImage(imgUrl);
          setLoading(false);
          break;
        } catch (error) {
          console.error(`Error loading image at ${imgUrl}:`, error);
          if (i === imageUrls.length - 1) {
            console.error('All images failed to load.');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setLoading(false);
  };
  
  const loadImageAndExtractColors = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgUrl;
  
      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const colorPalette = colorThief.getPalette(img, 6);
          setColorPalette(colorPalette);
          resolve(colorPalette);
        } catch (e) {
          reject(e);
        }
      };
  
      img.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          className='input-field'
          type="text"
          value={inputWord}
          onChange={handleInputChange}
          placeholder="Enter a word..."
        />
        <button type="submit" className='submit-button'>Submit</button>
        <button type="button" className='submit-button' style={{backgroundColor:'red',marginLeft:'10px'}} onClick={handleReset} >Reset</button>
      </form>
      
      <DisplayImage
          uploadedImage={uploadedImage}
          colorPalette={colorPalette}
          loading={loading}
        />
    </div>
  );
}

export default App;
