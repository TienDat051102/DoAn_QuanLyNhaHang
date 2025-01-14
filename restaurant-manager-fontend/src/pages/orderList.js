import React, { Component } from "react";
import { connect } from "react-redux";
import { GET_ORDERS, UPDATE_ORDERS_STATUS } from "../store/actions/orders.action";
import { Button, Modal } from "react-bootstrap";
import { GET_MENUITEMS } from "../store/actions/menuitems.action";

const mapStateToProps = (state) => {
  return {
    propOrders: state.ordersReducer.order,
    propOrdersCount: state.ordersReducer.ordersCount,
    propMenuItems: state.menuitemsReducer.menuitems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_ORDERS: () => dispatch(GET_ORDERS()),
    GET_MENUITEMS: (payload) => dispatch(GET_MENUITEMS(payload)),
    UPDATE_ORDERS_STATUS: (payload) => dispatch(UPDATE_ORDERS_STATUS(payload)),
  };
};

const status = [
  { label: "Chưa giải quyết", value: "pending" },
  { label: "Đang chuẩn bị", value: "preparing" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã thanh toán", value: "complete" },
  { label: "Hủy", value: "cancel" },
];

class OrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      totalRec: 0,
      selectedItems: [],
      showModal: false,
    };
  }

  initData = async () => {
    await this.props.GET_ORDERS();
    this.setState({
      order: this.props.propOrders,
      totalRec: this.props.propOrdersCount,
    });
  };

  async componentDidMount() {
    await this.initData();
  }

  getStatusLabel = (value) => {
    const found = status.find((item) => item.value === value);
    return found ? found.label : "Không xác định";
  };

  showOrderDetails = async (items) => {
    await this.props.GET_MENUITEMS();
    this.setState({
      selectedItems: items,
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  updateOrderStatus = async (orderId, currentStatus) => {
    const statusOrder = [
      { value: "pending", label: "Chưa giải quyết" },
      { value: "preparing", label: "Đang chuẩn bị" },
      { value: "delivered", label: "Đã giao" },
      { value: "complete", label: "Thanh toán" }
    ];
    const nextStatus = this.getNextStatus(currentStatus);
    const status = statusOrder.find(status => status.label === nextStatus);
    const payload = {
      orderId: orderId,
      status: status ? status.value : undefined
    }
    
    await this.props.UPDATE_ORDERS_STATUS(payload)
    this.componentDidMount()
    
  };

  getNextStatus = (currentStatus) => {
    const statusOrder = [
      { value: "pending", label: "Chưa giải quyết" },
      { value: "preparing", label: "Đang chuẩn bị" },
      { value: "delivered", label: "Đã giao" },
      { value: "complete", label: "Thanh toán" }
    ];
    const currentIndex = statusOrder.findIndex(status => status.value === currentStatus);
    if (currentIndex === -1) return currentStatus;
  
    return currentIndex < statusOrder.length - 1
      ? statusOrder[currentIndex + 1].label
      : statusOrder[currentIndex].label;
    };
  cancelOrder = async (orderId) => {
    alert('Xác nhận hủy order')
    const payload = {
      orderId: orderId,
      status: 'cancel'
    }
    await this.props.UPDATE_ORDERS_STATUS(payload)
    this.componentDidMount()
  };
  render() {
    const { order, showModal, selectedItems } = this.state;
    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>List Orders</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Home</a>
                </li>
                <li className="breadcrumb-item active">List Orders</li>
              </ol>
            </nav>
          </div>
          <table className="table datatable">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Bàn</th>
                <th>Danh sách món</th>
                <th>Trạng thái</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(order && order.length > 0) ?order.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.id}</td>
                  <td>{row.tableId ? "Bàn " + row.tableId : "Mang về"}</td>
                  <td>
                    <Button onClick={() => this.showOrderDetails(row.orderItems)}>
                      Xem món
                    </Button>
                  </td>
                  <td>{this.getStatusLabel(row.orderStatuses[0]?.status || "")}</td>
                  <td>
                    <Button
                      onClick={() => this.updateOrderStatus(row.id, row.orderStatuses[0]?.status)}
                    >
                      {this.getNextStatus(row.orderStatuses[0]?.status)}
                    </Button>
                    {(row.orderStatuses[0]?.status !== "preparing" ) && (
                      <Button
                        variant="danger"
                        onClick={() => this.cancelOrder(row.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Hủy
                      </Button>
                    )}
                  </td>
                </tr>
              )):<tr><td colSpan={5} style={{ textAlign: "center" }}>không có dữ liệu</td></tr>}
            </tbody>
          </table>
        </main>

        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Danh sách món</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItems && selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <div key={index}>
                  {item.menu_items.map((menuItem, idx) => {
                    const menuDetails = this.props.propMenuItems.find(
                      (menu) => menu.id === menuItem.id
                    );
                    return (
                      <p key={idx}>
                        {menuDetails
                          ? `${menuDetails.name} - Số lượng: ${menuItem.quantity}`
                          : "Món không xác định"}
                      </p>
                    );
                  })}
                </div>
              ))
            ) : (
              <p>Không có đơn hàng nào.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersList);
