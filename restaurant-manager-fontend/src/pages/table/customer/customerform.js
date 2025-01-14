import React, { Component } from "react";
import { Button } from "reactstrap";

import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { UPDATE_CUSTOMER } from "../../../store/actions/customer.action";

const mapStateToProps = (state) => {
  return {
    propMessage: state.customerReducer.message,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    UPDATE_CUSTOMER: (payload) => dispatch(UPDATE_CUSTOMER(payload)),
  };
};
class CustomersForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.data?.id || null,
      name: props.data?.name || "",
      email: this.props.data?.email || "",
      phone_number: props.data?.phone_number || "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let payload = this.state;
    await this.props.UPDATE_CUSTOMER(payload);
    alert(this.props.propMessage);
    this.props.onClose();
  };

  render() {
    const { name, email, phone_number } = this.state;

    return (
      <div className="overlay">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Tên Khách Hàng</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Địa Chỉ Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Liên Lạc</label>
              <input
                type="tel"
                name="phone_number"
                value={phone_number}
                onChange={(e) => {
                    const rawValue = e.target.value.replace(/-/g, ""); 
                    if (/^\d{0,10}$/.test(rawValue)) { 
                      this.setState({ phone_number: rawValue });
                    }
                  }}
              
                className="form-control"
                pattern="([0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{10})"
                placeholder="123-456-7890 hoặc 0123456789"
                title="Vui lòng nhập số điện thoại theo định dạng 123-456-7890 hoặc 0123456789"
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomersForm);
