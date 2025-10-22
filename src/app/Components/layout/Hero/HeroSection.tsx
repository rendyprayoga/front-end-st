import React from "react";
import styled from "styled-components";
import { MagnifyingGlass } from "phosphor-react";
import { DFlex } from "../../../react-table/flex.styled";

export default function HeroSection() {
  return (
    <HeroWrapper>
      <Overlay />
      <Content>
        <Title>Cari Funitur Impian</Title>
        <Description>
          Cari furnitur mulai dari meja, lemari, hingga rak disini
        </Description>

        <DFlex>
          <SearchBar>
            <input type="text" placeholder="Cari produk" />
          </SearchBar>

          <ButtonSearch>
            {" "}
            <MagnifyingGlass size={20} />
          </ButtonSearch>
        </DFlex>
      </Content>
    </HeroWrapper>
  );
}

const HeroWrapper = styled.div`
  position: relative;
  height: 400px;
  background-image: url("/bg-image.jpg");
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  width: 600px;
  max-width: 100%;
  background: white;
  border-radius: 50px;
  overflow: hidden;

  input {
    flex: 1;
    border: none;
    padding: 14px 20px;
    font-size: 14px;
    outline: none;
  }
`;

const ButtonSearch = styled.button`
  display: flex;
  width: 3.25rem;
  height: 3.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  aspect-ratio: 1/1;
  border: none;
  color: #fff;
  border-radius: 6.1875rem;
  background: var(--Primary-Base, #ff7900);
`;

const Description = styled.div`
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  color: var(--Font-On-Accent, #fff);
`;
