
import React from 'react';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { FadeLoader } from "react-spinners";

function Download() {
    const [load,setLoad] = React.useState(false);

    const Download = () => {
        setLoad(true);
        fetch( 'http://d0c1b51c8c72.ngrok.io/manageDatabase/downloadFile' )
        .then((response) =>response.json()
        )
        .then(response =>{
            setLoad(false);
            if(res.status === 200)
            window.open(response.filePath , '_self')
            console.log(response)
        })
        .catch(error=>
            console.log(error))
    }

    return (
    <div>
        {
            load ? (
                <div className= {`Loader Upload`}>
                    <FadeLoader 
                    style={{ height: "15", width: "5", radius: "2" }}
                    color={"#6FABF0"}>
                    </FadeLoader>
                </div>
                
            ) : null
        }
       
        <br/><br/><br/><br/>
        <div style={{display:'flex', justifyContent:'center'}}>

            <Button onClick= {()=>Download()} variant="contained" color="primary">
            Download Files <GetAppIcon/>
            </Button>
        </div>

      
    </div>  
    )
}
export default Download;



// import React, { useState } from "react";
// import GetAppIcon from '@material-ui/icons/GetApp';
// import { Button } from '@material-ui/core';
// import axios from "axios";

// const Download = () => {

//  const [percentage, setPercentage] = useState(0);
//  const [progress,   setProgress] = useState(null);

// const URL = 'http://d0c1b51c8c72.ngrok.io/manageDatabase/downloadFile';


//     //   axios({
//     //     url: 'http://d0c1b51c8c72.ngrok.io/manageDatabase/downloadFile', 

//     //     method: 'GET',
//     //     responseType: 'blob',
//     //      // important
//     //      onDownloadProgress(progressEvent) {
//     //    progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            
//     //         setPercentage(progress);
            
//     //               documentStyles.setProperty('--progress', `${progress}%`);
//     //                 }
//     //   })
    
//     //   .then((response) => {
//     //      const url = window.URL.createObjectURL(new Blob([response.data]));
//     //      const link = document.createElement('a');
//     //      link.href = url;

//     //      link.setAttribute('download', 'file.jpg'); 
//     //      document.body.appendChild(link);
//     //      link.click();
//     //      window.open();
//     //      //window.location.href = response.url;
//     //      setProgress('finished');
//     //      console.log(response);
//     //   })

//     //   .catch(error=>{
//     //      console.log(error);
//     // });

   
//     return(
//         <div className={`progress-button ${progress}`}>
//         <span className="loading-text">Loading</span>
//        <Button
//        color="primary"
//        variant="contained"
//         onClick={()=>downloadButton()}>
//         <span className="button-text">{progress === 'finished' ? 'Done' : 'Download Files'}</span>
//         <GetAppIcon />
//         </Button>
//         <span className="percentage">{percentage}%</span>
//        </div>
//     );
// }


// export default Download;


// import React, { useState } from "react";
// import axios from 'axios';
// //import './App.css';

// function Download() {
//     const [percentage, setPercentage] = useState(0);
//     const [progress,   setProgress] = useState(null);

//     const downloadFile = () => {
//         const documentStyles = document.documentElement.style;
//         let progress = 0;
    
//         setProgress('in-progress');
    
//         axios({
//             url: 'http://d0c1b51c8c72.ngrok.io/download_row_data/weekly/Weekly_Pacing_53.xlsx',
//             onDownloadProgress(progressEvent) {
//                 progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);

//                 setPercentage(progress);

//                 documentStyles.setProperty('--progress', `${progress}%`);
//             }
//         }).then(response => {
//             setProgress('finished');
//             console.log(response);
//         });
//     };

//     return (
//         <div className={`progress-button ${progress}`}>
//             <span className="loading-text">Loading</span>
//                 <button className="download-button" onClick={downloadFile}>
//                     <span className="button-text">{progress === 'finished' ? 'Done' : 'Download'}</span>
//                 </button>
//             <span className="percentage">{percentage}%</span>
//         </div>
//     );
// }

// export default Download;



