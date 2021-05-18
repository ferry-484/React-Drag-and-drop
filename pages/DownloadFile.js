import React, { useState } from "react";
import { FadeLoader } from "react-spinners";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Button } from "@material-ui/core";
import swal from "sweetalert";
import axios from 'axios';



function DownloadFile() {
  const [loader, setLoader] = useState(false);

  const downloadFile = () => {
       setLoader(true);
         fetch("http://09d7e73386bf.ngrok.io/downloadFile")
           .then((res) => res.json())
           .then((response) => {
            setLoader(false);
            let link = response.filePath;
            //console.log(link);
            const blob = new Blob([link]);
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'song.mp3';
            document.body.appendChild(a);
            a.parentNode.removeChild(a);
            console.log(response);
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          {loader ? (
            <div className={`Loader Upload`}>
              <FadeLoader
                style={{ height: "15", width: "5", radius: "2" }}
                color={"#6FABF0"}
              />
            </div>
          ) : null}
          <div>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              startIcon={<CloudDownloadIcon />}
              onClick={() => downloadFile()}
            >
              Download
            </Button>
          </div>
        </div>
      );
    }
    
    export default DownloadFile;
         

  // const downloadFile = () => {
  //   const method = "GET";
  //   const url = "https://source.unsplash.com/user/erondu/1920x1080";

  //   axios
  //     .request({
  //       url,
  //       method,
  //       responseType: "blob", //important
  //     })
  //     .then(({ data }) => {
  //       const downloadUrl = window.URL.createObjectURL(new Blob([data]));
  //       const link = document.createElement("a");
  //       link.href = downloadUrl;
  //       link.setAttribute("download", "file.jpg"); //any other extension
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();
  //       console.log(data);
  //     });
  // };

  // const createElement = (link) => {
  //   let filename = link.split("//").pop().split("/").pop();
  //   let element = document.createElement("a");
  //   element.setAttribute("href", window.URL.createObjectURL(new Blob([link])));
  //   console.log(element.href);
  //   element.setAttribute("download", filename);
  //   element.style.display = "none";
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };

  // const downloadFile = () => {
  //   setLoader(true);
  //   fetch("http://09d7e73386bf.ngrok.io/downloadFile")
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //       setLoader(false);
  //       if (res.status === 200) {
  //         createElement(res.filePath);
  //       }
  //     })
  //     .catch((err) => {
  //       setLoader(false);
  //       swal("Something went wrong", {
  //         icon: "warning",
  //         closeOnClickOutside: false,
  //         closeOnEsc: false,
  //       });
  //       console.log(err);
  //     });
  // };


  // const createElement = (link) => {
  //   let filename = link.split("//").pop().split("/").pop();
  //   let element = document.createElement("a");
  //   element.setAttribute(
  //     "href", window.URL.createObjectURL(new Blob([link])));
  //   element.setAttribute("download", filename);
  //   element.style.display = "none";
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };


  // const downloadFile = () => {
  //   setLoader(true);
  //   fetch("http://09d7e73386bf.ngrok.io/downloadFile")
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //       setLoader(false);
  //       if (res.status === 200) {
  //         createElement(res.filePath);
  //       }
  //     })
  //     .catch((err) => {
  //       setLoader(false);
  //       swal("Something went wrong", {
  //         icon: "warning",
  //         closeOnClickOutside: false,
  //         closeOnEsc: false,
  //       });
  //       console.log(err);
  //     });
  // };


// import React, { useState } from 'react'
// import { FadeLoader } from "react-spinners"
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
// import { Button } from '@material-ui/core'
// import swal from 'sweetalert'

// function DownloadFile() {
//     const [loader, setLoader] = useState(false);

//     const createElement = (link) => {
//         let element = document.createElement('a');
//         element.setAttribute('href', link);
//         element.style.display = 'none';
//         document.body.appendChild(element);
//         element.click();
//         document.body.removeChild(element);
//     }

//     const downloadFile = () => {
//         setLoader(true);
//         fetch('http://626ec992ba23.ngrok.io/downloadFile')

//         .then(res => res.json())
//         .then(res => {
//             console.log(res);
//             setLoader(false);
//             if(res.status === 200) {
//                 createElement(res.filePath);
//             }
//         })


//         .catch(err => {
//             setLoader(false);
//             swal('Something went wrong', {
//                 icon: 'warning',
//                 closeOnClickOutside: false,
//                 closeOnEsc: false
//             });
//             console.log(err);
//         })
//     }

//     return (
//         <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
//             {loader ? (
//                 <div className={`Loader Upload`}>
//                     <FadeLoader 
//                         style={{ height: "15", width: "5", radius: "2" }}
//                         color={"#6FABF0"}
//                     />
//                 </div>
//             ) : null}
//             <div>
//                 <Button
//                     variant="contained"
//                     size="large"
//                     color="secondary"
//                     startIcon={<CloudDownloadIcon />}
//                     onClick={() => downloadFile()}
//                 >
//                     Download
//                 </Button>
//             </div>
//         </div>
//     )
// }

