import React, { Component } from "react";
import { connect } from "react-redux";
import Head from '../components/Head';
import { Link } from "react-router-dom";
import { CREATE_USERS } from "../store/actions";

const mapStateToProps = (state) => {
  return {
   propMessage: state.usersReducer.message
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    CREATE_USERS: (payload) => dispatch(CREATE_USERS(payload)),
  };
};
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        email: "",
        username: "",
        password: "",
        acceptTerms: false,
        message: "", 
        error: "",
    }
  }
  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({ [name]: type === "checkbox" ? checked : value });
  };
  handleSubmit = async (e) => {
    e.preventDefault(); 

    const { name, email, username, password, acceptTerms } = this.state;

    if (!acceptTerms) {
      this.setState({ message: "Bạn phải đồng ý điều khoản!" });
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{6,}$/;

    if (!acceptTerms) {
      this.setState({ error: 'Bạn phải đồng ý với các điều khoản trước khi tạo tài khoản!' });
      return;
    }
  
    if (!passwordRegex.test(password)) {
      this.setState({
        error:
          'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt.',
      });
      return;
    }
    this.setState({ error: '' }); 
    try {
      const payload = {
        first_name: name,
        email,
        username,
        password,
      }
      await this.props.CREATE_USERS(payload)
      this.setState({ message: this.props.propMessage });
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      this.setState({
        message: "Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại.",
      });
    }
  };
  render() {
    const { name, email, username, password, acceptTerms, message,error } = this.state;
    return (
      <>
        <Head />
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-4">
                    <a href="/" className="logo d-flex align-items-center w-auto">
                      <img src="assets/img/logo.png" alt="" />
                      <span className="d-none d-lg-block">Quản Trị Viên</span>
                    </a>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Tạo Tài Khoản</h5>
                        <p className="text-center small">Nhập thông tin cá nhân của bạn để tạo tài khoản</p>
                      </div>

                      {/* Hiển thị thông báo */}
                      {message && (
                        <div className="alert alert-info text-center" role="alert">
                          {message}
                        </div>
                      )}
                        {error && <div className="alert alert-danger">{error}</div>}
                      <form className="row g-3 needs-validation" onSubmit={this.handleSubmit}>
                        <div className="col-12">
                          <label htmlFor="yourName" className="form-label">Tên Của Bạn</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            id="yourName"
                            value={name}
                            onChange={this.handleChange}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourEmail" className="form-label">Email Của Bạn</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            id="yourEmail"
                            value={email}
                            onChange={this.handleChange}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">Tên Đăng Nhập</label>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            id="yourUsername"
                            value={username}
                            onChange={this.handleChange}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">Mật Khẩu</label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="yourPassword"
                            value={password}
                            onChange={this.handleChange}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              name="acceptTerms"
                              type="checkbox"
                              id="acceptTerms"
                              checked={acceptTerms}
                              onChange={this.handleChange}
                              required
                            />
                            <label className="form-check-label" htmlFor="acceptTerms">
                              Tôi sẽ chịu trách nhiệm với thông tin trên
                            </label>
                          </div>
                        </div>

                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit">Tạo Tài Khoản</button>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0">
                            Đã có tài khoản? <Link to="/">Đăng Nhập</Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="credits">
                    <a>Xin Chân Thành Cảm Ơn</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Register)