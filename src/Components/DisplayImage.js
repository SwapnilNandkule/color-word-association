import React from "react";
import styles from "../styles/Home.module.css";
import ListItem from "./ListItem";

function DisplayImage({ uploadedImage, colorPalette,loading }) {
  const toHex = (rgb) => {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }

    return hex;
  };

  if(loading){
    return (<h1>Loading...</h1>)
  }

  return (
    <div className={styles.content}>
      <div className="image">
        {uploadedImage ? (
          <img src={uploadedImage} alt="uploaded" style={{ maxWidth: '40vw', height: '40vh' }} />
        ) : (
          <h2>Type an word here...</h2>
        )}
      </div>

      {colorPalette && (
        <ul className={styles.colors}>
          {colorPalette.map((color, index) => {
            const rgb = `rgb(${color.join(",")})`;
            const hex = `#${toHex(color[0])}${toHex(color[1])}${toHex(
              color[2]
            )}`;

            return <ListItem key={index} rgb={rgb} hex={hex} />;
          })}
        </ul>
      )}
    </div>
  );
}

export default DisplayImage;