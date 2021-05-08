import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="card">
        <div className="header">
          <img
            src={process.env.PUBLIC_URL + "/nature.jpg"}
            className="image_"
          />
          <div className="img_label">NATURE</div>
        </div>
        <div className="footer">
          <div className="title">Mountains</div>
          <div className="profile">
            <img
              src={process.env.PUBLIC_URL + "/profile_img.jpg"}
              className="profile_img"
            />
            <div>
              By <span>Jhon</span>
            </div>
          </div>
          <div>sample textsample textsample textsample textsample text</div>
          <div className="footer_labels">
            <div className="time">2 days ago</div>
            <div className="comments">13 comments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
