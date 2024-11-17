import { FC } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';


interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}


interface Props {
  product: Product;
}

const SingleProduct: FC<Props> = ({ product }) => {
  const router = useRouter();
  
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <p>ID:{product.id}</p>
      <p>Product:{product.title}</p>      
      <p>Price:{product.price}</p>
      <p>Category:{product.category}</p>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {

  const res = await fetch('http://localhost:4000/products');
  const products: Product[] = await res.json();
  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return {
    paths,
    fallback: true, 
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { params } = context; 
  const res = await fetch(`http://localhost:4000/products?id=${params?.id}`);
  const data: Product[] = await res.json(); 
  const product = data[0]; 

  return {
    props: {
      product:product,
    },
    revalidate: 60,
  };
};

export default SingleProduct;