// export default DownloadFile;


// import React, { useState } from "react";
// import { FadeLoader } from "react-spinners";
// import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
// import { Button } from "@material-ui/core";
// import swal from "sweetalert";

// // const apiUrl = "http://626ec992ba23.ngrok.io/downloadFile";

// function DownloadFile() {
//   const [loader, setLoader] = useState(false);

//   // const downloadFile = async () => {
//   //   try {
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // };

//   // const createElement = (link) => {
//   //   let filename = link.split("//").pop().split("/").pop();
//   //   let element = document.createElement("a");
//   //   element.setAttribute(
//   //     "href",
//   //     "data:charset=utf-8," + encodeURIComponent(link)
//   //   );
//   //   element.setAttribute("download", filename);
//   //   element.style.display = "none";
//   //   document.body.appendChild(element);
//   //   element.click();
//   //   document.body.removeChild(element);
//   // };

//   const downloadFile = (filename) => {
//     setLoader(true);
//     fetch("http://09d7e73386bf.ngrok.io/downloadFile")
//       .then((res) => res.arrayBuffer())
//       .then((response) => {
//         let data = new Uint8Array(response);
//            let file = new Blob([data], { type: "application/mkv" });
//              let fileURL = URL.createObjectURL(file);
//              let link = document.createElement("a");
//            link.href = fileURL;
//            link.download = filename;
//            link.click();
//            console.log(response);
//       })

//      .then((res) => {
//       console.log(res);
//       setLoader(false);
//       // if (res.status === 200) {
//       //   createElement(res.filePath);
//       // }

//      })
//       .catch((err) => {
//         setLoader(false);
//         swal("Something went wrong", {
//           icon: "warning",
//           closeOnClickOutside: false,
//           closeOnEsc: false,
//         });
//         console.log(err);
//       });
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "200px",
//       }}
//     >
//       {loader ? (
//         <div className={`Loader Upload`}>
//           <FadeLoader
//             style={{ height: "15", width: "5", radius: "2" }}
//             color={"#6FABF0"}
//           />
//         </div>
//       ) : null}
//       <div>
//         <Button
//           variant="contained"
//           size="large"
//           color="secondary"
//           startIcon={<CloudDownloadIcon />}
//           onClick={() => downloadFile()}
//         >
//           Download
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default DownloadFile;



// fileDownload = (e, filepath, type, filename) => {
//   let url = "";
//   let fileType = "";
//   let progressValue = {};
//   if (type === "ctscan") {
//     url = `${URLDATA.ctdownload}?tag=ctscan&filePath=${
//       filepath ? filepath : ""
//     }`;

//     // fileType = "application/dicom";
//     fileType = "application/zip";
//     progressValue = {
//       ctscan: true,
//       preliminary: false,
//       ip3: false,
//     };
//   } else if (type === "preAnalysis") {
//     url = `${URLDATA.ctdownload}?tag=preAnalysis&filePath=${
//       filepath ? filepath : ""
//     }`;
//     fileType = "application/pdf";
//     progressValue = {
//       ctscan: false,
//       preliminary: true,
//       ip3: false,
//     };
//   } else if (type === "treatmentPlan") {
//     url = `${URLDATA.ctdownload}?tag=treatmentPlan&filePath=${
//       filepath ? filepath : ""
//     }`;
//     fileType = "application/mkv";
//     progressValue = {
//       ctscan: false,
//       preliminary: false,
//       ip3: true,
//     };
//   }
//   var requestOptions = {
//     method: "GET",
//     headers: {
//       access_token: localStorage.getItem("token"),
//     },
//   };
//   this.setState({ progressValue: progressValue });
//   fetch(url, requestOptions)
//     .then((res) => res.arrayBuffer())
//     .then((response) => {
//       let data = type === "ctscan" ? new Uint8Array(response) : response;
//       let file = new Blob([data], { type: fileType });
//       let fileURL = URL.createObjectURL(file);
//       let link = document.createElement("a");
//       link.href = fileURL;
//       this.setState({ progressValue: false });
//       link.download = filename;
//       link.click();
//     })
//     .catch((e) => console.log(e));
// };

 

//                   <li>
//                       {" "}
//                       {this.state.progressValue &&
//                       this.state.progressValue.ctscan ? (
//                         <div className="downloadlink">
//                           {/* <SystemUpdateAltIcon /> */}
//                           <CircularProgressWithLabel /> Downloading
//                         </div>
//                       ) : (
//                         <a
//                           className="downloadlink"
//                           onClick={(e) =>
//                             this.fileDownload(
//                               e,
//                               CtscanData ? CtscanData.filepath : "",
//                               "ctscan",
//                               CtscanData ? CtscanData.filename : ""
//                             )
//                           }
//                         >
//                           <SystemUpdateAltIcon /> Download
//                         </a>
//                       )}
//                     </li>


