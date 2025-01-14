import React, { Component } from "react";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { CREATE_RESERVATION } from "../../../store/actions/reservations.action";

const mapStateToProps = (state) => {
  return {
    propMessage: state.reservationReducer.message
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    CREATE_RESERVATION: (payload) =>dispatch(CREATE_RESERVATION(payload))
  };
};
class CreateReservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      time: "",
      people: 1,
      note: "",
      message: "",
      errorMessage: "",
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, time, people, note } = this.state;

    try {
      const payload ={name, email, phone, time, people, note}
      await this.props.CREATE_RESERVATION(payload);
      alert(this.props.propMessage)
      this.props.onClose();
    } catch (error) {
      console.error("Error creating reservation:", error);
      this.setState({ errorMessage: "Đã có lỗi xảy ra, vui lòng thử lại!" });
    }
  };

  render() {
    const { name, email, phone, time, people, note, message, errorMessage } =
      this.state;

    return (
      <Container>
        {message && <Alert variant="success">{message}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={this.handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formName">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={this.handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                required
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={phone}
                onChange={this.handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formPeople">
              <Form.Label>Số người</Form.Label>
              <Form.Control
                type="number"
                name="people"
                value={people}
                onChange={this.handleInputChange}
                required
                min={1}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formTime">
              <Form.Label>Thời gian</Form.Label>
              <Form.Control
                type="datetime-local"
                name="time"
                value={time}
                onChange={this.handleInputChange}
                required
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group controlId="formNote">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                name="note"
                value={note}
                onChange={this.handleInputChange}
                placeholder="Nhập ghi chú nếu có"
              />
            </Form.Group>
          </Row>

          <div className="text-center">
            <Button variant="primary" type="submit">
              Đặt Bàn
            </Button>
          </div>
        </Form>
      </Container>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateReservations);
