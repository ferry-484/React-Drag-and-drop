import React, { useState } from 'react'
import { FadeLoader } from "react-spinners"
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { Button } from '@material-ui/core'
import swal from 'sweetalert'

function DownloadFile() {
    const [loader, setLoader] = useState(false);

    const createElement = (link) => {
        let element = document.createElement('a');
        element.setAttribute('href', link);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const downloadFile = () => {
        setLoader(true);
        fetch('http://99deaedad36e.ngrok.io/tableauData/downloadFile')
        .then(res => res.json())
        .then(res => {
            console.log(res);
            setLoader(false);
            if(res.status === 200) {
                createElement(res.filePath);
            }
        })
        .catch(err => {
            setLoader(false);
            swal('Something went wrong', {
                icon: 'warning',
                closeOnClickOutside: false,
                closeOnEsc: false
            });
            console.log(err);
        })
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'}}>
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
    )
}

export default DownloadFile
