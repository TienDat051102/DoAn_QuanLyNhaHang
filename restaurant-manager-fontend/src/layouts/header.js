import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Changpassword from "../pages/changpassword";
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      showChangPassword: false,
    };
  }
  getStoredUser() {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }
  toggleDropdown = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  setShowChangPassword() {
    this.setState({
      showChangPassword: true,
    });
  }

  handleCloseForm = () => {
    this.setState({ showChangPassword: false });
    // this.componentDidMount();
  };

  render() {
    const { handleLogout } = this.props;
    const { dropdownOpen, showChangPassword } = this.state;
    const storedUser = this.getStoredUser();
    console.log("showChangPassword", showChangPassword);
    return (
      <>
        <header
          id="header"
          className="header fixed-top d-flex align-items-center"
        >
          <div className="d-flex align-items-center justify-content-between">
            <a href="index.html" className="logo d-flex align-items-center">
              <img src="assets/img/logo.png" alt="" />
              <span className="d-none d-lg-block">NiceAdmin</span>
            </a>
            <i className="bi bi-list toggle-sidebar-btn"></i>
          </div>

          <div className="search-bar">
            <form
              className="search-form d-flex align-items-center"
              method="POST"
              action="#"
            >
              <input
                type="text"
                name="query"
                placeholder="Search"
                title="Enter search keyword"
              />
              <button type="submit" title="Search">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
              <li className="nav-item d-block d-lg-none">
                <a className="nav-link nav-icon search-bar-toggle " href="#">
                  <i className="bi bi-search"></i>
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link nav-icon"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-bell"></i>
                  <span className="badge bg-primary badge-number">4</span>
                </a>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                  <li className="dropdown-header">
                    You have 4 new notifications
                    <a href="#">
                      <span className="badge rounded-pill bg-primary p-2 ms-2">
                        View all
                      </span>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="notification-item">
                    <i className="bi bi-exclamation-circle text-warning"></i>
                    <div>
                      <h4>Lorem Ipsum</h4>
                      <p>Quae dolorem earum veritatis oditseno</p>
                      <p>30 min. ago</p>
                    </div>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="notification-item">
                    <i className="bi bi-x-circle text-danger"></i>
                    <div>
                      <h4>Atque rerum nesciunt</h4>
                      <p>Quae dolorem earum veritatis oditseno</p>
                      <p>1 hr. ago</p>
                    </div>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="notification-item">
                    <i className="bi bi-check-circle text-success"></i>
                    <div>
                      <h4>Sit rerum fuga</h4>
                      <p>Quae dolorem earum veritatis oditseno</p>
                      <p>2 hrs. ago</p>
                    </div>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="notification-item">
                    <i className="bi bi-info-circle text-primary"></i>
                    <div>
                      <h4>Dicta reprehenderit</h4>
                      <p>Quae dolorem earum veritatis oditseno</p>
                      <p>4 hrs. ago</p>
                    </div>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="dropdown-footer">
                    <a href="#">Show all notifications</a>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link nav-icon"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-chat-left-text"></i>
                  <span className="badge bg-success badge-number">3</span>
                </a>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                  <li className="dropdown-header">
                    You have 3 new messages
                    <a href="#">
                      <span className="badge rounded-pill bg-primary p-2 ms-2">
                        View all
                      </span>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="message-item">
                    <a href="#">
                      <img
                        src="assets/img/messages-1.jpg"
                        alt=""
                        className="rounded-circle"
                      />
                      <div>
                        <h4>Maria Hudson</h4>
                        <p>
                          Velit asperiores et ducimus soluta repudiandae labore
                          officia est ut...
                        </p>
                        <p>4 hrs. ago</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="message-item">
                    <a href="#">
                      <img
                        src="assets/img/messages-2.jpg"
                        alt=""
                        className="rounded-circle"
                      />
                      <div>
                        <h4>Anna Nelson</h4>
                        <p>
                          Velit asperiores et ducimus soluta repudiandae labore
                          officia est ut...
                        </p>
                        <p>6 hrs. ago</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="message-item">
                    <a href="#">
                      <img
                        src="assets/img/messages-3.jpg"
                        alt=""
                        className="rounded-circle"
                      />
                      <div>
                        <h4>David Muldon</h4>
                        <p>
                          Velit asperiores et ducimus soluta repudiandae labore
                          officia est ut...
                        </p>
                        <p>8 hrs. ago</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li className="dropdown-footer">
                    <a href="#">Show all messages</a>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown pe-3">
                <a
                  className="nav-link nav-profile d-flex align-items-center pe-0"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.toggleDropdown();
                  }}
                  aria-expanded={dropdownOpen ? "true" : "false"}
                >
                  <span className="d-none d-md-block dropdown-toggle ps-2">
                    {storedUser.username}
                  </span>
                </a>
                <ul
                  className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${
                    dropdownOpen ? "show" : ""
                  }`}
                  style={{
                    position: dropdownOpen ? "absolute" : "",
                    inset: dropdownOpen ? "0px 0px auto auto" : "",
                    margin: dropdownOpen ? "0px" : "",
                    transform: dropdownOpen ? "translate(-16px, 38px)" : "",
                  }}
                >
                  <li className="dropdown-header">
                    <h6>
                      {storedUser.first_name + " " + storedUser.last_name}
                    </h6>
                    <span>{storedUser.role}</span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="users-profile.html"
                    >
                      <i className="bi bi-person"></i>
                      <span>Thông tin của tôi</span>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setShowChangPassword();
                      }}
                    >
                      <i className="bi bi-gear"></i>
                      <span>Thay đổi mật khẩu</span>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="pages-faq.html"
                    >
                      <i className="bi bi-question-circle"></i>
                      <span>Need Help?</span>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span onClick={handleLogout}>Đăng xuất</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </header>

        <Modal show={showChangPassword} onHide={this.handleCloseForm}>
         
  
            <Changpassword
              onClose={this.handleCloseForm}
            />
   
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
