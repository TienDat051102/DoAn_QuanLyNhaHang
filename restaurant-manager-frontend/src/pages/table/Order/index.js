import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { GET_MENUCATEGORIES, GET_EMPTYTABLE } from "../../../store/actions";
import { CREATE_ORDERS } from "../../../store/actions/orders.action";

const mapStateToProps = (state) => {
  return {
    propMenuCateGories: state.menucategoriesReducer.menuCateGories,
    propMenuCateGoriesCount: state.menucategoriesReducer.menuCateGoriesCount,
    propTable: state.tableReducer.table,
    propOrder: state.ordersReducer.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_MENUCATEGORIES: (payload) => dispatch(GET_MENUCATEGORIES(payload)),
    GET_EMPTYTABLE: () => dispatch(GET_EMPTYTABLE()),
    CREATE_ORDERS: (payload) =>dispatch(CREATE_ORDERS(payload))
  };
};

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: [],
      orderList: [],
      selectedCategory: null,
      searchQuery: "",
      total: 0,
      selectedTable: "",
      availableTables: [],
    };
  }

  initData = async () => {
    await this.props.GET_MENUCATEGORIES();
    await this.props.GET_EMPTYTABLE();
    this.setState({
      menuData: this.props.propMenuCateGories,
      total: this.props.propMenuCateGoriesCount,
      availableTables: this.props.propTable,
    });
  };

  async componentDidMount() {
    await this.initData();
  }

  filterMenu = (category) => {
    this.setState({ selectedCategory: category });
  };

  searchMenu = (query) => {
    this.setState({ searchQuery: query.toLowerCase() });
  };

  addToOrder = (item) => {
    this.setState((prevState) => {
      const existingItem = prevState.orderList.find(
        (order) => order.item.id === item.id
      );
      if (existingItem) {
        return {
          orderList: prevState.orderList.map((order) =>
            order.item.id === item.id
              ? { ...order, quantity: order.quantity + 1 }
              : order
          ),
        };
      } else {
        return {
          orderList: [...prevState.orderList, { item, quantity: 1 }],
        };
      }
    });
  };

  increaseQuantity = (index) => {
    this.setState((prevState) => {
      const updatedOrderList = prevState.orderList.map((order, i) =>
        i === index ? { ...order, quantity: order.quantity + 1 } : order
      );
      return { orderList: updatedOrderList };
    });
  };

  decreaseQuantity = (index) => {
    this.setState((prevState) => {
      const updatedOrderList = [...prevState.orderList];
      if (updatedOrderList[index].quantity > 1) {
        updatedOrderList[index].quantity--;
      } else {
        updatedOrderList.splice(index, 1);
      }
      return { orderList: updatedOrderList };
    });
  };

  removeItem = (index) => {
    this.setState((prevState) => {
      const updatedOrderList = [...prevState.orderList];
      updatedOrderList.splice(index, 1);
      return { orderList: updatedOrderList };
    });
  };

  handleTableChange = (event) => {
    const value = event.target.value;

    this.setState({
      selectedTable: value === "" ? null : Number(value),
    });
  };

  calculateOrderSummary = () => {
    let totalAmount = 0;
    let totalItems = 0;
    this.state.orderList.forEach((order) => {
      totalAmount += order.item.price * order.quantity;
      totalItems += order.quantity;
    });
    return { totalAmount, totalItems };
  };

  onClickSubmit = async ()=>{
    let payload = {
      table: this.state.selectedTable
    }
    if(!this.state.orderList){
      alert('Không thể gửi order nếu trống món ăn!')
    }
    payload.ordersItem =  this.state.orderList.map(order => ({
      id: order.item.id,
      quantity: order.quantity,
      price: order.item.price
    }))
    await this.props.CREATE_ORDERS(payload);
    if(this.props.propOrder){
      alert('Những món ăn của bạn đã được đặt vui lòng chờ!')
      this.initData()
      this.setState({
        orderList : []
      })
    }
    else{
      alert('Order của bạn đang gặp chút trục trặc vui lòng thử lại !')
    }
  }

  render() {
    const { menuData, searchQuery, orderList, selectedCategory, selectedTable, availableTables } = this.state;
    const { totalAmount, totalItems } = this.calculateOrderSummary();

    let filteredMenuItems = [];
    if (selectedCategory) {
      const category = menuData.find((category) => category.id === selectedCategory);
      filteredMenuItems = category ? category.menuitems : [];
    } else {
      filteredMenuItems = menuData.flatMap((category) => category.menuitems);
    }

    const searchFilteredItems = filteredMenuItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );

    return (
      <main id="main" className="main">
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <section className="menu-section">
                    <div className="search-bar">
                      <input
                        type="text"
                        placeholder="Tìm món ăn..."
                        onChange={(e) => this.searchMenu(e.target.value)}
                      />
                    </div>
                    <div className="category-selection">
                      <ul>
                        <li>
                          <Button onClick={() => this.filterMenu(null)}>Tất cả</Button>
                        </li>
                        {menuData.map((category) => (
                          <li key={category.id}>
                            <Button onClick={() => this.filterMenu(category.id)}>{category.name}</Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="menu-grid">
                      {searchFilteredItems.map((item) => (
                        <Button key={item.id} className="menu-item" onClick={() => this.addToOrder(item)}>
                          {item.name} - {item.price}
                        </Button>
                      ))}
                    </div>
                  </section>
                  <section className="order-section">
                    <div className="table-selection">
                      <Form.Label>Chọn số bàn</Form.Label>
                      <Form.Group>
                        <Form.Control as="select" value={selectedTable} onChange={this.handleTableChange}>
                          <option value={null}>Ship về nhà</option>
                          {availableTables.map((table) => (
                            <option key={table.id} value={table.id}>
                              {`${table.name} - Sức chứa: ${table.capacity} người - Vị trí: ${table.location} `}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <br />
                    <div className="order-summary">
                      <Form.Label>Món ăn đã chọn</Form.Label>
                      <ul>
                        {orderList.map((order, index) => (
                          <li key={index}>
                            <span>
                              {order.item.name} x {order.quantity}
                            </span>
                            <Button onClick={() => this.increaseQuantity(index)}>+</Button>
                            <Button onClick={() => this.decreaseQuantity(index)}>-</Button>
                            <Button className="btn-danger" onClick={() => this.removeItem(index)}>
                              Xóa
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <br />
                    {/* Total Summary */}
                    <div className="total-summary">
                      <p>Số món: {totalItems}</p>
                      <p>Tổng tiền: {totalAmount.toLocaleString()} VND</p>
                    </div>
                    <Button onClick={()=>this.onClickSubmit()} className="submit-btn">Gửi nhà bếp</Button>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order);
