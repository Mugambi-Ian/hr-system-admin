import React, { Component } from "react";
import Loader from "../../../../assets/components/loader/loader";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import "./staff.css";
import getCroppedImg from "../../../../assets/resources/create-image/index";
import { _database, _storage, validField } from "../../../../config";
import { dateToday } from "../../../../assets/resources/date-handler";
import { Switch } from "@material-ui/core";
//import Switch from "react-switch";

var src = undefined;
export default class Staff extends Component {
  state = {
    users: [],
    editing: undefined,
    loading: true,
  };
  async componentDidMount() {
    this.db = _database.ref("users/");
    this.db.on("value", (ds) => {
      const _u = [];
      ds.child("data").forEach((x) => {
        const dt = x.val();
        dt.status = ds.child("active/" + x.key).val() ? true : false;
        _u.push(dt);
      });
      this.setState({ users: _u, loading: false });
    });
  }
  componentWillUnmount() {
    this.db.off();
  }

  staffCard(d, i) {
    return (
      <div className="card-item" key={i}>
        <img
          src={
            d.userDp
              ? d.userDp
              : require("../../../../assets/drawables/ic-staff.png").default
          }
          alt=""
          draggable={false}
          className="card-image unselectable"
        />
        <p className="card-name unselectable">{d.fullName}</p>
        <p className="card-desc unselectable">Added On: {d.createdOn}</p>
        <p className="card-desc unselectable">
          Email: {d.userName + "@mycompany.org"}
        </p>
        <p className="card-desc unselectable">Department: {d.department}</p>
        <p className="card-desc unselectable">Position: {d.position}</p>
        <p className="card-desc unselectable">Phone Number: {d.phoneNumber}</p>
        <div
          style={{
            height: "1px",
            backgroundColor: "#000",
            margin: "10px",
          }}
        />
        <div
          style={{
            display: "flex",
            marginRight: "20px",
            justifyContent: "center",
          }}
        >
          <p
            className="card-desc unselectable"
            style={{ flex: 1, alignSelf: "center" }}
          >
            Active Account
          </p>
          <Switch
            checked={d.status}
            onChange={(x) => {
              console.log(x);
              this.props.showUnTimedToast("Updating Policy");
              const x_ = this.state.users;
              if (x_[i].status === true) {
                this.db
                  .child("active/" + d.userName)
                  .set(null)
                  .then((x) => {
                    this.props.closeToast();
                  });
              } else {
                this.db
                  .child("active/" + d.userName)
                  .set(d.userName)
                  .then((x) => {
                    this.props.closeToast();
                  });
              }
             
            }}
          />
        </div>
        <div
          className="card-btn"
          onClick={async () => {
            await setTimeout(() => {
              src = d.userDp;
              this.setState({ editing: d.userName });
            }, 200);
          }}
        >
          <img
            src={require("../../../../assets/drawables/ic-edit.png").default}
            alt=""
            draggable={false}
            className="unselectable"
          />
          <p className="unselectable">Update</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="content-body">
        <div style={{ display: "flex", marginTop: "30px" }}>
          <p
            className=" title unselectable"
            style={{ margin: 0, marginLeft: "10px" }}
          >
            My Staff
          </p>
        </div>
        {this.state.loading === true ? (
          <Loader />
        ) : (
          <div className="content-list">
            {this.state.users.map((d, i) => {
              return this.staffCard(d, i);
            })}
          </div>
        )}
        <div
          className="new-btn"
          onClick={async () => {
            await setTimeout(() => {
              src = undefined;
              this.setState({ editing: "new" });
            }, 200);
          }}
        >
          <img
            className="unselectable"
            draggable={false}
            alt=""
            src={require("../../../../assets/drawables/ic-add.png").default}
          />
          <p className="unselectable">Add Staff</p>
        </div>
        {this.state.editing ? (
          <ManageStaff
            userId={this.state.editing}
            close={() => {
              this.setState({ editing: undefined });
            }}
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

class ManageStaff extends Component {
  state = {
    loading: false,
    user: {
      userId: undefined,
      userName: "",
      createdOn: "",
      fullName: "",
      dob: "",
      sex: "",
      department: "",
      phoneNumber: "",
      position: "",
    },
    uploadPic: undefined,
  };
  async componentDidMount() {
    var p = this.state.user;
    p.userId = this.props.userId;
    if (p.userId === "new") {
      p.createdOn = dateToday();
    }
    this.db = _database.ref();
    await this.db.child("users/data/" + p.userId).on("value", (ds) => {
      if (ds.hasChild("userId")) {
        const {
          userId,
          userName,
          createdOn,
          fullName,
          dob,
          sex,
          department,
          phoneNumber,
          position,
          userDp,
        } = ds.val();
        const p = {
          userId,
          userName,
          createdOn,
          fullName,
          dob,
          sex,
          department,
          phoneNumber,
          position,
          userDp,
        };
        this.setState({ user: p, loading: false });
      } else {
        this.setState({ user: p, loading: false });
      }
    });
  }
  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  async uploadDp() {
    this.setState({ loading: true });
    const id = new Date().getTime() + "_" + this.makeid(10);
    const uploadTask = _storage
      .ref("users/")
      .child(id + ".jpeg")
      .put(this.state.user.userDp);
    console.log(this.state.user);
    await uploadTask
      .on(
        "state_changed",
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(
              async function (downloadURL) {
                await setTimeout(() => {
                  var url = "" + downloadURL;
                  const p = this.state.user;
                  p.userDp = url;
                  this.setState({ product: p, uploadPic: undefined });
                  this.saveProduct();
                }, 1000);
              }.bind(this)
            )
            .catch(async (e) => {
              console.log(e);
            });
        }.bind(this)
      )
      .bind(this);
  }
  async saveProduct() {
    const {
      userId,
      userName,
      createdOn,
      fullName,
      dob,
      sex,
      department,
      phoneNumber,
      position,
      userDp,
    } = this.state.user;
    if (
      validField(userName) &&
      validField(fullName) &&
      validField(dob) &&
      validField(sex) &&
      validField(department) &&
      validField(position) &&
      validField(phoneNumber) &&
      validField(userDp)
    ) {
      await _database.ref("users/data/" + userName).once("value", async (x) => {
        await x.ref.child("userName").set(userName);
        await x.ref.child("userId").set(userId);
        await x.ref.child("userDp").set(userDp);
        await x.ref.child("dob").set(dob);
        await x.ref.child("department").set(department);
        await x.ref.child("phoneNumber").set(phoneNumber);
        await x.ref.child("sex").set(sex);
        await x.ref.child("fullName").set(fullName);
        await x.ref.child("position").set(position);
        await x.ref.child("createdOn").set(createdOn);
      });
      await _database.ref("users/active/" + userName).set(userName);
      this.props.showTimedToast("Save Successfull");
      this.setState({ loading: false });
      this.props.close();
    } else {
      this.props.showTimedToast("All fields are required");
    }
  }
  render() {
    return (
      <div className={this.state.close ? "edit-body close" : "edit-body"}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {this.state.loading === true ? (
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "100px",
                display: "flex",
                width: "100px",
                height: "100px",
                alignSelf: "center",
              }}
            >
              <Loader />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="content-panel">
          {this.state.user.userId ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                marginTop: "10px",
                marginRight: "10px",
                marginLeft: "10px",
                animation:
                  "fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
              }}
            >
              <p className="card-title unselectable">Add Staff</p>
              <ImageUploader
                src={() => {
                  return this.state.user.userDp === ""
                    ? require("../../../../assets/drawables/ic-home.png")
                        .default
                    : this.state.user.userDp;
                }}
                hideField={() => {
                  this.setState({ hideField: true });
                }}
                showField={() => {
                  this.setState({ hideField: undefined });
                }}
                updateValue={(x) => {
                  fetch(x)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const p = this.state.user;
                      p.userDp = blob;
                      this.setState({ product: p, uploadPic: true });
                    });
                }}
              />
              {this.state.hideField ? (
                ""
              ) : (
                <div className="field">
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-email.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Email </p>
                    <input
                      value={this.state.user.userName}
                      onChange={(e) => {
                        this.setState({
                          user: {
                            ...this.state.user,
                            userName: e.target.value,
                          },
                        });
                      }}
                      placeholder="johndoe"
                      style={{ width: "90px" }}
                    />
                    <p
                      className="field-title unselectable"
                      style={{
                        width: "min-content",
                        marginRight: "20px",
                        marginLeft: 0,
                      }}
                    >
                      @mycompany.org
                    </p>
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-name.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Full Name </p>
                    <input
                      value={this.state.user.fullName}
                      onChange={(e) => {
                        this.setState({
                          user: {
                            ...this.state.user,
                            fullName: e.target.value,
                          },
                        });
                      }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-phone.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Phone Number</p>
                    <input
                      value={this.state.user.phoneNumber}
                      onChange={(e) => {
                        this.setState({
                          user: {
                            ...this.state.user,
                            phoneNumber: e.target.value,
                          },
                        });
                      }}
                      placeholder="+1 650-555-3434"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-calendar.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Date Of Birth </p>
                    <input
                      value={this.state.user.dob}
                      onChange={(e) => {
                        this.setState({
                          user: {
                            ...this.state.user,
                            dob: e.target.value,
                          },
                        });
                      }}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-gender.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Gender</p>
                    <div
                      className={
                        this.state.user.sex
                          ? this.state.user.sex === "male"
                            ? "field-btn on"
                            : "field-btn"
                          : "field-btn"
                      }
                      style={{ flex: 1 }}
                      onClick={async () => {
                        await setTimeout(async () => {
                          this.setState({
                            user: { ...this.state.user, sex: "male" },
                          });
                        }, 100);
                      }}
                    >
                      <img
                        src={
                          require("../../../../assets/drawables/ic-male.png")
                            .default
                        }
                        alt=""
                        draggable={false}
                        className="unselectable"
                      />
                      <p className="unselectable">Male</p>
                    </div>
                    <div
                      className={
                        this.state.user.sex
                          ? this.state.user.sex === "female"
                            ? "field-btn on"
                            : "field-btn"
                          : "field-btn"
                      }
                      style={{ flex: 1 }}
                      onClick={async () => {
                        await setTimeout(async () => {
                          this.setState({
                            user: { ...this.state.user, sex: "female" },
                          });
                        }, 100);
                      }}
                    >
                      <img
                        src={
                          require("../../../../assets/drawables/ic-female.png")
                            .default
                        }
                        alt=""
                        draggable={false}
                        className="unselectable"
                      />
                      <p className="unselectable">Female</p>
                    </div>
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-department.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Department</p>
                    <input
                      value={this.state.user.department}
                      onChange={(e) => {
                        this.setState({
                          user: {
                            ...this.state.user,
                            department: e.target.value,
                          },
                        });
                      }}
                      placeholder="Department"
                    />
                  </div>
                  <div className="field-input">
                    <img
                      alt=""
                      src={
                        require("../../../../assets/drawables/ic-position.png")
                          .default
                      }
                      className="unselectable"
                    />
                    <p className="field-title">Position</p>
                    <input
                      value={this.state.user.position}
                      onChange={(e) => {
                        this.setState({
                          user: {
                            ...this.state.user,
                            position: e.target.value,
                          },
                        });
                      }}
                      placeholder="Junior"
                    />
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  width: "280px",
                  alignSelf: "center",
                  maxHeight: "40px",
                }}
              >
                <div
                  className="card-btn"
                  style={{ flex: 1 }}
                  onClick={async () => {
                    await setTimeout(async () => {
                      if (this.state.uploadPic) {
                        await this.uploadDp();
                      } else {
                        await this.saveProduct();
                      }
                    }, 100);
                  }}
                >
                  <img
                    src={
                      require("../../../../assets/drawables/ic-save.png")
                        .default
                    }
                    alt=""
                    draggable={false}
                    className="unselectable"
                  />
                  <p className="unselectable">Save</p>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={
                require("../../../../assets/drawables/ic-projects.png").default
              }
              alt=""
              className="unselectable"
              style={{
                alignSelf: "center",
                width: "200px",
                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div
          className="close-editing-btn"
          onClick={async () => {
            this.setState({ close: true });
            await setTimeout(() => {
              this.props.close();
            }, 400);
          }}
        >
          <img
            className="unselectable"
            draggable={false}
            alt=""
            src={require("../../../../assets/drawables/ic-exit.png").default}
          />
          <p className="unselectable">Close</p>
        </div>
      </div>
    );
  }
}

export const ImageUploader = (props) => {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [updated, setUpdated] = React.useState(false);
  const [image, setImage] = React.useState(undefined);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [cropped, setCropped] = React.useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const aspect = 1 / 1;

  function onCropChange(crop) {
    setCrop(crop);
  }

  const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  function onZoomChange(zoom) {
    setZoom(zoom);
  }
  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        src = undefined;
        current.src = e.target.result;
        setUpdated(true);
        setImage(e.target.result);
        setCropped(false);
        props.hideField();
      };
      reader.readAsDataURL(file);
    }
  };
  const showCroppedImage = React.useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      props.updateValue(croppedImage);
      setImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, image, props]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={imageUploader}
        style={{
          display: "none",
        }}
      />
      {updated === false && src === undefined ? (
        <div className="upload-img">
          <p className="unselectable">Click to Add Image</p>
          <img
            ref={uploadedImage}
            onClick={() => imageUploader.current.click()}
            alt="card-Logo"
            src={require("../../../../assets/drawables/ic-picture.png").default}
          />
        </div>
      ) : cropped === false && src === undefined ? (
        <div className="crop-image-body">
          <div className="crop-container">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
            />
          </div>
          <div className="controls">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => onZoomChange(zoom)}
              classes={{ container: "slider" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              position: "fixed",
              bottom: "10vh",
              width: "280px",
              alignSelf: "center",
              maxHeight: "40px",
            }}
          >
            <div
              className="card-btn"
              style={{ flex: 1 }}
              onClick={async () => {
                await setTimeout(() => {
                  setCropped(false);
                  setImage(undefined);
                  setUpdated(false);
                  props.showField();
                }, 100);
              }}
            >
              <img
                src={
                  require("../../../../assets/drawables/ic-close.png").default
                }
                alt=""
                draggable={false}
                className="unselectable"
              />
              <p className="unselectable">Cancel</p>
            </div>
            <div
              className="card-btn"
              style={{ flex: 1 }}
              onClick={async () => {
                await showCroppedImage();
                await setTimeout(() => {
                  setCropped(true);
                  setUpdated(true);
                  props.showField();
                }, 100);
              }}
            >
              <img
                src={
                  require("../../../../assets/drawables/ic-crop.png").default
                }
                alt=""
                draggable={false}
                className="unselectable"
              />
              <p className="unselectable">Crop</p>
            </div>
          </div>
        </div>
      ) : (
        <img
          ref={uploadedImage}
          alt=""
          className="img-upload unselectable"
          draggable={false}
          src={image !== undefined ? image : props.src()}
          onClick={async () => {
            await setTimeout(() => {
              imageUploader.current.click();
            }, 100);
          }}
        />
      )}
    </div>
  );
};
