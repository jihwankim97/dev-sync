import { useState, useEffect } from "react";

const FetchCategories = () => {
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { category_id: number; category: string }[]
  >([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/post/categories`, {
        credentials: "include", // 세션 쿠키 포함
      });
      if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      setCategories([]);
      setError("데이터를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, error, refetch: fetchCategories };
};

export default FetchCategories;
