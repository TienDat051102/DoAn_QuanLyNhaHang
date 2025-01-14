import React, { Component } from "react";
import { Button } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
import { UPDATE_DISCOUNTS } from "../../../store/actions";

const mapStateToProps = (state) => {
  return {
    propDiscounts: state.discountsReducer.discounts,
    propDiscountsCount: state.discountsReducer.discountsCount,
  };
};
const mapDispatchToProps =(dispatch)=>{
  return{
    UPDATE_DISCOUNTS: (payload)=>dispatch(UPDATE_DISCOUNTS(payload))
  };
}
class DiscountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.data?.id || null,
      code: props.data?.code || "",
      discountPercentage: this.props.data?.discount_percentage || null,
      maxDiscountAmount: props.data?.max_discount_amount || "",
      validFrom: props.data?.valid_from ? new Date(props.data.valid_from) : null,
      validTo: props.data?.valid_to ? new Date(props.data.valid_to) : null,
      isActive: props.data?.is_active || false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };


  handleSelectChange = (selectedOption) => {
    console.log('selectedOption',selectedOption)
    this.setState({ discountPercentage: selectedOption.value });
     
  };

  handleDateChange = (date, field) => {
    this.setState({ [field]: date });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
     let payload = this.state;
     await this.props.UPDATE_DISCOUNTS(payload);
     alert(this.props.data ? "Sửa thành công!" : "Thêm thành công!");
     this.props.onClose();
  };

  render() {
    console.log('props',this.props)
    const discountOptions = [
      { value: 10, label: "10%" },
      { value: 20, label: "20%" },
      { value: 30, label: "30%" },
      { value: 50, label: "50%" },
    ];

    const { code, discountPercentage, maxDiscountAmount, validFrom, validTo, isActive } = this.state;

    return (
      <div className="overlay">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Mã Giảm Giá</label>
              <input
                type="text"
                name="code"
                value={code}
                onChange={this.handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Giảm Giá (%)</label>
              <Select
                value={discountOptions.find((option) => option.value === discountPercentage)}
                onChange={this.handleSelectChange}
                options={discountOptions}
                className="select-input"
                placeholder="Chọn % giảm giá"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Số Tiền Giảm Tối Đa</label>
              <input
                type="number"
                name="maxDiscountAmount"
                value={maxDiscountAmount}
                onChange={this.handleChange}
                className="form-control"
                required
                min="0"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Ngày Bắt Đầu</label>
              <DatePicker
                selected={validFrom}
                onChange={(date) => this.handleDateChange(date, "validFrom")}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Ngày Kết Thúc</label>
              <DatePicker
                selected={validTo}
                onChange={(date) => this.handleDateChange(date, "validTo")}
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
                <option value="true">Kích Hoạt</option>
                <option value="false">Không Kích Hoạt</option>
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

export default connect(mapStateToProps,mapDispatchToProps) (DiscountForm);
