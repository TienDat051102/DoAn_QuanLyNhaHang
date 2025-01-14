import React, { Component } from "react";
import { Button } from "reactstrap";

import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
import { UPDATE_TABLE } from "../../../store/actions";


const mapStateToProps = (state) => {
  return {
    propMessage: state.tableReducer.message
  };
};
const mapDispatchToProps =(dispatch)=>{
  return{
    UPDATE_TABLE: (payload) => dispatch(UPDATE_TABLE(payload))
  };
}
class TablesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.data?.id || null,
      name: props.data?.name || "",
      capacity: this.props.data?.capacity || 1,
      location: props.data?.location || "",
      is_available: props.data?.is_available === 'Đang rảnh'? true : false
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
     let payload = this.state;
     await this.props.UPDATE_TABLE(payload)
     alert(this.props.data ? "Sửa bàn thành công!" : "Thêm bàn thành công!");
     this.props.onClose();
  };

  render() {
    const { name, capacity, location, is_available} = this.state;
    console.log('is_available',is_available)
    return (
      <div className="overlay">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Tên Bàn</label>
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
              <label className="form-label">Số Lượng Người Có Thể Chứa</label>
              <input
                type="number"
                name="capacity"
                value={capacity}
                onChange={this.handleChange}
                className="form-control"
                required
                min={1}
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Vị Trí</label>
              <input
                type="text"
                name="location"
                value={location}
                onChange={this.handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Trạng Thái</label>
              <select
                name="is_available"
                value={is_available ? "true" : "false"}
                onChange={(e) => this.setState({ is_available: e.target.value === "true" })}
                className="form-control"
              >
                <option value="true">Đang Rảnh</option>
                <option value="false">Không Rảnh</option>
              </select>
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

export default connect(mapStateToProps,mapDispatchToProps) (TablesForm);
