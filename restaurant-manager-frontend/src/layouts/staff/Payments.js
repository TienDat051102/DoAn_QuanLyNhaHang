import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { GET_ACTIVE_DISCOUNTS } from "../../store/actions/discounts.action";
import { GET_ORDERS_ID } from "../../store/actions/orders.action";
import { CREATE_PAYMENTS } from "../../store/actions/payments.action";
import { GET_MENUITEMS } from "../../store/actions/menuitems.action";
import { GET_CUSTOMER } from "../../store/actions/customer.action";
import axios from "axios";

// const mapStateToProps = (state) => {
//   return {
//
//   };
// };

const mapStateToProps = (state) => {
  return {
    propMessage: state.paymentsReducer.message,
    propDiscounts: state.discountsReducer.discounts,
    propOrder: state.ordersReducer.order,
    propMenuItem: state.menuitemsReducer.menuitems,
    propCustomer: state.customerReducer.customers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_ACTIVE_DISCOUNTS: () => dispatch(GET_ACTIVE_DISCOUNTS()),
    GET_ORDERS_ID: (id) => dispatch(GET_ORDERS_ID(id)),
    CREATE_PAYMENTS: (payload) => dispatch(CREATE_PAYMENTS(payload)),
    GET_MENUITEMS: () => dispatch(GET_MENUITEMS()),
    GET_CUSTOMER: (payload) => dispatch(GET_CUSTOMER(payload)),
  };
};

