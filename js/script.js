const loadCategoryData = async () => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/news/categories`
    );
    const data = await res.json();
    displayCategory(data.data.news_category);
  } catch (error) {
    console.log("error happened", error);
  }
};

const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-nav");
  categories.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <button onclick="loadNews('${category.category_id}')">${category.category_name}</button>
    `;
    categoryContainer.appendChild(div);
  });
};

const loadNews = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/news/category/${id}`
  );
  const data = await res.json();
  document.getElementById(
    "number-of-news"
  ).innerText = `${data.data.length} news found in Breaking News`;
  displayNews(data.data);
};

const displayNews = (news) => {};

loadCategoryData();
