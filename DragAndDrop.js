import React, { useMemo, useState } from 'react'
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

function DragAndDrop() {

    let [allFiles, setFile] = useState([])


    const setDefaultTypes = () => {
        return [
            {checked: false, type: '.jpg'},
            {checked: false, type: '.jpeg'},
            {checked: false, type: '.png'},
            {checked: false, type: '.pdf'},
            {checked: false, type: '.gif'},
            {checked: false, type: '.svg'},
            {checked: false, type: '.mp4'},
            {checked: false, type: '.mp3'},
            {checked: false, type: '.doc'},
            {checked: false, type: '.docx'},
            {checked: false, type: '.xlsx'},
        ];
    }
    const [fileTypes, setFileTypes] = useState(setDefaultTypes);
    const [draggedFiles, setDraggedFiles] = useState([]);
    const [isLoading, setProgress] = useState(false);
    const {
        getRootProps,
        getInputProps,
        open,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: fileTypes.filter(type => type.checked).length ? fileTypes.filter(type => type.checked).map(type => {return type.type}) : '', 
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
    
    const getFileTypes = (checked, id) => {
        let arr = fileTypes;
        arr[id].checked = checked;
        setFileTypes([...arr]);
    }

    const uploadFiles = () => {
        if(allFiles.length == 0){
            swal('No files are selected', {
                icon: 'warning',
                closeOnClickOutside: false,
                closeOnEsc: false
            });
            return false
        }
        if(navigator.onLine) {
            setProgress(true);
            let formData = new FormData();
            allFiles.map(file => {
                formData.append('files', file);
            })
            axios.post('http://3.7.47.235:8443/api/Containers/draggable/upload', formData)
            .then(res => {
                setProgress(false);
                if(res && res.status == 200){
                    swal('Image uploaded successfully!', {
                        icon: 'success',
                        closeOnClickOutside: false,
                        closeOnEsc: false
                    });
                    setFile([])
                }else{
                    swal('Error occured while uploading', {
                        icon: 'warning',
                        closeOnClickOutside: false,
                        closeOnEsc: false
                    });
                }
            })
            .catch(err => {
                console.log(err);
                setProgress(false);
                swal('Something went wrong', {
                    icon: 'error',
                    closeOnClickOutside: false,
                    closeOnEsc: false
                });
            })
        } else {
            swal('No internet connection', {
                icon: 'warning',
                closeOnClickOutside: false,
                closeOnEsc: false
            });
        }
        
    }

    const resetFilters = () => {
        setFileTypes(setDefaultTypes);
    }

    const selectAllFilters = (checked) => {
        let arr = fileTypes;
        arr.forEach(item => {
            item.checked = checked;
            setFileTypes([...arr]);
        });
    }

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
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            onChange={(event) => selectAllFilters(event.target.checked)}
                        />
                    }
                    label="Select all"
                />
                {fileTypes.map((type, index) => {
                    return(
                        <FormControlLabel key = {index}
                            control={
                                <Checkbox
                                    checked={type.checked}
                                    color="secondary"
                                    onChange={(evt) => getFileTypes(evt.target.checked, index)}
                                    value={type.type}
                                />
                            }
                            label={type.type}
                        />
                    )
                })}
                <Button 
                    variant="outlined" 
                    color="secondary"
                    style={{marginLeft: 'auto'}} 
                    onClick={() => resetFilters()}
                >
                    Reset
                </Button>
            </FormGroup>
            <ul style={{listStyle: 'none'}}>
                <Files />
            </ul>
            {isLoading ? <CircularProgress variant="indeterminate"/> : null}
            <Button 
                onClick={() => uploadFiles()} 
                variant="contained" 
                color="secondary" 
                disabled={allFiles.length === 0 || isLoading} 
                endIcon={<CloudUploadIcon />}
            >
                Upload
            </Button>
        </div>
    );
}

export default DragAndDrop
