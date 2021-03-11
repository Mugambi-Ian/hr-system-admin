import React, { Component } from "react";
import "./app-home.css";
import Staff from "./staff/staff";

export default class Home extends Component {
  state = {
    activeScreen: "home",
  };
  render() {
    return (
      <div className="main-app">
        <div className="nav-bar">
          <div
            className={
              this.state.activeScreen !== "home"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "home") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "home",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-home.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Home</p>
          </div>
          <div
            className={
              this.state.activeScreen !== "staff"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "staff") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "staff",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-staff.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Staff</p>
          </div>
          <div
            className={
              this.state.activeScreen !== "projects"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "projects") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "projects",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-projects.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Projects</p>
          </div>

          <div
            style={{
              height: "1px",
              marginLeft: "30px",
              marginRight: "30px",
              backgroundColor: "#000",
              marginTop: "10px",
            }}
          />
          <div
            className={
              this.state.activeScreen !== "assesment"
                ? "nav-item"
                : "nav-item active"
            }
            onClick={async () => {
              if (this.state.activeScreen !== "assesment") {
                this.setState({ activeScreen: "" });
                await setTimeout(() => {
                  this.setState({
                    activeScreen: "assesment",
                  });
                }, 100);
              }
            }}
          >
            <img
              src={require("../../../assets/drawables/ic-analysis.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Analysis</p>
          </div>
          <div
            style={{
              height: "1px",
              marginLeft: "30px",
              marginRight: "30px",
              backgroundColor: "#000",
              marginTop: "10px",
            }}
          />
          <div className="nav-item" onClick={async () => {}}>
            <img
              src={require("../../../assets/drawables/ic-exit.png").default}
              className="unselectable"
              draggable={false}
              alt="icon"
            />
            <p className="unselectable">Exit</p>
          </div>
          <img
            className="logo unselectable"
            draggable={false}
            alt="logo"
            src={require("../../../assets/drawables/logo.png").default}
          />
          <img
            className="icon unselectable"
            draggable={false}
            alt="logo"
            src={require("../../../assets/drawables/icon.png").default}
          />
        </div>
        <div className="app-content">
          {this.state.activeScreen === "home" ? (
            ""
          ) : this.state.activeScreen === "staff" ? (
            <Staff
              closeToast={this.props.closeToast}
              showTimedToast={this.props.showTimedToast}
              showUnTimedToast={this.props.showUnTimedToast}
            />
          ) : (
            <div style={{ flex: 1 }} />
          )}
        </div>
      </div>
    );
  }
}
