import React, { Component, useCallback, useMemo, useState , useEffect } from "react";
import { connect } from "react-redux";
// import store from "../../Redux/Store";
import { v4 as uuidv4 } from 'uuid';
import { fetchMethod, debounce, abortFetching } from "../../FetchMethod";
import { FadeLoader } from "react-spinners";
import SnackBarComponent from "../../SnackBar/SnackBar";
import { uploadCT } from "./PatientConfig";
import FormComponent from "../../Form/FormComponent";
import {
  siteListQuery,
  saveCTScan,
  CtscansUploadCtscan,
  uploadTracker,
  patientListQuery,
} from "./PatientQuery";
import {
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import { mutationQueries, abortMutation } from "../../MutationMethod";
import { URLDATA } from "../../Config";
// import DwvComponent from "../../DwvComponent/DwvComponent";
import { useDropzone } from "react-dropzone";
import cloudUploadIcon from "../../assets/images/Icon feather-upload-cloud.svg";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import CircularProgress from "../../DumbAssets/CircularProgress";
import axios from "axios";
import { ProgressBar } from 'react-bootstrap'
let controller = new AbortController();
let signal = controller.signal;

function Dropzone(props) {
  const onDrop = useCallback((files) => {
    let zipFile = files;
    // console.log(zipFile,"Zip File")
    zipFile = files
      ? files.filter(
          (item) => item.type.includes("zip") && item.name.includes("zip")
        ).length
        ? files.filter(
            (item) => item.type.includes("zip") && item.name.includes("zip")
          )
        : files.filter(
            (item) => !item.type.includes("rar") && !item.name.includes("rar") && !item.type.includes("msi") && !item.name.includes("msi")
          )
      : files.filter(
          (item) => !item.type.includes("rar") && !item.name.includes("rar") && !item.type.includes("msi") && !item.name.includes("msi")
        );
    zipFile = zipFile.sort(function (a, b) {
      return a.name - b.name;
    });
    if (
      zipFile.filter(
        (item) => item.type.includes("zip") && item.name.includes("zip")
      ).length > 1
    ) {
      props.FileError("Multiple zip files are not supported.");
    } else {
      if (
        zipFile.filter(
          (item) => item.type.includes("zip") && item.name.includes("zip")
        ).length
      ) {
        getFileContext(zipFile);
        // props.zipFileUpload(zipFile)
      }
      else {
      props.fileData(zipFile, "");
      }
    }
  });
  const onDropRejected = (rejectedFiles) => {
    return (
      rejectedFiles &&
      rejectedFiles.length &&
      rejectedFiles[0].errors.map((item) => {
        if (item.code === "file-too-large")
          props.FileError(
            "File is too large. The maximum file size allowed is 1 GB."
          );
        else return null;
      })
    );
    // })
  };

  const getFileContext = (files) => {
    resetChunkProperties();
    const _file =files[0];
    setFileSize(_file.size)

    const _totalCount = _file.size % chunkSize == 0 ? _file.size / chunkSize : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
    setChunkCount(_totalCount)

    const _fileID = uuidv4() + "." + _file.name.split('.').pop();
    setFileGuid(_fileID)
    setFileToBeUpload(_file)

  }

  const fileUpload = () => {
    setCounter(counter + 1);
    // console.log(fileToBeUpload , "File Upload()")
    const _fileID = fileGuid  
    if (counter <= chunkCount) {
      var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
      uploadChunk(chunk,fileGuid);
      props.fileSaveButton(true)
    }
  };

  const uploadChunk = async (chunk,file) => {
    try {
      const response = await axios.post(
        URLDATA.ctchunks,
        chunk,
        {
          params: {
            id: counter,
            fileName: fileGuid ? fileGuid:file,
          },
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      // console.log(data,"data")
      // debugger
      if (data.isSuccess) {
        setBeginingOfTheChunk(endOfTheChunk);
        setEndOfTheChunk(endOfTheChunk + chunkSize);
        if (counter == chunkCount) {
          // console.log("Process is complete, counter", counter);

          await uploadCompleted();
        } else {
          var percentage = (counter / chunkCount) * 100;
          setProgress(percentage);
        }
      } else {
        props.uploadError(data.error)
        console.log("Error Occurred:", data.errorMessage);
      }
    } catch (error) {
      props.uploadError( error.message )
      console.log("error", error);
    }
  };

  const uploadCompleted = async () => {
    var formData = new FormData();
    // console.log(fileGuid, "File name")
    formData.append("fileName", fileGuid);

    const response = await axios.post(
      URLDATA.ctcomplete,
      {},
      {
        params: {
          fileName: fileGuid,
          count:counter,
        },
        data: formData,
      }
    );
    // const response = {}
      // console.log(response, "Response")
    const data = response.data;
    // console.log("Complete")
    if (data.isSuccess) {
      setProgress(0);
      setShowProgress(false)
      props.zipFileUpload(fileGuid , [fileToBeUpload])
      props.fileSaveButton(false)
    }
  };

  const resetChunkProperties = () => {
    props.FileError("")
    setShowProgress(true)
    setProgress(0)
    setCounter(1)
    setBeginingOfTheChunk(0)
    setEndOfTheChunk(chunkSize)
  }
  const activeStyle = {
    backgroundColor: "#79B3C6",
  };
  let {
    getRootProps,
    getInputProps,
    open,
    acceptedFiles,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
    onDropRejected,
    multiple: true,
    accept: ".dcm,.dicom,.zip,",
    maxSize: 1073741824,
  });
  
  const chunkSize = 1048576 * 3;
  const [showProgress, setShowProgress] = useState(false);
  const [counter, setCounter] = useState(1);
  const [fileToBeUpload, setFileToBeUpload] = useState({});

  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0);
  const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize);
  const [progress, setProgress] = useState(0);
  const [fileGuid, setFileGuid] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  
  useEffect(() => {
    if (fileSize > 0) {
      fileUpload(counter);
    }
    // console.log("fileGuid",fileGuid)
  }, [fileToBeUpload, progress ])
  // useEffect(() => {
  //   debugger
  //   setFileGuid(fileGuid)
  // }, [fileGuid])
  const style = useMemo(
    () => ({
      ...(isDragActive ? activeStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  const zipFile = acceptedFiles
    .filter((file) => file.type.includes("zip") && file.name.includes("zip"))
    .map((file, index) =>
      file.type.includes("zip") && file.name.includes("zip") && index === 0 ? (
        <li key={file.path}>
          <span>
            {file.path} - {file.size} bytes
          </span>{" "}
          <IconButton
            onClick={(e) => {
              acceptedFiles.splice(acceptedFiles.indexOf(file), 1);
              props.removeFile(file);
            }}
          >
            <CloseIcon />
          </IconButton>
        </li>
      ) : (
        ""
      )
    );
  acceptedFiles = zipFile.length
    ? zipFile
    : acceptedFiles.sort(function (a, b) {
        return a.name - b.name;
      });
  const files = zipFile.length
    ? zipFile
    : acceptedFiles
        .filter(
          (item) => !item.type.includes("rar") && !item.name.includes("rar") && !item.type.includes("msi") && !item.name.includes("msi")
        )
        .map((file) => (
          <li key={file.path}>
            <span>
              {file.path} - {file.size} bytes
            </span>{" "}
            <IconButton
              onClick={(e) => {
                acceptedFiles.splice(acceptedFiles.indexOf(file), 1);
                props.removeFile(file);
              }}
            >
              <CloseIcon />
            </IconButton>
          </li>
        ));
  const progressInstance =<ProgressBar now={progress} label={`${progress.toFixed(3)}%`} />;
  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone", style })}>
        <input {...getInputProps()} accept=".dcm,.dicom,.zip" />
        <img src={cloudUploadIcon} />
        <p>Drag & Drop file here</p>
        <p>or</p>
        <Button onClick={open} disabled={showProgress}>Browse File</Button>
        {files.length && !props.removeAllFile && !showProgress? (
          <div className="fileContainer">
            <ul>{files}</ul>
          </div>
        ) : (
          ""
        )}
        <div style={{display: showProgress ? "block" : "none" }} className="progressStyle">
          {progressInstance}
        </div>
        {/* {fileRejectionItems.length ? (
        <div className="fileContainer">
          <ul>{fileRejectionItems}</ul>
        </div>
      ) : (
        ""
      )} */}
      </div>
    </div>
  );
}
class UploadCT extends Component {
  constructor(props) {
    super(props);
    this.chunkSize = 1048576 * 1;
    this.state = {
      loading: false,
      open: false,
      severity: "",
      alertmsg: "",
      siteOptions: [],
      files: "",
      uploadCtSection: uploadCT,
      errors: {},
      errorMessages: {},
      isFileUpload: false,
      saveButtonDisabled: false,
      rescanmodal: false,
      uploading: false,
      fileCount: 0,
      showProgress:false,
      counter:1,
      fileToBeUpload:{},
      beginingOfTheChunk:0,
      endOfTheChunk:this.chunkSize,
      progress:0,
      fileGuid:"",
      fileSize :0 ,
      chunkCount : 0
    }; 
  }
  openDropZone = (items) => {
    return (
      <div className="UploadCt">
        <Dropzone
          fileData={(file, error) => this.fileData(file, items, error)}
          removeAllFile={!this.state.files.length}
          FileError={(err) => this.fileError(err)}
          removeFile={(file) => this.removeFile(file)}
          zipFileUpload={(zipFileName , files)=>this.setState({ filename:[{ uploadedFilename: zipFileName, file: files[0] }] , files })}
          fileSaveButton={(val)=>this.setState({saveButtonDisabled:val})}
          uploadError={(error)=>this.setState({
            open: true,
            severity: "error",
            alertmsg: error,
            loading: false,
            isFileUpload: false,
            saveButtonDisabled: false,
            timer: 3000,
          })}
        />
        {this.state.fileErrorMsg ? (
          <FormHelperText>{this.state.fileErrorMsg}</FormHelperText>
        ) : (
          ""
        )}
      </div>
    );
  };


  // 
  fileError = (err) => {
    this.setState({ fileErrorMsg: err });
  };
  removeFile = (file) => {
    let { filename, files } = this.state;
    filename = filename.filter((item) => item.file.name !== file.name);
    files = files.filter((item) => item.name !== file.name);
    // console.log(filename,"Filename")
    if (files && !files.length)
      this.fileError("CT scan file or zip file is mandatory.");
    this.setState({ filename, files ,rescanIntervaporId:undefined ,  rescan:false});
  };
  fileData = (file, formData, error) => {
    let noErrors = true;
    this.setState(
      {
        // errors,
        // errorMessages,
        files: file,
        fileErrorMsg: error ? error : "",
        saveButtonDisabled: error,
        uploading: error,
      },
      () => {
        if (noErrors) this.handleFileUpload();
      }
    );
  };
  fileType = (file) => {
    const filereader = new FileReader();
    const blob = file[0];
    filereader.onloadend = function (evt) {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result);
        let bytes = [];
        uint.forEach((byte) => {
          bytes.push(byte.toString(16));
        });
        const hex = bytes.join("").toUpperCase();
        console.log(hex, "Hex code ");
      }

      console.timeEnd("FileOpen");
    };

    filereader.readAsArrayBuffer(blob);
  };
  Patients = () => {
    this.props.history.push("/patients");
  };
  handleSnackBarClose = () => {
    let { severity } = this.state;
    this.setState({ open: false, severity: "", alertmsg: "" });
    if (severity === "success") {
      this.props.history.push("/patients");
    }
  };
  // Rescan Modal Popup
  rescanModalClose = (e) => {
    this.setState((prevState) => {
      return { rescanmodal: !prevState.rescanmodal, rescanErrorMsg: "" };
    });
  };
  handlerescan = (e, value) => {
    let { ctscanvalue, rescanIntervaporId } = this.state;
    let {
      birthyear,
      comments,
      patientinitial,
      referenceId,
      siteid,
    } = ctscanvalue;
    this.setState(
      {
        rescan: true,
        rescanmodal: false,
        rescanIntervaporId: value === "new-patient" ? null : rescanIntervaporId,
      },
      () =>
        this.preSubmitChanges({
          patientinitial,
          siteid,
          birthyear,
          comments,
          referenceId,
          rescan: this.state.rescan,
          rescanIntervaporId: this.state.rescanIntervaporId,
        })
    );
  };
  siteData = (value) => {
    this.setState({ siteOptions: [] }, () => {
      return this.state.siteOptions;
    });
    if (value.length >= 1) {
      this.setState({ siteOptions: [] }, () => {
        return this.state.siteOptions;
      });
      this.debounceTimer = debounce(
        this.debounceTimer,
        () =>
          fetchMethod(siteListQuery, {
            where: {
              and: [
                {
                  or: [
                    { siteid: { like: `%${value}%` } },
                    { name: { like: `%${value}%` } },
                  ],
                },
              ],
            },
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.error && res.error.statusCode === 401) {
                localStorage.clear();
                window.location = "/";
              }
              if (res.data.allSites.Sites) {
                let data = res.data.allSites.Sites;
                data.map((item) => {
                  return (item.name = `${item.siteid}, ${item.name}`);
                });
                this.setState({ siteOptions: data }, () => {
                  return this.state.siteOptions;
                });
              }
            })
            .catch((e) => console.log(e)),
        10
      );
    } else {
      this.setState({ siteOptions: [] }, () => {
        return this.state.siteOptions;
      });
    }
  };
  fileValidation = () => {
    if (this.state.files && this.state.files.length) {
      return false;
    } else {
      this.setState({
        fileErrorMsg: "CT scan file or zip file is mandatory.",
      });
      return true;
    }
  };
  fileTracking = async (trackingId, successMessage) => {
    return fetchMethod(uploadTracker, { id: trackingId })
      .then((res) => res.json())
      .then((res) => {
        let {
          data: {
            Uploadtracker: { id, status },
          },
        } = res;
        if (status === "INPROGRESS") {
          return setTimeout(() => this.fileTracking(id, successMessage), 2500);
        } else if (status === "DONE") {
          this.setState(
            {
              isFileUpload: true,
              open: true,
              severity: "success",
              alertmsg: successMessage,
              timer: 2000,
              loading: false,
              saveButtonDisabled: true,
            },
            () => {
              setTimeout(() => {
                this.props.history.push("/patients");
              }, 2000);
            }
          );
          return true;
        } else {
          this.setState({
            open: true,
            severity: "error",
            alertmsg: "CT scan not uploaded. Please try again.",
            loading: false,
            isFileUpload: false,
            saveButtonDisabled: false,
            timer: 3000,
          });
          return false;
        }
      })
      .catch((err) => {
        this.setState({
          open: true,
          severity: "error",
          alertmsg: err.message,
          loading: false,
          isFileUpload: false,
          saveButtonDisabled: false,
          timer: 3000,
        });
      });
  };
  preSubmitChanges = async (e) => {
    this.setState({ loading: true });
    e.active = 1;
    e.siteid = e.site ? e.site.id : e.siteid;
    // e.filepath = this.state.files[0].name;
    e.patientinitial = e.patientinitial.toUpperCase();
    delete e.site;
    let { filename } = this.state;
    if (e.birthyear && !e.rescan && filename) {
      e.birthyear = e.birthyear.getFullYear();
    }
    let { patientinitial, siteid, birthyear, comments, referenceId } = e;
    if (filename) {
      let variables = {
        initials: patientinitial,
        siteId: siteid,
        birthYear: birthyear,
        comments,
        referenceId,
        filename: filename.map((item) => item.uploadedFilename),
      };
      if (this.state.rescan)
        variables.rescanIntervaporId = e.rescanIntervaporId
          ? e.rescanIntervaporId
          : "new";
      this.setState({
        ctscanvalue: {
          patientinitial,
          siteid,
          birthyear,
          comments,
          referenceId,
          active: 0,
        },
      });
      mutationQueries(CtscansUploadCtscan, variables)
        .then(async (res) => {
          let {
            data: { CtscansUploadCtscan },
          } = res;
          if (CtscansUploadCtscan.status === "success") {
            await this.fileTracking(
              CtscansUploadCtscan.trackingId,
              CtscansUploadCtscan.message
            );
          } else {
            let message = CtscansUploadCtscan.message;
            // code: "DUPLICATE_SCAN"
            let code = CtscansUploadCtscan.code;
            if (code === "DUPLICATE_SCAN") {
              this.setState({
                rescanmodal: true,
                loading: false,
                ctscanvalue: {
                  patientinitial,
                  siteid,
                  birthyear,
                  comments,
                  referenceId,
                },
                intervaporArray: CtscansUploadCtscan.scans,
                rescanErrorMsg: "",
              });
            } else {
              this.setState({
                open: true,
                severity: "error",
                alertmsg: message,
                loading: false,
                isFileUpload: false,
                saveButtonDisabled: false,
                timer: 3000,
                rescanIntervaporId:undefined
              });
            }
          }
        })
        .catch((err) => {
          this.setState({
            open: true,
            severity: "error",
            alertmsg: err.message,
            loading: false,
            isFileUpload: false,
            saveButtonDisabled: false,
            timer: 3000,
            rescanIntervaporId:undefined,
            rescan:false
          });
        });
    } else {
      this.preSubmitChanges(e);
    }

    return true;
  };
  fileUploadQuery = (url, request) =>
    fetch(url, request)
      .then((response) => response.json())
      .then((res) => {
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
          this.setState({
            open: true,
            severity: "error",
            alertmsg: message,
            uploading: false,
            isFileUpload: false,
            saveButtonDisabled: true,
            timer: 3000,
          });
          return { fileData: [], error: message, apiCall: true };
        }
      })
      .catch((error) => {
        this.setState({
          open: true,
          severity: "error",
          alertmsg: error.message,
          uploading: false,
          isFileUpload: false,
          saveButtonDisabled: true,
          timer: 3000,
        });
        return { fileData: [], error: error.message, apiCall: true };
      });

  handleFileUpload = async (fileStatus = [], UploadedFile = []) => {
    let { files } = this.state;
    if (files && files.length) {
      let formData = new FormData();
      let batchfiles = _.chunk(files, 20);
      let FileStatus = !fileStatus.length
        ? batchfiles.map((item) => {
            return { status: false, item };
          })
        : fileStatus;
      let uploadedFiles = UploadedFile;
      if (signal.aborted) {
        controller = new AbortController();
        signal = controller.signal;
      }
      var requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
        headers: {
          access_token: localStorage.getItem("token"),
        },
        signal: signal,
      };
      this.setState({
        saveButtonDisabled: true,
        uploading: true,
        filename: [],
      });
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
                  let queryData = await this.fileUploadQuery(
                    URLDATA.cturl,
                    requestOptions
                  );
                  FileStatus[batchIndex].status = queryData.apiCall
                    ? true
                    : false;
                  if (FileStatus[batchIndex].status) {
                    uploadedFiles = [...uploadedFiles, ...queryData.fileData];
                    this.setState({ fileCount: uploadedFiles.length }, () =>
                      this.handleFileUpload(FileStatus, uploadedFiles)
                    );
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

      if (FileStatus.filter((item) => item.status).length == FileStatus.length)
        this.setState({
          filename: uploadedFiles.map((item, index) => {
            return { uploadedFilename: item, file: files[index] };
          }),
          uploading: false,
          saveButtonDisabled: !(
            FileStatus.map((item) => item.item).flat().length === files.length
          ),
        });
    } else {
      this.setState({
        fileErrorMsg:
          files && files.length ? "" : "CT scan file or zip file is mandatory.",
        uploading: false,
        isFileUpload: false,
        saveButtonDisabled: false,
        filename: null,
        files: files,
      });
    }
  };
  handleCheck = (e) => {
    let { name, value, checked } = e.target;
    this.setState({
      [name]: checked ? value : "",
      rescanErrorMsg: "",
    });
  };
  cancelFileUpload = (e) => {
    controller.abort();
    this.setState((prevState) => {
      return { files: [], filename: null, saveButtonDisabled: false };
    });
  };
  CancelFileSending = async (e) => {
    let {
      ctscanvalue: {
        birthyear,
        comments,
        patientinitial,
        referenceId,
        siteid,
      } = {},
    } = this.state;

    let deleteobj = {
      active: 1,
      birthyear,
      comments,
      patientinitial,
      referenceid: referenceId,
      siteid,
    };
    deleteobj["order"] = "createdon DESC";
    let { data: { allCtscans: { Ctscans } = {} } = {} } = await fetchMethod(
      patientListQuery,
      {
        where: deleteobj,
      }
    )
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => {
        return {};
      });
    // await mutationQueries(saveCTScan, { obj: deleteobj })
    //   .then((res) => res)
    //   .catch((err) => console.log(err, "Error"));
    abortMutation();
    abortFetching();
  };
  render() {
    return (
      <div className="uploadCT">
        {this.state.uploading ? (
          <div className={`Loader Upload`}>
            {!this.state.fileCount && (
              <FadeLoader
                style={{ height: "15", width: "5", radius: "2" }}
                color={"#6FABF0"}
                loading={this.state.uploading}
              />
            )}
            <div>
              {/* {console.log("File Counts", (this.state.fileCount / this.state.files) * 100)} */}
              {this.state.fileCount ? (
                <div>
                  <CircularProgress
                    value={
                      (this.state.fileCount / this.state.files.length) * 100
                      // (this.state.fileCount / this.state.files) * 100
                    }
                    className="uploadingLoader"
                  />
                  <h4>
                    Uploaded {this.state.fileCount} out of{" "}
                    {this.state.files.length} files
                  </h4>
                </div>
              ) : (
                <h4>Uploading...</h4>
              )}
              <a onClick={this.cancelFileUpload} className="canceluploadbtn">
                Cancel
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.loading ? (
          <div className="Loader Upload">
            <FadeLoader
              style={{ height: "15", width: "5", radius: "2" }}
              color={"#6FABF0"}
              loading={this.state.loading}
            />
            <div>
              <h4
                style={{
                  marginTop: "20px",
                }}
              >
                Saving...
              </h4>
              {/* <a onClick={this.CancelFileSending} className="canceluploadbtn">
                Cancel
              </a> */}
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.open ? (
          <SnackBarComponent
            severity={this.state.severity}
            open={this.state.open}
            alertmsg={this.state.alertmsg}
            timer={this.state.timer}
            handleClose={this.handleSnackBarClose}
            className="addUserSnackBar"
          />
        ) : (
          ""
        )}
        <ul className="uploadpath">
          <li onClick={this.Patients} style={{ cursor: "pointer" }}>
            Patients
          </li>
          <li>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13.992"
                height="8"
                viewBox="0 0 13.992 8"
              >
                <defs></defs>
                <path
                  className="a"
                  d="M13.186,16.835l5.291-5.295a1,1,0,0,1,1.412,0,1.008,1.008,0,0,1,0,1.416l-5.995,6a1,1,0,0,1-1.379.029L6.479,12.961a1,1,0,0,1,1.412-1.416Z"
                  transform="translate(-6.188 -11.246)"
                />
              </svg>
            </span>
          </li>
          <li> Upload Files</li>
        </ul>
        <h2>Upload CT</h2>
        {/* RESCAN POP UP */}
        <Dialog
          open={this.state.rescanmodal}
          onClose={this.rescanModalClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Duplicate record found!
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="duplicate-text">
            A duplicate CT scan is provided. Please select an InterVapor ID for rescanning.
            </DialogContentText>
            <div>
              {this.state.intervaporArray &&
                this.state.intervaporArray.map((items) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={"rescanIntervaporId"}
                        checked={
                          this.state.rescanIntervaporId == items ? true : false
                        }
                        onChange={this.handleCheck}
                        color="primary"
                        value={items}
                      />
                    }
                    label={items}
                    key={items}
                  />
                ))}
              {this.state.rescanErrorMsg ? (
                <FormHelperText className = "rescanError" >{this.state.rescanErrorMsg}</FormHelperText>
              ) : (
                ""
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={(e) => this.handlerescan(e, "new-patient")}
              className="cancelbtn-ctupload"
            >
              New Patient
            </Button>
            <Button
              onClick={(e) =>
                this.state.rescanIntervaporId
                  ? this.handlerescan(e, "rescan")
                  : this.setState({
                      rescanErrorMsg:
                        "Please select an InterVapor ID for rescanning.",
                    })
              }
              autoFocus
              className="confirmbtn"
              // disabled={!this.state.rescanIntervaporId}
            >
              Rescan
            </Button>
          </DialogActions>
        </Dialog>
        {/* END OF RESCAN POP UP */}
        <FormComponent
          formConfig={this.state.uploadCtSection}
          preSubmitChanges={this.preSubmitChanges}
          query={saveCTScan}
          showContentOnForm={{ file: this.openDropZone }}
          params={{
            siteOptions: this.state.siteOptions,
          }}
          independentSearch={{ siteconfig: this.siteData }}
          dependentSearch={{
            siteconfig: this.siteData,
          }}
          errors={this.state.errors}
          errorMessages={this.state.errorMessages}
          saveButtonDisabled={this.state.saveButtonDisabled}
          contentValidationOnForm={{ file: this.fileValidation }}
        />
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    sideBarPath: (route) =>
      dispatch({ type: "Show_Sidebar_Route", payload: route }),
  };
};

export default connect(null, mapDispatchToProps)(UploadCT);
