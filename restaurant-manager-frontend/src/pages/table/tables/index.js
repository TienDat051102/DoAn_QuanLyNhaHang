import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../../../components/datatable";
import { connect } from 'react-redux';
import {  DELETE_TABLE, GET_TABLE } from "../../../store/actions";
import Tablesfrom from "./tablesfrom";
const mapStateToProps = (state) => {
  return {
    propTable: state.tableReducer.table,
    propTableCount: state.tableReducer.tableCount,
    propMessage: state.tableReducer.message
  };
};
const mapDispatchToProps =(dispatch)=>{
  return{
    GET_TABLE: (payload)=>dispatch(GET_TABLE(payload)),
    DELETE_TABLE: (id) =>dispatch(DELETE_TABLE(id))
  };
}
const columns = [
  { header: "Tên bàn", accessor: "name" },
  { header: "Số lượng người", accessor: "capacity" },
  { header: "Vị trí bàn", accessor: "location" },
  { header: "Trạng thái bàn", accessor: "is_available" },
];

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      pageSize: 5,
      currentPage: 0,
      totalRec : 0,
      formType: null, 
      selectedTables: null,
      showForm: false, 
    };
  }

  handlePageClick = async(selectedPage)=>{
    let {pageSize} = this.state;
    let skip = selectedPage * pageSize;
    await this.props.GET_TABLE({skip: skip,limit: pageSize});
    const editedData = this.props.propTable.map(item => {
      return {
        ...item,
        is_available: item.is_available ? 'Đang rảnh' : 'Không rảnh',
      };
    });
    this.setState({
      tables: editedData,
      totalRec: this.props.propTableCount,
    })
  }
  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.componentDidMount()
  };


  handleActionClick = async(action,row)=>{
    if(action === "delete"){
      alert("Bạn có chắc chắn muốn xóa bàn này không");
      this.props.DELETE_TABLE({id: row.id}) 
      this.initData()
    }
    else if(action === "edit"){
      this.setState({ showForm: true, formType: action, selectedTables: row });
    }
    else{
      this.setState({ showForm: true, formType: "create", selectedTables: null });
    }
  } 

  initData = async ()=>{
    let {currentPage,pageSize} = this.state;
    let skip = (currentPage) * pageSize;
    await this.props.GET_TABLE({skip: skip,limit: pageSize});
    const editedData = this.props.propTable.map(item => {
      return {
        ...item,
        is_available: item.is_available ? 'Đang rảnh' : 'Không rảnh',
      };
    });
    this.setState({
      tables: editedData,
      totalRec: this.props.propTableCount
    })
  }
  async componentDidMount() {
    await this.initData();
  }

  render() {
    let {showForm,formType,selectedTables} = this.state

    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Bàn</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang chủ</a>
                </li>
                <li className="breadcrumb-item active">Bàn</li>
              </ol>
            </nav>
          </div>
          <section class="section">
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Danh Sách Bàn</h5>
              <Button onClick={()=>this.handleActionClick()}>Tạo Bàn</Button>
              <DataTable columns={columns} data={this.state.tables} count = {this.state.totalRec} pageSize={this.state.pageSize} currentPage={this.state.currentPage}  onActionClick={this.handleActionClick}  onHandlePageClick ={this.handlePageClick}/>
            </div>
          </div>

        </div>
      </div>
    </section>

        </main>
        <Modal show={showForm} onHide={this.handleCloseForm}>
          <Modal.Header>
            <Modal.Title>{formType === "create" ? "Tạo Bàn" : "Sửa Bàn"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tablesfrom
              type={formType}
              data={selectedTables}
              onClose={this.handleCloseForm}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Tables);
