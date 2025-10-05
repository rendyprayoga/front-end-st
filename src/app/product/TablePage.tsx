import Table from "react-bootstrap/Table";
import { IProduct } from "../feature/product/interface/products.interface";
import React from "react";
import { Button } from "react-bootstrap";

function BasicExample({ products }: any) {
  return (
    <div className="">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th> Name</th>
            <th> Description</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: IProduct, index: number) => (
            <React.Fragment key={product.id}>
              <tr>
                <td>{index + 1}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>$ {product.price}</td>
                <td className="d-flex gap-2">
                  <Button variant="warning">Detail</Button>
                  <Button variant="info">Edit</Button>
                  <Button variant="danger">Delete</Button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default BasicExample;
