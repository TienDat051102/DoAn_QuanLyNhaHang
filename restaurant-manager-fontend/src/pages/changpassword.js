import React, { Component } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { CHANG_PASSWORD } from "../store/actions";

const mapStateToProps = (state) => {
    return {
        propMessage: state.usersReducer.message
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
        CHANG_PASSWORD: (payload) =>dispatch(CHANG_PASSWORD(payload))
    };
  };

class ChangPassWord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}, 
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            errorMessage: "", 
        };
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = this.state;
        const {username}  = this.state.user

        if (newPassword !== confirmPassword) {
            this.setState({ errorMessage: "Mật khẩu không khớp" });
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            this.setState({
                errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt.'
            });
          return;
        }
        let payload ={
            username: username,
            oldpassword: oldPassword,
            newpassword: newPassword
        }
        await this.props.CHANG_PASSWORD(payload)
        const message = this.props.propMessage;
        if(message === 'Success'){
            alert("Thay đổi mật khẩu thành công!");
            this.props.onClose(); 
        }
       else{
        this.setState({errorMessage: message})
       }
    };

    async componentDidMount() {
        const user = JSON.parse(localStorage.getItem("user"));
        this.setState({
            user: user
        })

    }

    render() {
        const { user,oldPassword, newPassword, confirmPassword,errorMessage } = this.state;
        const {username}  = user
        return (
            <Form onSubmit={this.handleSubmit}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form.Group controlId="formUserName">
                    <Form.Label>Tên đăng nhập</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        readOnly
                        disabled
                    />
                </Form.Group>

                <Form.Group controlId="formOldPassword">
                    <Form.Label>Mật Khẩu hiện tại của bạn</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu cũ"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={this.handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formNewPassword">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        name="newPassword"
                        value={newPassword}
                        onChange={this.handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={this.handleInputChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>

                <Button variant="secondary" onClick={this.props.onClose} style={{ marginLeft: '10px' }}>
                    Close
                </Button>
            </Form>
        );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChangPassWord);
