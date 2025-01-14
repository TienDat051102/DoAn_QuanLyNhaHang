import React, { Component } from "react";
import { Button } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { UPDATE_INGREDIENTS } from "../../../store/actions/ingredients.action";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    UPDATE_INGREDIENTS: (payload) => dispatch(UPDATE_INGREDIENTS(payload)),
  };
};

const allUnitOptions = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "piece", label: "Piece (pcs)" },
];

const unitOptions = {
  kg: [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
  ],
  g: [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
  ],
  liters: [
    { value: "liters", label: "Liters (L)" },
    { value: "ml", label: "Milliliters (ml)" },
  ],
  ml: [
    { value: "liters", label: "Liters (L)" },
    { value: "ml", label: "Milliliters (ml)" },
  ],
  piece: [{ value: "piece", label: "Piece (pcs)" }],
};

class IngredientsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.data?.id || null,
      name: props.data?.name || "",
      quantity: props.data?.quantity || 0,
      unit: props.data?.unit || "kg",
      isActive: props.data?.is_active === 'Hoạt Động' ? true : false,
      expiration_date: props.data?.expiration_date || "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let payload = this.state;
    await this.props.UPDATE_INGREDIENTS(payload);
    alert(this.props.data ? "Sửa thành công!" : "Thêm thành công!");
    this.props.onClose();
  };

  handleDateChange = (date, field) => {
    this.setState({ [field]: date });
  };

  handleSelectChange = (selectedOption) => {
    this.setState({ unit: selectedOption.value });
  };

  render() {
    const { name, quantity, unit, expiration_date, isActive } = this.state;
    console.log('isActive',isActive)
    const isEdit = !!this.props.data;

    return (
      <div className="overlay">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Tên Nguyên Liệu</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Số Lượng Hiện Còn</label>
              <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={(e) => this.setState({ quantity: e.target.value })}
                className="form-control"
                required
                min="0"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Đơn Vị</label>
              <Select
                value={
                  isEdit
                    ? unitOptions[unit]?.find((option) => option.value === unit)
                    : allUnitOptions.find((option) => option.value === unit)
                }
                onChange={this.handleSelectChange}
                options={isEdit ? unitOptions[unit] : allUnitOptions}
                className="select-input"
                placeholder="Chọn đơn vị"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Ngày Hết Hạn</label>
              <DatePicker
                selected={expiration_date}
                onChange={(date) => this.handleDateChange(date, "expiration_date")}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Trạng Thái</label>
              <select
                name="isActive"
                value={isActive ? "true" : "false"}
                onChange={(e) => this.setState({ isActive: e.target.value === "true" })}
                className="form-control"
              >
                <option value="true">Hoạt Động</option>
                <option value="false">Không Hoạt Động</option>
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

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsForm);
