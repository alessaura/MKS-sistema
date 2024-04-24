import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from './page';

jest.mock('axios');

describe('Home component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Home component without crashing', () => {
    render(<Home />);
    expect(screen.getByText(/MKS/i)).toBeInTheDocument();
    expect(screen.getByText(/Sistemas/i)).toBeInTheDocument();
  });

  test('adds product to cart when add button is clicked', async () => {
    const mockProduct = {
      id: 1,
      name: 'Product Name',
      price: 10,
      photo: 'image.jpg',
    };

    axios.get.mockResolvedValueOnce({ data: { products: [mockProduct] } });

    render(<Home />);

    const addButton = screen.getByTestId('addCart');
    fireEvent.click(addButton);

    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByTestId('shownCart')).toBeInTheDocument();
    expect(screen.getByText(/R\$10/i)).toBeInTheDocument();
  });

  test('removes product from cart when remove button is clicked', async () => {
    const mockProduct = {
      id: 1,
      name: 'Product Name',
      price: 10,
      photo: 'image.jpg',
    };

    axios.get.mockResolvedValueOnce({ data: { products: [mockProduct] } });

    render(<Home />);

    const addButton = screen.getByTestId('addCart');
    fireEvent.click(addButton);

    const removeButton = screen.getByTestId('removeCart');
    fireEvent.click(removeButton);

    expect(screen.queryByText(/1/i)).toBeNull();
    expect(screen.queryByTestId('shownCart')).toBeNull();
    expect(screen.getByText(/R\$0/i)).toBeInTheDocument();
  });

  test('increases product quantity in cart when increase button is clicked', async () => {
    const mockProduct = {
      id: 1,
      name: 'Product Name',
      price: 10,
      photo: 'image.jpg',
    };

    axios.get.mockResolvedValueOnce({ data: { products: [mockProduct] } });

    render(<Home />);

    const addButton = screen.getByTestId('addCart');
    fireEvent.click(addButton);

    const increaseButton = screen.getByTestId('more');
    fireEvent.click(increaseButton);

    expect(screen.getByText(/2/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$20/i)).toBeInTheDocument();
  });

  test('decreases product quantity in cart when decrease button is clicked', async () => {
    const mockProduct = {
      id: 1,
      name: 'Product Name',
      price: 10,
      photo: 'image.jpg',
    };

    axios.get.mockResolvedValueOnce({ data: { products: [mockProduct] } });

    render(<Home />);

    const addButton = screen.getByTestId('addCart');
    fireEvent.click(addButton);

    const decreaseButton = screen.getByTestId('less');
    fireEvent.click(decreaseButton);

    expect(screen.queryByText(/1/i)).toBeNull();
    expect(screen.queryByTestId('shownCart')).toBeNull();
    expect(screen.getByText(/R\$0/i)).toBeInTheDocument();
  });
});
