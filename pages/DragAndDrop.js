// import React, { useMemo, useState } from 'react'
// import { useDropzone } from 'react-dropzone'
// import CloudUploadIcon from '@material-ui/icons/CloudUpload'
// import Button from '@material-ui/core/Button'
// import Checkbox from '@material-ui/core/Checkbox'
// import FormGroup from '@material-ui/core/FormGroup'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import axios from 'axios'
// import CircularProgress from '@material-ui/core/CircularProgress'
// import DeleteIcon from '@material-ui/icons/Delete'
// import { IconButton } from '@material-ui/core'
// import swal from 'sweetalert'

// const baseStyle = {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '30px',
//     borderWidth: 3,
//     borderRadius: 3,
//     fontSize: '18px',
//     borderColor: '#eeeeee',
//     borderStyle: 'dashed',
//     backgroundColor: '#fafafa',
//     color: '#a2a2a2',
//     outline: 'none',
//     transition: 'border .24s ease-in-out'
// };
  
// const activeStyle = {
//     borderColor: '#2196f3'
// };

// const acceptStyle = {
//     borderColor: '#00e676'
// };

// const rejectStyle = {
//     borderColor: '#ff1744'
// };

// let allFiles = [];

// function DragAndDrop() {
//     const setDefaultTypes = () => {
//         return [
//             {checked: false, type: '.jpg'},
//             {checked: false, type: '.jpeg'},
//             {checked: false, type: '.png'},
//             {checked: false, type: '.pdf'},
//             {checked: false, type: '.gif'},
//             {checked: false, type: '.svg'},
//             {checked: false, type: '.mp4'},
//             {checked: false, type: '.mp3'},
//             {checked: false, type: '.doc'},
//             {checked: false, type: '.docx'},
//             {checked: false, type: '.xlsx'},
//         ];
//     }
//     const [fileTypes, setFileTypes] = useState(setDefaultTypes);
//     const [draggedFiles, setDraggedFiles] = useState([]);
//     const [progress, setProgress] = useState(false);
//     const {
//         getRootProps,
//         getInputProps,
//         open,
//         isDragActive,
//         isDragAccept,
//         isDragReject
//     } = useDropzone({
//         accept: fileTypes.filter(type => type.checked).length ? fileTypes.filter(type => type.checked).map(type => {return type.type}) : '', 
//         noClick: true, 
//         noKeyboard: true,
//         onDrop: (acceptedFiles) => {
//             setDraggedFiles(acceptedFiles.map(file => {
//                 allFiles.push(file);
//                 allFiles = allFiles.filter((value, index, arr) => arr.findIndex(item => (item.name === value.name)) === index);
//                 Object.assign(file, {
//                     preview: URL.createObjectURL(file)
//                 })
//             }));
//         },
//         onDropRejected: (fileRejections) => {
//             if(fileRejections.length) {
//                 swal('Some files can not be accepted', {
//                     icon: 'warning',
//                     closeOnClickOutside: false,
//                     closeOnEsc: false,
//                 }).then(function() {
//                     open();
//                 });
//             }
//         }
//     });

//     const cancelFileToUpload = (file) => {
//         allFiles.splice(allFiles.indexOf(file), 1);
//         setDraggedFiles([...allFiles]);
//     }

//     let files = allFiles.map(file => 
//         <li key={file.path}>
//             {file.path} - {file.type} - {file.size} bytes
//             <IconButton color="secondary" aria-label="delete" onClick={() => cancelFileToUpload(file)}>
//                 <DeleteIcon />
//             </IconButton>
//         </li>
//     );
    
//     const style = useMemo(() => ({
//         ...baseStyle,
//         ...(isDragActive ? activeStyle : {}),
//         ...(isDragAccept ? acceptStyle : {}),
//         ...(isDragReject ? rejectStyle : {})
//     }), [
//         isDragActive,
//         isDragReject,
//         isDragAccept
//     ]);
    
//     const getFileTypes = (checked, id) => {
//         let arr = fileTypes;
//         arr[id].checked = checked;
//         setFileTypes([...arr]);
//     }

