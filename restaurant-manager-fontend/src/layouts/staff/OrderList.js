import React, { Component } from "react";
import { connect } from "react-redux";
import { GET_ORDERS, UPDATE_ORDERS_STATUS } from "../../store/actions/orders.action";
import { GET_MENUITEMS } from "../../store/actions/menuitems.action";
import { Button, Modal } from "react-bootstrap";
import Payments from "./Payments";
import { Navigate } from "react-router-dom";


const mapStateToProps = (state) => {
  return {
    propOrders: state.ordersReducer.order,
    propMenuItems: state.menuitemsReducer.menuitems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_ORDERS: () => dispatch(GET_ORDERS()),
    UPDATE_ORDERS_STATUS: (payload) => dispatch(UPDATE_ORDERS_STATUS(payload)),
    GET_MENUITEMS: () => dispatch(GET_MENUITEMS()),
  };
};

const statusStyles = {
  pending: "status pending",
  preparing: "status preparing",
  delivered: "status delivered",
  complete: "status complete",
  cancel: "status cancel",
};
const statusOrder = [
  { value: "pending", label: "Chưa giải quyết" },
  { value: "preparing", label: "Đang chuẩn bị" },
  { value: "delivered", label: "Đã giao" },
  { value: "complete", label: "Thanh toán" },
];
class OrderListStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      menuItems: [],
      selectedItems: [],
      showModal: false,
      showForm: false,
      selectedOrder: null,
      navigateToOrder: false,
      selectOrderId: null
    };
  }

  async componentDidMount() {
    await Promise.all([this.props.GET_ORDERS(), this.props.GET_MENUITEMS()]);
    this.setState({
      orders: this.props.propOrders,
      menuItems: this.props.propMenuItems,
    });
  }

  getStatusLabel = (status) => {
    const labels = {
      pending: "Đang chờ",
      preparing: "Đang chế biến",
      delivered: "Đã giao",
      complete: "Thanh toán",
      cancel: "Hủy",
    };
    return labels[status] || "Không xác định";
  };

  showOrderDetails = (items) => {
    this.setState({
      selectedItems: items,
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({ showModal: false ,showForm: false});
  };

  updateOrderStatus = async (orderId, currentStatus) => {
    const nextStatus = this.getNextStatus(currentStatus);
    const status = statusOrder.find((status) => status.label === nextStatus);
    if(status.value === 'complete'){
      this.setState({
        showForm: true,
        selectedOrder: orderId
      })
    }
    const payload = {
      orderId: orderId,
      status: status ? status.value : undefined,
    };

    await this.props.UPDATE_ORDERS_STATUS(payload);
    this.componentDidMount(); 
  };

  getNextStatus = (currentStatus) => {
    const currentIndex = statusOrder.findIndex((status) => status.value === currentStatus);
    if (currentIndex === -1) return currentStatus;

    return currentIndex < statusOrder.length - 1
      ? statusOrder[currentIndex + 1].label
      : statusOrder[currentIndex].label;
  };

  cancelOrder = async (orderId) => {
    if (window.confirm("Xác nhận hủy đơn hàng?")) {
      const payload = {
        orderId: orderId,
        status: "cancel",
      };
      await this.props.UPDATE_ORDERS_STATUS(payload);
      this.componentDidMount(); // Reload orders after update
    }
  };
  
  addDishes = async (orderId)=>{
    this.setState({navigateToOrder: true,selectOrderId : orderId})
  }
  getStatusButtonLable= (orderStatuses)=>{
    const nextStatus = this.getNextStatus(orderStatuses);
    const status = statusOrder.find((status) => status.label === nextStatus);
    return  this.getStatusLabel(status.value);
  }
  render() {
    const { orders, showModal, selectedItems, showForm, selectedOrder,navigateToOrder } = this.state;

      if(navigateToOrder){
          return <Navigate to = "/staff/order" state={{selectOrderId: this.state.selectOrderId}}/>;
        }
    return (
      <>
        <div className="container_staff">
          <header>
            <h1>Danh sách Đơn hàng</h1>
          </header>
          <div className="order-cards">
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <div className="order-card" key={index}>
                  <h3>Mã đơn hàng #{order.id}</h3>
                  <p>Bàn: {order.tableId ? order.tableId : 'Ship mang về'}</p>
                  <p className={statusStyles[order.orderStatuses[0]?.status || ""]}>
                    Trạng thái: {this.getStatusLabel(order.orderStatuses[0]?.status)}
                  </p>
                  <Button className="btn-sucsses" onClick={() => this.showOrderDetails(order.orderItems)}>
                    Xem món
                  </Button>
                  <Button
                    className="btn-sucsses"
                    onClick={() => this.updateOrderStatus(order.id, order.orderStatuses[0]?.status)}
                    style={{ marginLeft: "10px" }}
                  >
                    {this.getStatusButtonLable(order.orderStatuses[0]?.status)}  
                  </Button>
                  <Button
                  className="btn-sucsses"
                  style={{ marginLeft: "10px" }}
                  onClick={()=>this.addDishes(order.id)}>
                    
                    Thêm món
                  </Button>
                  {(order.orderStatuses[0]?.status !== "preparing" && order.orderStatuses[0]?.status !== "delivered") && (
                    <Button
                      variant="danger"
                      onClick={() => this.cancelOrder(order.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Hủy
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>Không có đơn hàng nào.</p>
            )}
          </div>
        </div>
        <Modal show={showForm} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Thanh Toán</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Payments
              data={selectedOrder}
              onClose={this.closeModal}
            />
          </Modal.Body>
        </Modal>


        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header >
            <Modal.Title>Danh sách món</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItems && selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <div key={index}>
                  {item.menu_items && item.menu_items.length > 0 ? (
                    item.menu_items.map((menuItem, idx) => {
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
                    })
                  ) : (
                    <p>Không có món nào trong đơn hàng.</p>
                  )}
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderListStaff);
