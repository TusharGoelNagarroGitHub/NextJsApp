import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}

interface ProductsProps {
  products: Product[];
}

const ProductsList: FC<ProductsProps> = ({ products }) => {
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.query.category) {
      setFilteredCategory(router.query.category as string);
    }
  }, [router.query.category]);


  const categories = Array.from(new Set(products.map((product) => product.category)));


  const filteredProducts = filteredCategory
    ? products.filter((product) => product.category === filteredCategory)
    : products;


  const handleFilterChange = (category: string | null) => {
    setFilteredCategory(category);
    router.push(category ? `?category=${category}` : '/', undefined, { shallow: true });
  };

  return (
    <div>
      <h1>Products</h1>     
      <div>
        <button onClick={() => handleFilterChange(null)}>All </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            style={{ fontWeight: filteredCategory === category ? "bold" : "normal" }}
          >
            {category}
          </button>
        ))}
      </div>  
      <ul>
        {filteredProducts.map((product) => (
          <Link href={`/Product/${product.id}`} key={product.id}>
            <li>
              <h3>{product.title}</h3>
              <p>{product.price}</p>
              <p>{product.category}</p>
              <hr />
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch("http://localhost:4000/products");
  const products: Product[] = await res.json();

  return {
    props: {
      products,
    },
    revalidate: 60, 
  };
}

export default ProductsList;