//     const uploadFiles = () => {
//         if(navigator.onLine) {
//             setProgress(true);
//             let formData = new FormData();
//             allFiles.map(file => {
//                 formData.append('files', file);
//             })
//             axios.post('http://43f7a8950392.ngrok.io/upload', formData)
//             .then(res => {
//                 console.log(res);
//                 if(res['data'].status === 200) {
//                     setProgress(false);
//                     swal(res['data'].msg, {
//                         icon: 'success',
//                         closeOnClickOutside: false,
//                         closeOnEsc: false
//                     });
//                 }
//                 if(res['data'].status === 201) {
//                     setProgress(false);
//                     swal(res['data'].msg, {
//                         icon: 'warning',
//                         closeOnClickOutside: false,
//                         closeOnEsc: false
//                     });
//                 }
//             })
//             .catch(err => {
//                 setProgress(false);
//                 swal('Something went wrong', {
//                     icon: 'error',
//                     closeOnClickOutside: false,
//                     closeOnEsc: false
//                 });
//                 console.log(err);
//             })
//         } else {
//             swal('No internet connection', {
//                 icon: 'warning',
//                 closeOnClickOutside: false,
//                 closeOnEsc: false
//             });
//         }
//     }

//     const resetFilters = () => {
//         setFileTypes(setDefaultTypes);
//     }

//     const selectAllFilters = (checked) => {
//         let arr = fileTypes;
//         arr.forEach(item => {
//             item.checked = checked;
//             setFileTypes([...arr]);
//         });
//     }

//     return (
//         <div className="container">
//             <div {...getRootProps({style})}>
//                 <input {...getInputProps()} />
//                 <p>Drag and drop some files here...</p>
//                 <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={() => open()}
//                 >
//                     Choose
//                 </Button>
//             </div>
//             <FormGroup row>
//                 <FormControlLabel
//                     control={
//                         <Checkbox
//                             color="secondary"
//                             onChange={(event) => selectAllFilters(event.target.checked)}
//                         />
//                     }
//                     label="Select all"
//                 />
//                 {fileTypes.map((type, index) => {
//                     return(
//                         <FormControlLabel key = {index}
//                             control={
//                                 <Checkbox
//                                     checked={type.checked}
//                                     color="secondary"
//                                     onChange={(evt) => getFileTypes(evt.target.checked, index)}
//                                     value={type.type}
//                                 />
//                             }
//                             label={type.type}
//                         />
//                     )
//                 })}
//                 <Button 
//                     variant="outlined" 
//                     color="secondary"
//                     style={{marginLeft: 'auto'}} 
//                     onClick={() => resetFilters()}
//                 >
//                     Reset
//                 </Button>
//             </FormGroup>
//             <ul style={{listStyle: 'none'}}>{files}</ul>
//             {progress ? <CircularProgress variant="indeterminate"/> : null}
//             <Button 
//                 onClick={() => uploadFiles()} 
//                 variant="contained" 
//                 color="secondary" 
//                 disabled={allFiles.length === 0} 
//                 endIcon={<CloudUploadIcon />}
//             >
//                 Upload
//             </Button>
//         </div>
//     );
// }

// export default DragAndDrop;


