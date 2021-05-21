import React, { createElement, useState } from "react";
import { FadeLoader } from "react-spinners";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Button } from "@material-ui/core";
import swal from "sweetalert";
// import axios from "axios";

function Download() {
  const [loader, setLoader] = useState(false);

  const urlLink = " http://f26166ca1865.ngrok.io";
  const urlData = "/api/Containers/images/download/audio.mp3";

  const createElement = (link, type) => {
    let element = document.createElement("a");
    element.setAttribute("href", link);
    element.setAttribute("download", type);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadFile = () => {
    setLoader(true);
    const filePath = urlLink + urlData;
    fetch(filePath)
      .then((res) => res.blob())
      .then((res) => {
        setLoader(false);
        let url = window.URL.createObjectURL(res);
        let type = res.type;
        createElement(url, type);
        console.log(filePath);
        console.log(res);
      })

      .catch((err) => {
        setLoader(false);
        swal("Something went wrong", {
          icon: "warning",
          closeOnClickOutside: false,
          closeOnEsc: false,
        });
        console.log(err);
      });
  };

  return (
    <div className="container-app">
      {loader ? (
        <div className={`Loader Upload`}>
          <FadeLoader
            style={{ height: "15", width: "5", radius: "2" }}
            color={"#6FABF0"}
          />
        </div>
      ) : null}
      <div className="downloadButton">
        <Button onClick={() => downloadFile()}>Download</Button>
      </div>
    </div>
  );
}

export default Download;
