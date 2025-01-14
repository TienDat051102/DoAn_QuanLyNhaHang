import React, { Component } from "react";
import { connect } from "react-redux";
import {
  GET_TABLE,
  UPDATE_STATUS_TABLE,
} from "../../store/actions/table.action";
import {
  GET_RESERVATION,
  UPDATE_RESERVATION,
} from "../../store/actions/reservations.action";
import { GET_CUSTOMER } from "../../store/actions/customer.action";
import { Button, Modal } from "react-bootstrap";
import NotificationModal from "../../components/NotificationModal";
import { Navigate } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    propCustomers: state.customerReducer.customers,
    propReservations: state.reservationReducer.reservations,
    propReservationsCount: state.reservationReducer.reservationsCount,
    propTables: state.tableReducer.table,
    propTableCount: state.tableReducer.tableCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_CUSTOMER: (payload) => dispatch(GET_CUSTOMER(payload)),
    GET_TABLE: () => dispatch(GET_TABLE()),
    GET_RESERVATION: (payload) => dispatch(GET_RESERVATION(payload)),
    UPDATE_RESERVATION: (payload) => dispatch(UPDATE_RESERVATION(payload)),
    UPDATE_STATUS_TABLE: (payload) => dispatch(UPDATE_STATUS_TABLE(payload)),
  };
};

class TableBookingStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDate: "",
      listTable: [],
      listTableCount: 0,
      listReservation: [],
      listReservationCount: 0,
      show: false,
      reservationDetails: "",
      showNotification: false,
      notificationMessage: "",
      notifiedReservations: [], 
      navigateToOrder: false,
      customerId: null,
      tableId: null,
    };
  }

  handleDateChange = async (e) => {
    this.setState({ bookingDate: e.target.value }, async () => {
      await this.initData();
    });
  };
  isReservationExpired = async () =>{
    const now = new Date();
    let notifiedReservations = JSON.parse(localStorage.getItem("notifiedReservations")) || [];
    this.state.listReservation.forEach((reservation)=> {
      const reservationTime = new Date(reservation.reservation_time);
      const timeRemaining = reservationTime - now;

      if(timeRemaining< -1800000){
        const reservationKey = `${reservation.id}`;
        if (notifiedReservations.includes(reservationKey)) {
          this.setState({
            showNotification: true,
            notificationMessage: `Khách đặt bàn vào lúc: ${reservationTime.toLocaleString()} (Bàn ${reservation.tableId}) quá 30 phút lên bàn đã bị hủy`,
          });
          this.handleUpdateReservationStatus(reservation.id,"canceled")
          this.checkUpdateTable2(reservation.tableId)
          this.componentDidMount()
          notifiedReservations.pop(reservationKey);
          localStorage.setItem("notifiedReservations", JSON.stringify(notifiedReservations)); 
        }
      }
    })
  }

  checkReservationTimeout = async () => {
    const now = new Date();
    let notifiedReservations = this.getNotifiedReservations();
  
    this.state.listReservation.forEach((reservation) => {
      if (this.isTimeoutSoon(reservation.reservation_time, now)) {
        this.notifyUpcomingReservation(reservation, notifiedReservations);
      }
    });
  };
  
  getNotifiedReservations = () => {
    try {
      return JSON.parse(localStorage.getItem("notifiedReservations")) || [];
    } catch {
      return [];
    }
  };
  
  isTimeoutSoon = (reservationTime, now) => {
    const timeRemaining = new Date(reservationTime) - now;
    return timeRemaining <= 900000 && timeRemaining > 0;
  };
  
  notifyUpcomingReservation = (reservation, notifiedReservations) => {
    const reservationKey = `${reservation.id}`;
    if (!notifiedReservations.includes(reservationKey)) {
      this.checkUpdateTable(
        reservation.reservation_time,
        reservation.id,
        reservation.tableId,
        reservation.of_people
      );
      notifiedReservations.push(reservationKey);
      localStorage.setItem("notifiedReservations", JSON.stringify(notifiedReservations));
    }
  };

  checkUpdateTable2 = async(tableId) =>{
    let checkTable = this.state.listTable.find(item => item.id === tableId);
    if(checkTable.is_available === false){
      let payload = {
        id : tableId,
        is_available: true
      }
      this.props.UPDATE_STATUS_TABLE(payload)
    }
  }

  checkUpdateTable = async (reservationTime,reservationId,tableId,of_people) => {
    let checkTable = this.state.listTable.find(item => item.id === tableId);
    if(checkTable.is_available === true){
      let payload = {
        id : tableId,
        is_available: false
      }
      this.props.UPDATE_STATUS_TABLE(payload)
      this.setState({
        showNotification: true,
        notificationMessage: `Sắp có khách đặt bàn vào lúc: ${reservationTime.toLocaleString()} (Bàn ${tableId})`,
      });

    }
    else{
      const findTable = this.state.listTable.find(item => 
        item.is_available === true && (
          item.capacity === of_people || item.capacity > of_people
        )
      );
      const updatedReservation = {
        id: reservationId,
        tableId: findTable.id,
        status: 'confirmed'
      }
      this.props.UPDATE_RESERVATION(updatedReservation);
      const payload =  {
        id : findTable.id,
        is_available: false
      }
      this.props.UPDATE_STATUS_TABLE(payload)
      this.setState({
        showNotification: true,
        notificationMessage: `Thông báo bàn ${tableId} khách đặt lúc ${reservationTime.toLocaleString()} hiện đang có khách đã chuyển khách đặt sang bàn ${findTable.id}`,
      });
    }
  }

  initData = async () => {
    try {
      await this.props.GET_TABLE();
      const payload = { date: this.state.bookingDate };
      await this.props.GET_RESERVATION(payload);
      this.setState({
        listTable: this.props.propTables,
        listTableCount: this.props.propTableCount,
        listReservation: this.props.propReservations,
        listReservationCount: this.props.propReservationsCount,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  handleUpdateReservationStatus = async (reservationId, status) => {
    const updatedReservation = {
      id: reservationId,
      status: status,
    };
    await this.props.UPDATE_RESERVATION(updatedReservation);
    this.handleClose();
    await this.initData();
  };

  handleShowReservationDetails = (reservations) => {
    if (reservations.length > 0) {
      const details = reservations.map((reservation) => {
        const customer = this.props.propCustomers.find(
          (item) => item.id === reservation.customerId
        );
        return {
          id: reservation.id,
          tableId: reservation.tableId,
          customerId: reservation.customerId,
          name: customer.name,
          phone_number: customer.phone_number,
          of_people: reservation.of_people,
          reservation_time: new Date(
            reservation.reservation_time
          ).toLocaleString(),
          note: reservation.note || "Không có ghi chú",
        };
      });

      this.setState({ reservationDetails: details }, this.handleShow);
    } else {
      this.setState({ reservationDetails: [] }, this.handleShow);
    }
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  // handShowForm =() =>{
  //   this.setState({showForm : true})
  // }
  handleClose = () => {
    this.setState({ show: false });
  };

  async componentDidMount() {
    await this.initData();
    this.interval = setInterval(() => {
      this.checkReservationTimeout();
      this.isReservationExpired()
    }, 60000 );
    await this.props.GET_CUSTOMER();
  }

  componentWillUnmount() {
    clearInterval(this.interval); 
  } 

  handleCloseNotification = () => {
    this.setState({ showNotification: false });
  };

  updateCustomerArrive = (reservationId,customerId,tableId) =>{
    this.setState({
      navigateToOrder: true,
      customerId: customerId,
      tableId: tableId 
    });
    this.handleUpdateReservationStatus(reservationId,"completed")
    this.initData()
  }

  render() {
    const { bookingDate, listTable, listReservation, show ,showNotification, notificationMessage, navigateToOrder} = this.state;
    const getReservationsForTable = (tableId) => {
      return listReservation.filter(
        (reservation) => reservation.tableId === tableId
      );
    };
    if(navigateToOrder){
      return <Navigate to = "/staff/order" state={{customerId: this.state.customerId, tableId: this.state.tableId}}/>;
    }
    return (
      <div className="container_staff">
        <header>
          <h1>Danh sách bàn</h1>
        </header>
        <label htmlFor="booking-date">Chọn ngày:</label>
        <input
          type="date"
          id="booking-date"
          name="booking-date"
          value={bookingDate}
          onChange={this.handleDateChange}
        />


        <div className="table-cards">
          {Array.isArray(listTable) && listTable.map((table) => {
            const reservations = getReservationsForTable(table.id);
            return (
              <div className="table-card" key={table.id}>
                <h3>{table.name}</h3>
                <p>{"Số người tối đa: " + table.capacity}</p>
                <p
                  className={`status ${
                    table.is_available ? "available" : "reserved"
                  }`}
                >
                  Trạng thái hiện tại:{" "}
                  {table.is_available ? "Trống" : "Đang Có Khách"}
                </p>
                {reservations.length > 0 && (
                  <div>
                    <button
                      onClick={() =>
                        this.handleShowReservationDetails(reservations)
                      }
                    >
                      Xem thông tin khách đặt
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <NotificationModal   
          show = {showNotification}
          message = {notificationMessage}
          onClose = {this.handleCloseNotification}
        />
        <Modal show={show}>
          <Modal.Header>
            <Modal.Title>Chi tiết đặt chỗ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Array.isArray(this.state.reservationDetails) &&
            this.state.reservationDetails.length > 0 ? (
              this.state.reservationDetails.map((reservation) => (
                <div key={reservation.id}>
                  <pre>
                    {`
                  Tên Khách: ${reservation.name}
                  Số liên lạc: ${reservation.phone_number}
                  Số người: ${reservation.of_people}
                  Thời gian: ${reservation.reservation_time}
                  Ghi chú: ${reservation.note}
                `}
                  </pre>
                  <Button
                    variant="danger"
                    onClick={() =>this.updateCustomerArrive(reservation.id,reservation.customerId,reservation.tableId)}
                  >
                    Khách hàng đã đến</Button>
                  <hr />
                </div>
              ))
            ) : (
              <p>Không có đặt chỗ nào.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableBookingStaff);