class PayMents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listdiscount: [],
      customerPhone: "",
      customerInfo: [],
      discountCode: "",
      discountAmount: 0,
      currentDate: new Date().toLocaleString(),
      selectedPaymentMethod: "cash",
      id: props.data || null,
      orderItem: [],
      menuItem: [],
      cartItems: [],
      totalAmount: 0,
      transaction_id: null,
      onClose: props.onClose,
    };
  }
  async componentDidMount() {
    try {
      await Promise.all([
        this.props.GET_ORDERS_ID(this.state.id),
        this.props.GET_ACTIVE_DISCOUNTS(),
        this.props.GET_MENUITEMS(),
      ]);

      this.setState({
        listdiscount: this.props.propDiscounts || [],
        orderItem: this.props.propOrder || [],
        menuItem: this.props.propMenuItem || [],
      });
      if (this.props.propOrder?.orderItems?.length) {
        const cartItem = this.props.propOrder.orderItems.flatMap((orderItem) =>
          orderItem.menu_items.map((menuItem) => {
            const menuItemDetails = this.props.propMenuItem.find(
              (item) => item.id === menuItem.id
            );
            return {
              id: menuItem.id,
              name: menuItemDetails?.name || "Unknown",
              quantity: menuItem.quantity,
              price: parseInt(menuItemDetails?.price || 0, 10),
            };
          })
        );
      
        const totalAmount = cartItem.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      
        this.setState({ cartItems: cartItem, totalAmount });
      } else {
        console.error("orderItems trống hoặc không xác định");
      }
    } catch (error) {
      console.error("Lỗi trong thành phần DidMount:", error);
    }
  }

  handlePhoneChange = async (e) => {
    let phone = e.target.value.replace(/\D/g, "");
    this.setState({ customerPhone: phone });

    if (phone.length === 10) {
      try {
        await this.props.GET_CUSTOMER({ phone_number: phone });
        const customers = this.props.propCustomer;
        this.setState({ customerInfo: customers?.length ? customers : [] });
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    } else {
      this.setState({ errorMessage: "Vui lòng nhập đủ 10 số điện thoại." });
    }
  };

  handleDiscountChange = (e) => {
    const code = e.target.value;
    const { listdiscount, totalAmount } = this.state;

    const discount = this.validateDiscountCode(code, listdiscount);

    if (discount) {
      const discountValue = Math.min(
        (totalAmount * discount.discount_percentage) / 100,
        discount.max_discount_amount
      );

      this.setState({ discountCode: code, discountAmount: discountValue });
    } else {
      this.setState({ discountCode: code, discountAmount: 0 });
    }
  };

  validateDiscountCode(code, discounts) {
    return discounts.find(
      (item) =>
        item.code === code &&
        item.is_active &&
        new Date(item.valid_from) <= new Date() &&
        new Date(item.valid_to) >= new Date()
    );
  }

  handlePaymentChange = (event) => {
    this.setState({ selectedPaymentMethod: event.target.value });
  };

  handlePrintInvoice = async () => {
    const {
      orderItem,
      customerInfo,
      cartItems,
      selectedPaymentMethod,
      totalAmount,
      discountAmount,
      transaction_id,
    } = this.state;
    const invoiceData = {
      invoiceCode: orderItem.id,
      table: orderItem.tableId,
      currentDate: new Date().toISOString(),
      customerPhone:
        customerInfo && customerInfo.length > 0
          ? customerInfo[0].phone_number
          : "không có",
      discountAmount: discountAmount,
      selectedPaymentMethod:
        selectedPaymentMethod === "cash" ? "Tiền Mặt" : "Chuyển khoản",
      cartItems: cartItems,
      totalAmount: totalAmount,
      finalAmount: totalAmount - discountAmount,
    };
    const payload = {
      orderId: orderItem.id,
      payment_method: selectedPaymentMethod,
      amount: totalAmount - discountAmount,
      transaction_id: transaction_id ? transaction_id : null,
    };
    await this.props.CREATE_PAYMENTS(payload);
    try {
      const response = await axios.post(
        "http://localhost:3005/api/generate-invoice",
        invoiceData,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${invoiceData.currentDate}_${
          invoiceData.invoiceCode || "invoice"
        }.docx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.state.onClose();
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  formatAmount = (amount) => {
    if (!amount || isNaN(amount)) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  render() {
    const {
      customerInfo,
      discountAmount,
      currentDate,
      selectedPaymentMethod,
      cartItems,
      totalAmount,
    } = this.state;
    const finalAmount = totalAmount - discountAmount;
    return (
      <div className="payment-container">
        <p>Ngày giờ: {currentDate}</p>
        <div className="customer-info">
          <label>
            Số điện thoại khách hàng:
            <input
              type="text"
              value={this.state.customerPhone}
              onChange={this.handlePhoneChange}
              placeholder="Nhập số điện thoại"
            />
          </label>
          {customerInfo && customerInfo.length > 0 ? (
            <div>
              {customerInfo.map((customer, index) => (
                <div key={index}>
                  <p>Tên: {customer.name}</p>
                  <p>Email: {customer.email}</p>
                  <p>Điện thoại: {customer.phone_number}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Không tìm thấy khách hàng với số điện thoại này.</p>
          )}
        </div>

        <div className="discount-info">
          <label>
            Mã giảm giá:
            <input
              type="text"
              value={this.state.discountCode}
              onChange={this.handleDiscountChange}
              placeholder="Nhập mã giảm giá"
            />
          </label>
          {discountAmount > 0 && (
            <p style={{ color: "green" }}>
              Mã giảm giá hợp lệ! Bạn được giảm:{" "}
              {discountAmount.toLocaleString()} VND
            </p>
          )}
        </div>
        <div className="payment-options">
          <Form.Check
            type="radio"
            label="Tiền mặt"
            name="paymentMethod"
            value="cash"
            checked={selectedPaymentMethod === "cash"}
            onChange={this.handlePaymentChange}
          />
          <Form.Check
            type="radio"
            label="Thanh toán online"
            name="paymentMethod"
            value="online"
            checked={selectedPaymentMethod === "online"}
            onChange={this.handlePaymentChange}
          />
        </div>

        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString()} VND</td>
                <td>{(item.quantity * item.price).toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: "right" }}>
                Tổng cộng:
              </td>
              <td>
                {!isNaN(totalAmount) ? totalAmount.toLocaleString() : 0} VND
              </td>
            </tr>
            {discountAmount > 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "right" }}>
                  Giảm giá:
                </td>
                <td>
                  -
                  {!isNaN(discountAmount) ? discountAmount.toLocaleString() : 0}{" "}
                  VND
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="4" style={{ textAlign: "right" }}>
                Tổng thanh toán:
              </td>
              <td>{finalAmount.toLocaleString()} VND</td>
            </tr>
          </tfoot>
        </table>
        <Button className="payment-button" onClick={this.handlePrintInvoice}>
          In hóa đơn
        </Button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayMents);
