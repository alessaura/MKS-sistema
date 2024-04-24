'use client';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { TiShoppingCart } from 'react-icons/ti';
import { FiShoppingBag } from 'react-icons/fi';
import 'react-loading-skeleton/dist/skeleton.css';
import { IoCloseCircle } from 'react-icons/io5';
import SkeletonComponent from './components/skeleton/Skeleton';
import styles from './page.module.scss';
import axios from 'axios';

interface Products {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  photo: string;
  qtd?: number;
}

interface Data {
  products: Products[];
}

export default function Home() {
  const [cart, setCart] = useState<Products[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [priceQtd, setPrice] = useState<number>(0);

  const { data, isLoading } = useQuery('items', async () => {
    return axios
      .get<Data>(
        'https://mks-frontend-challenge-04811e8151e6.herokuapp.com/api/v1/products?page=1&rows=8&sortBy=id&orderBy=DESC'
      )
      .then(({ data }) => data.products);
  }, {
    retry: 2,
  });

  return (
    <>
      <header className={styles.navMenu}>
        <div>
          <p className={styles.mks}> MKS
          <span className={styles.system}>Sistemas</span>
          </p>
        </div>
        <button onClick={() => setShowCart(true)} className={styles.btnCart}>
        <TiShoppingCart className={styles.cart} />{" "}
        <p className={styles.cartNumber}>
        {cart.reduce((total, item) => total + (item.qtd || 0), 0)}
        </p>
        </button>

      </header>
      {showCart && (
        <div className={styles.shownCart}>
          <div className={styles.titleCart}>
            <h1 className={styles.cartTitle}>Carrinho de compras</h1>
            <IoCloseCircle
              onClick={() => setShowCart(false)}
              className={styles.closeCart}
            />
          </div>
          <div className={styles.divTotalAndProducts}>
            <div className={styles.cartItems}>
              {cart.map(product => {
                let newPrice = product.qtd || 1;

                function addProduct() {
                  const updatedCart = cart.map(item => {
                    if (item.id === product.id) {
                      return { ...item, qtd: (item.qtd || 0) + 1 };
                    }
                    return item;
                  });
                  setCart(updatedCart);
                  setPrice(priceQtd + Number(product.price));
                }

                function removeProduct() {
                  const updatedCart = cart.map(item => {
                    if (item.id === product.id) {
                      return { ...item, qtd: (item.qtd || 0) - 1 };
                    }
                    return item;
                  });
                  setCart(updatedCart.filter(item => item.qtd !== 0));
                  setPrice(priceQtd - Number(product.price));
                }

                return (
                  <div key={product.id} className={styles.itemDivCart}>
                    <div className={styles.productCartItem}>
                      <img
                        className={styles.cartImg}
                        src={product.photo}
                        alt="productImg"
                      />
                      <h1 className={styles.cartItemName}>{product.name}</h1>
                      <div className={styles.qtdValue}>
                        <p className={styles.qtdItem}>Qtd:</p>
                        <div className={styles.btnCartPlusLess}>
                          <div
                            data-testid="less"
                            onClick={removeProduct}
                            className={styles.btnPlus}
                          >
                            -
                          </div>
                          <hr className={styles.line} />
                          <p className={styles.qtdBtn}>{product.qtd}</p>
                          <hr className={styles.line} />
                          <div
                            data-testid="more"
                            onClick={() => addProduct()}
                            className={styles.btnLess}
                          >
                            +
                          </div>
                        </div>
                      </div>
                      <h3 className={styles.productCartPrice}>
                        R${Math.trunc(product.price * newPrice)}
                      </h3>
                    </div>
                    <IoCloseCircle
                      data-testid="removeCart"
                      onClick={() => {
                        const updatedCart = cart.filter(
                          item => item.id !== product.id
                        );
                        setCart(updatedCart);
                        setPrice(
                          priceQtd -
                            Number(product.price) * (product.qtd || 1)
                        );
                      }}
                      className={styles.btnRemove}
                    />
                  </div>
                );
              })}
            </div>
            <div className={styles.totalAndPrice}>
              <div className={styles.total}>
                <h3>Total:</h3>
              </div>
              <div className={styles.price}>
                <h3>
                  R${priceQtd.toLocaleString("pt-br", {
                    minimumFractionDigits: 0,
                  })}
                </h3>
              </div>
            </div>
            <button className={styles.endBtn}>
              <p>Finalizar Compra</p>
            </button>
          </div>
        </div>
      )}
      {!isLoading ? (
        <div className={styles.mainDivProducts}>
          {data!.map((product: Products) => (
            <div className={styles.divProduct} key={product.id}>
              <img
                className={styles.img}
                src={product.photo}
                alt={product.name}
              />
              <div className={styles.namePrice}>
                <div className={styles.divName}>
                  <h1 className={styles.productName}>{product.name}</h1>
                </div>
                <div className={styles.divPrice}>
                  <h3>
                    R${Math.trunc(product.price)}
                  </h3>
                </div>
              </div>
              <p className={styles.productDescription}>{product.description}</p>
              <button
                data-testid="addCart"
                onClick={() => {
                  if (!cart.find((item) => item.id === product.id)) {
                    product.qtd = 1;
                    setPrice(priceQtd + Number(product.price));
                    setCart([...cart, product]);
                  } else {
                    const updatedCart = cart.map((item) => {
                      if (item.id === product.id) {
                        return { ...item, qtd: (item.qtd || 0) + 1 };
                      }
                      return item;
                    });
                    setCart(updatedCart);
                    setPrice(priceQtd + Number(product.price));
                  }
                }}
                className={styles.buyBtn}
              >
                <FiShoppingBag className={styles.shop} />
                <p>COMPRAR</p>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <SkeletonComponent />
      )}
      <footer className={styles.footer}>
        MKS sistemas © Todos os direitos reservados
      </footer>
    </>
  );
}
