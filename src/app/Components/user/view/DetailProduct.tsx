import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { IProduct } from "../interface/products.interface";
import { DFlex, DFlexColumn } from "../../../react-table/flex.styled";
import { Star } from "phosphor-react";
import ReactMarkdown from "react-markdown";

export default function ProductDetail() {
  const { state } = useLocation();
  const { product } = state || {};
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  if (!product) {
    return <div>Produk tidak ditemukan.</div>;
  }

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  return (
    <Container>
      <div className="py-4">
        <div className="d-flex flex-column gap-4">
          <Row className="g-1">
            <Col md={4}>
              <StyledImg src={`http://127.0.0.1:8000${product.image_url}`} />
              <DFlex>
                <StyledImgSmall
                  src={`http://127.0.0.1:8000${product.image_url}`}
                />
                <StyledImgSmall
                  src={`http://127.0.0.1:8000${product.image_url}`}
                />
                <StyledImgSmall
                  src={`http://127.0.0.1:8000${product.image_url}`}
                />
                <StyledImgSmall
                  src={`http://127.0.0.1:8000${product.image_url}`}
                />
              </DFlex>
            </Col>

            <Col md={8}>
              <StyledCard>
                <Title>{product.name}</Title>
                <div className="d-flex align-items-center gap-2">
                  <Description>4.9</Description>
                  <Star size={16} weight="fill" style={{ color: "#FFB700" }} />
                  <Label>{product.stock} Terjual </Label>
                </div>
                <PriceWrapper>
                  <StyledPrice>
                    {" "}
                    Rp {new Intl.NumberFormat("id-ID").format(
                      product.price
                    )}{" "}
                  </StyledPrice>
                  <DiscountBadge>-12%</DiscountBadge>
                </PriceWrapper>

                <InfoRow>
                  <Label>Pengiriman</Label>
                  <div className="d-flex flex-column gap-2">
                    <SubTitle>Garansi Tiba: 4 - 6 September</SubTitle>
                    <SubText>
                      Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat.
                    </SubText>
                  </div>
                </InfoRow>

                <InfoRow>
                  <Label>Kuantitas</Label>
                  <QuantityWrapper>
                    <QuantityButton onClick={handleMinus}>−</QuantityButton>
                    <QuantityValue>{quantity}</QuantityValue>
                    <QuantityButton onClick={handlePlus}>+</QuantityButton>
                    <StockStatus>Tersedia</StockStatus>
                  </QuantityWrapper>
                </InfoRow>

                <BuyButton>Beli Produk</BuyButton>
              </StyledCard>
            </Col>
          </Row>

          <BorderDescripcion>Deskripsi Produk</BorderDescripcion>
          <DescriptionV>
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </DescriptionV>
        </div>
      </div>
    </Container>
  );
}

const SubText = styled.div`
  color: var(--Font-Secondary, #5b5d63);

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

const SubTitle = styled.div`
  color: var(--Font-Primary, #050506);

  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
`;

const BorderDescripcion = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  color: #000;

  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  gap: 0.625rem;
  align-self: stretch;
  border-radius: 0.75rem;
  background: var(--BG-Secondary, #f5f7fa);
`;

const StyledImg = styled.img`
  width: 25.875rem;
  height: 23.625rem;
  object-fit: cover;
  border-radius: 0.75rem;
`;

const Description = styled.div`
  font-size: 14px;
  color: #5b5d63;
`;

const DescriptionV = styled.div`
  color: #000;

  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const StyledCard = styled.div`
  width: 39.375rem;
  padding: 1.5rem;
  min-height: 23.625rem;
  align-items: center;
  gap: 2.5rem;

  border-radius: 0.75rem;
  border: 1px solid var(--Border-Primary, #e6e9f0);
  background: var(--BG-Primary, #fff);
`;

const StyledPrice = styled.p`
  color: var(--Primary-Base, #ff7900);
  font-family: Inter;
  font-size: 2rem;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  margin-top: 1.2rem;
`;

const StyledImgSmall = styled.img`
  height: 5.375rem;
  flex: 1 0 0;
  aspect-ratio: 94.5/86;
  border-radius: 0.75rem;
  object-fit: cover;
`;

const Title = styled.div`
  color: #000;

  font-size: 1.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`;

const DiscountBadge = styled.div`
  background: #ffe9d6;
  color: #ff7900;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuantityButton = styled.button`
  border: 1px solid #ccc;
  background: #fff;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background: #f2f2f2;
  }
`;

const QuantityValue = styled.div`
  width: 30px;
  text-align: center;
  font-weight: 500;
`;

const StockStatus = styled.div`
  background: #eaf7e7;
  color: #008a1e;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
`;

const BuyButton = styled.button`
  border-radius: 0.625rem;
  background: var(--Primary-Base, #ff7900);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  width: 100%;
  font-size: 0.875rem;

  font-weight: 500;
  line-height: 1.25rem;
  margin-top: 1rem;
  height: 2.5rem;
  cursor: pointer;
  &:hover {
    background: #ff8a1a;
  }
`;

const Label = styled.div`
  width: 7rem;
  color: var(--Font-Primary, #050506);

  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
