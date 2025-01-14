import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { Button, Pagination } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
    };
  }

  handlePageClick = (data) => {
    const selectedPage = data.selected;
    this.setState({ currentPage: selectedPage });
    this.props.onHandlePageClick(selectedPage);
  };

  getPaginatedData = () => {
    const { data, currentPage, pageSize } = this.props;
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  handleActionClick = (action, rowData) => {
    this.props.onActionClick(action, rowData);
    this.setState({ currentPage: 0 });
  };

  render() {
    const { columns } = this.props;
    const paginatedData = this.getPaginatedData();
    const pageCount = Math.ceil(this.props.count / this.props.pageSize);

    return (
      <>
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>
                    <b>{col.header}</b>
                  </th>
                ))}
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{row[col.accessor]}</td>
                  ))}
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => this.handleActionClick("edit", row)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      style={{ marginLeft: "5px" }}
                      variant="danger"
                      onClick={() => this.handleActionClick("delete", row)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination className="justify-content-center">
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={this.handlePageClick}
            forcePage={this.state.currentPage}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel={<ArrowLeftCircle />}
            nextLabel={<ArrowRightCircle />}
            breakLabel="..."
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            pageClassName="page-item"
            pageLinkClassName="page-link rounded-circle"
            previousClassName="page-item"
            nextClassName="page-item"
            previousLinkClassName="page-link rounded-circle"
            nextLinkClassName="page-link rounded-circle"
          />
        </Pagination>
      </>
    );
  }
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageSize: PropTypes.number.isRequired,
  onActionClick: PropTypes.func.isRequired,
};

export default DataTable;
