import React, { Component } from "react";
import { Button } from "reactstrap";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { UPDATE_USERS } from "../../../store/actions";

const mapStateToProps = (state) => {
  return {
    propUsres: state.usersReducer.users,
    propUsersCount: state.usersReducer.usersCount,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
     UPDATE_USERS: (payload)=>dispatch(UPDATE_USERS(payload))
  };
};
class UsersForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.data?.id || null,
      username: props.data?.username || "",
      email: props.data?.email || "",
      role: props.data?.role || "Nhân Viên",
      firstName: props.data?.first_name || "",
      lastName: props.data?.last_name || "",
      password: "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSelectChange = (selectedOption) => {
    this.setState({ role: selectedOption.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let payload = this.state;
    const kiemtra = await this.props.UPDATE_USERS(payload);
    if(kiemtra){
      alert(this.props.data ? "Sửa thành công!" : "Thêm thành công!");
      this.props.onClose();
    }
     else{
      alert(this.props.data ? "Sửa dữ liệu không thành công" : "Thêm dữ liệu không thành công");
      this.props.onClose();
     }

  };

  render() {
    const usersOptions = [
      { value: "admin", label: "Quản lý" },
      { value: "staff", label: "Nhân viên" },
    ];

    const { username, email, role, firstName, lastName, password } = this.state;

    return (
      <div className="overlay">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">UserName</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
                className="form-control"
                required
                disabled={this.props.type === "edit"}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Quyền</label>
              <Select
                value={usersOptions.find((option) => option.value === role)}
                onChange={this.handleSelectChange}
                options={usersOptions}
                className="select-input"
                placeholder="Chọn quyền của account"
              />
            </div>
            
            {this.props.type === "create" ? (
              <div className="mb-3 text-start">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  className="form-control"
                  required
                />
              </div>
            ) : null}

            <div className="mb-3 text-start">
              <label className="form-label">Họ</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={this.handleChange}
                className="form-control"
                required
              />
            </div>


            <div className="mb-3 text-start">
              <label className="form-label">Tên</label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={this.handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="button-group">
              <Button type="submit" color="success">
                {this.props.data ? "Lưu" : "Thêm"}
              </Button>
              <Button type="button" color="danger" onClick={this.props.onClose}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersForm);
