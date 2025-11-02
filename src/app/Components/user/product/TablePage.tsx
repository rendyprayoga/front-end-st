import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Button,
  Container,
  Dropdown,
  Modal,
  Card,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IParamsGetProduct, IProduct } from "../interface/products.interface";
import styled from "styled-components";
import { getProducts } from "../productsAPI";
import { Circle, Star } from "phosphor-react";

// Tambahkan interface untuk props
interface ProductsListProps {
  searchTerm?: string;
}

function ProductsList({ searchTerm = "" }: ProductsListProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerGet = useRef<number>(0);

  useEffect(() => {
    const params: IParamsGetProduct = {
      skip: 0,
      limit: 100, // Increase limit to get more products for searching
      sortBy: "id",
      order: "asc",
    };
    getProductData(params);

    return () => {
      console.log("clean");
    };
  }, [triggerGet, refreshTrigger]);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const getProductData = async (params: IParamsGetProduct) => {
    try {
      const request: any = await getProducts({ ...params });
      setProducts(request);
      setAllProducts(request); // Store all products for backup
    } catch (error) {
      console.log(error);
    }
  };

  const onClickDetail = (item: IProduct) => {
    navigate(`/view-product/${item.id}`, { state: { product: item } });
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column gap-2">
            <TitleBasic>
              {searchTerm ? `Hasil Pencarian: "${searchTerm}"` : "Rekomendasi"}
            </TitleBasic>
            <Description>
              {searchTerm
                ? `Menampilkan ${filteredProducts.length} produk`
                : "Produk - produk pilihan terbaik dari kami"}
            </Description>
          </div>

          <StyledButtonWithout>Lihat Semua Produk</StyledButtonWithout>
        </div>

        <Row className="g-4" style={{ marginTop: "1rem" }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index: number) => (
              <Col md={3} key={product.id}>
                <StyledCard
                  className="w-100"
                  onClick={() => onClickDetail(product)}
                >
                  <StyledCardImg
                    variant="top"
                    src={`http://127.0.0.1:8000${product.image_url}`}
                  />
                  <StyledCardBody>
                    <TitleBasic>{product.name}</TitleBasic>

                    <PriceWrapper>
                      <Price>
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(product.price)}
                      </Price>
                      <DiscountBadge>-12%</DiscountBadge>
                    </PriceWrapper>

                    <BottomInfo>
                      <Star
                        size={16}
                        weight="fill"
                        style={{ color: "#FFB700" }}
                      />
                      <Description className="d-flex align-center">
                        4.9
                      </Description>
                      <Circle
                        size={10}
                        weight="fill"
                        style={{ color: "#E6E9F0" }}
                      />
                      <Description>{product.stock} Stock</Description>
                    </BottomInfo>
                  </StyledCardBody>
                </StyledCard>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <div className="text-center py-5">
                <Description>
                  {searchTerm
                    ? `Tidak ditemukan produk dengan kata kunci "${searchTerm}"`
                    : "Tidak ada produk yang tersedia"}
                </Description>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

const StyledCardBody = styled(Card.Body as any)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DiscountBadge = styled.div`
  background: #ffe9d6;
  color: #ff7900;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
`;

const BottomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
`;

const StyledCardImg = styled(Card.Img as any)`
  height: 12.25rem;
  object-fit: cover;
`;

const StyledCard = styled(Card as any)`
  display: flex;
  flex-direction: column;
  width: 100%;
  width: 19rem;
  height: 21.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--Border-Primary, #e6e9f0);
  overflow: hidden;
`;

const Price = styled.div`
  color: var(--Primary-Base, #ff7900);
  font-family: Inter;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
`;

const TitleBasic = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`;

const Description = styled.div`
  font-size: 14px;
  color: #5b5d63;
`;

const StyledButtonWithout = styled(Button as any)`
  height: 40px;
  padding: 0 12px;
  color: var(--black);
  border-radius: 10px;
  border: 1px solid var(--Border-Primary, #e7eaf0);
  background: var(--Background-Primary, #fff);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;

  &:hover {
    background: var(--Background-Primary, #fff);
    border: 1px solid var(--Border-Primary, #e7eaf0);
    color: var(--black);
  }
`;

export default ProductsList;