import React, { useMemo, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import { IconButton } from '@material-ui/core'
import swal from 'sweetalert'
import _ from "lodash";
const URLDATA = "http://3.7.47.235:8443/api/Containers/draggable/upload";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    borderWidth: 3,
    borderRadius: 3,
    fontSize: '18px',
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#a2a2a2',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};
  
const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export default function DragAndDrop(props) {

    let [allFiles, setFile] = useState([])
    const [draggedFiles, setDraggedFiles] = useState([]);
    const [isLoading, setProgress] = useState(false);
    const [arr, setArr] = useState([])
    const {
        getRootProps,
        getInputProps,
        open,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: ".jpg, .jpeg,.png", 
        noClick: true, 
        noKeyboard: true,
        onDrop: (acceptedFiles) => {
            setDraggedFiles(acceptedFiles.map(file => {
                let files = allFiles;
                files.push(file);
                files = allFiles.filter((value, index, arr) => arr.findIndex(item => (item.name === value.name)) === index);
                setFile(files)
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            }));
        },
        onDropRejected: (fileRejections) => {
            if(fileRejections.length) {
                swal('Some files can not be accepted', {
                    icon: 'warning',
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                }).then(function() {
                    open();
                });
            }
        }
    });

    useEffect(()=>{
        console.log(allFiles)
       if(draggedFiles.length>0){
        handleFileUpload()
       }
    },[draggedFiles])

    const cancelFileToUpload = (file) => {
        allFiles.splice(allFiles.indexOf(file), 1);
        setFile(allFiles);
        setDraggedFiles([...allFiles]);
    }

    const Files = () =>{
        return(
            allFiles.map(file=>{
                return(
                    <li key={file.path}>
                        {file.path} - {file.type} - {file.size} bytes
                        <IconButton color="secondary" aria-label="delete" onClick={() => cancelFileToUpload(file)}>
                            <DeleteIcon />
                        </IconButton>
                    </li>
                )
            })    
        )
    }

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const [fileCount, setFileCount] = useState(0)

  const  fileUploadQuery = (url, request) =>
    fetch(url, request)
      .then((response) => response.json())
      .then((res) => {
          console.log(res)
        if (res.result && res.result.files) {
          if (res.result.files.ctscans.length) {
            const fileData = res.result.files.ctscans.map(
              (ctItem) => ctItem.name
            );
            return { fileData, error: null, apiCall: true };
          } else {
            return { fileData: [], error: null, apiCall: true };
          }
        } else {
          let message = res.error ? res.error.message : res.message;
        //   this.setState({
        //     open: true,
        //     severity: "error",
        //     alertmsg: message,
        //     uploading: false,
        //     isFileUpload: false,
        //     saveButtonDisabled: true,
        //     timer: 3000,
        //   });
          return { fileData: [], error: message, apiCall: true };
        }
      })
      .catch((error) => {
        // this.setState({
        //   open: true,
        //   severity: "error",
        //   alertmsg: error.message,
        //   uploading: false,
        //   isFileUpload: false,
        //   saveButtonDisabled: true,
        //   timer: 3000,
        // });
        return { fileData: [], error: error.message, apiCall: true };
      });


const handleFileUpload = async (fileStatus = [], UploadedFile = []) => {
  //let { files } = this.state;
  console.log(allFiles)
  if (allFiles && allFiles.length) {
    let formData = new FormData();
    let batchfiles = _.chunk(allFiles, 20);
    let FileStatus = !fileStatus.length
      ? batchfiles.map((item) => {
          return { status: false, item };
        })
      : fileStatus;
    let uploadedFiles = UploadedFile;
    // if (signal.aborted) {
    //   controller = new AbortController();
    //   signal = controller.signal;
    // }
    var requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
      headers: {
        access_token: localStorage.getItem("token"),
      },
     // signal: signal,
    };
    // this.setState({
    //   saveButtonDisabled: true,
    //   uploading: true,
    //   filename: [],
    // });
    let uploadingFile = await Promise.all(
      batchfiles.map(async (batchItem, batchIndex) => {
        formData.delete("ctscans");
        let EachFile = await Promise.all(
          batchItem.map(async (fileItem, index, arr) => {
            if (arr.length === index + 1) {
              formData.append("ctscans", fileItem);
              if (
                !FileStatus[batchIndex].status &&
                (batchIndex === 0 ||
                  (FileStatus[batchIndex - 1] &&
                    FileStatus[batchIndex - 1].status === true))
              ) {
                let queryData = await fileUploadQuery(
                  URLDATA,
                  requestOptions
                );
                FileStatus[batchIndex].status = queryData.apiCall
                  ? true
                  : false;
                if (FileStatus[batchIndex].status) {
                  uploadedFiles = [...uploadedFiles, ...queryData.fileData];
                  setFileCount({ fileCount: uploadedFiles.length })
                    handleFileUpload(FileStatus, uploadedFiles)
                  
                }
              }
            } else {
              formData.append("ctscans", fileItem);
              return fileItem;
            }
          })
        );

        return batchItem;
      })
    );

//     if (FileStatus.filter((item) => item.status).length == FileStatus.length)
//       this.setState({
//         filename: uploadedFiles.map((item, index) => {
//           return { uploadedFilename: item, file: draggedFiles[index] };
//         }),
//         uploading: false,
//         saveButtonDisabled: !(
//           FileStatus.map((item) => item.item).flat().length === draggedFiles.length
//         ),
//       });
//   } else {
//     this.setState({
//       fileErrorMsg:
//         files && files.length ? "" : "CT scan file or zip file is mandatory.",
//       uploading: false,
//       isFileUpload: false,
//       saveButtonDisabled: false,
//       filename: null,
//       files: files,
//     });
//  
 }
};

   

    return (
        <div className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p>Drag and drop some files here...</p>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => open()}
                >
                    Choose
                </Button>
            </div>
        
            <ul style={{listStyle: 'none'}}>
                <Files />
            </ul>
            {isLoading ? <CircularProgress variant="indeterminate"/> : null}
        </div>
    );
}


