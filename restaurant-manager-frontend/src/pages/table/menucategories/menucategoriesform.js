import React, { Component } from "react";
import { Button } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { UPDATE_MENUCATEGORIES } from "../../../store/actions";

const mapStateToProps = (state) => {
  return {
    propMessage: state.menucategoriesReducer.message,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    UPDATE_MENUCATEGORIES: (payload) =>
      dispatch(UPDATE_MENUCATEGORIES(payload)),
  };
};
class MenuCategoriesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.data?.name || "",
    };
  }

  handleInputChange = (event) => {
    const { value } = event.target;
    this.setState({ name: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name } = this.state;
    const { type } = this.props;
    if (type === "create") {
      const payload = {
        name: name,
      };
      await this.props.UPDATE_MENUCATEGORIES(payload);
    } else {
      const payload = {
        id: this.props.data.id,
        name: name,
      };
      await this.props.UPDATE_MENUCATEGORIES(payload);
    }
    this.props.onClose();
  };

  render() {
    const { name } = this.state;
    const { data, type, onClose } = this.props;
    return (
      <div className="overlay">
        <div className="form-container">
          <form>
            <div className="form-group">
              <label>Tên danh mục:</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={this.handleInputChange}
                className="form-control"
                placeholder="Nhập tên danh mục"
              />
            </div>

            {type !== "create" && data?.menuitems && (
              <div className="form-group">
                <label>Danh sách món ăn :</label>
                <ul className="list-group">
                  {data.menuitems.split(", ").map((item, index) => (
                    <li key={index} className="list-group-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <br />
            <div className="button-group">
              <Button type="submit" color="success" onClick={this.handleSubmit}>
                {this.props.data ? "Lưu" : "Thêm"}
              </Button>
              <Button
                style={{ marginLeft: "15px" }}
                type="button"
                color="danger"
                onClick={onClose}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuCategoriesForm);
