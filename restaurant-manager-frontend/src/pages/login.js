import React, { useState } from "react";
import axios from "axios";
import Head from "../components/Head";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        {
          username,
          password,
        }
      );
      const expireTime = new Date().getTime() + 60 * 60 * 1000;
      if (response.data.token) {
        // localStorage.setItem('token', JSON.stringify(response.data.token));
        // localStorage.setItem('user', JSON.stringify(response.data.data));
        onLoginSuccess &&
          onLoginSuccess(response.data.token, response.data.data);
        localStorage.setItem("expireTime", expireTime);
        setMessage("Đăng nhập thành công!");
        navigate("/admin");
      } else {
        setError(response.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };
  const closeModal = () => {
    setShowForm(false);
  };
  const sentRequest = async () => {
    if (!email) {
      alert('Vui lòng nhập email!');
      return;
    }
    else{
      try{
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/forgotpassword`,
          {
            email,
          }
        );
        alert(response.data.message);
        closeModal()
      }
      catch(e){
        alert('không thể kết nối đến server vui lòng thử lại!')
      }
    }
  };
  return (
    <>
      <Head />
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-4">
                    <a
                      href="index.html"
                      className="logo d-flex align-items-center w-auto"
                    >
                      <img src="assets/img/logo.png" alt="Logo" />
                      <span className="d-none d-lg-block">Quản trị viên</span>
                    </a>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">
                          Đăng Nhập Tài Khoản Của Bạn
                        </h5>
                        <p className="text-center small">
                          Nhập tên tài khoản và mật khẩu để đăng nhập
                        </p>
                      </div>

                      <form
                        onSubmit={handleLogin}
                        method="post"
                        className="row g-3 needs-validation"
                        noValidate
                      >
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">
                            Tên đăng nhập
                          </label>
                          <div className="input-group has-validation">
                            <span
                              className="input-group-text"
                              id="inputGroupPrepend"
                            >
                              @
                            </span>
                            <input
                              value={username}
                              type="text"
                              name="username"
                              className="form-control"
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                            <div className="invalid-feedback">
                              Vui lòng nhập tên đăng nhập.
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            value={password}
                            name="password"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <div className="invalid-feedback">
                            Vui lòng nhập mật khẩu!
                          </div>
                        </div>

                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? "Đang đăng nhập..." : "Login"}
                          </button>
                        </div>

                        <div className="col-12">
                          <p className="small mb-0">
                            Bạn không có tài khoản?{" "}
                            <Link to="/register">Tạo một tài khoản</Link>
                          </p>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0">
                            Bạn đã có tài khoản{" "}
                            <Link onClick={(e) => setShowForm(true)}>
                              Quên tài khoản
                            </Link>
                          </p>
                        </div>
                      </form>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      {message && <p style={{ color: "green" }}>{message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Modal show={showForm}>
        <Modal.Header>
          <Modal.Title>Quên Mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12">
            <label htmlFor="yourPassword" className="form-label">
              Nhập email của của bạn
            </label>
            <input
              type="email"
              value={email}
              name="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="invalid-feedback">Vui lòng nhập email!</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Đóng
          </Button>
          <Button variant="success" onClick={sentRequest}>
            Gửi yêu cầu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;
