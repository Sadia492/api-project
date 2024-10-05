// for category data loading
const loadCategoryData = async () => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/news/categories`
    );
    const data = await res.json();
    displayCategory(data.data.news_category);

    // Load the first category and add the active class
    if (data.data.news_category.length > 0) {
      const firstCategoryId = data.data.news_category[0].category_id;
      loadNews(firstCategoryId);

      // Add classes to the first button by default
      const firstCategoryBtn = document.getElementById(
        `btn-${firstCategoryId}`
      );
      if (firstCategoryBtn) {
        firstCategoryBtn.classList.add(
          "text-blue-500",
          "border-b-2",
          "border-blue-500"
        );
      }
    }
  } catch (error) {
    console.log("error happened", error);
  }
};

// for category links displaying
const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-nav");
  categories.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <button id="btn-${category.category_id}" class="category-btn" onclick="loadNews('${category.category_id}')">${category.category_name}</button>
    `;
    categoryContainer.appendChild(div);
  });
};

// for removing class from all the buttons
const removeClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (const btn of buttons) {
    btn.classList.remove("text-blue-500", "border-b-2", "border-blue-500");
  }
};

// for loading news
const loadNews = async (id) => {
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("news-container").classList.add("hidden");
  document.getElementById("no-data").classList.add("hidden");

  mostviewed.length = 0; // Clear mostviewed array for each category
  const res = await fetch(
    `https://openapi.programming-hero.com/api/news/category/${id ? id : "01"}`
  );
  const data = await res.json();
  loadTrendingNews(id);

  //   if (status === true) {
  //     if (data.data?.others_info?.is_trending === true) {
  //       console.log("hello");
  //     }
  //   }

  const sortedNews = data.data.sort(
    (a, b) => (b.total_view || 0) - (a.total_view || 0)
  );
  setTimeout(() => {
    displayNews(sortedNews);
    if (data.data.length === 0) {
      document.getElementById("no-data").classList.remove("hidden");
    } else {
      document.getElementById("no-data").classList.add("hidden");
    }
    document.getElementById("number-of-news").innerText = `${
      data.data.length === 0
        ? `No News Found`
        : `${data.data.length} news found in Breaking News`
    } `;
  }, 3000);

  removeClass();
  const categoryBtn = document.getElementById(`btn-${id}`);
  categoryBtn.classList.add("text-blue-500", "border-b-2", "border-blue-500");
};

let mostviewed = [];

// for displaying news
const displayNews = (news) => {
  document.getElementById("spinner").classList.add("hidden");
  document.getElementById("news-container").classList.remove("hidden");
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = "";

  news.forEach((item) => {
    mostviewed.push(item);

    const {
      author: { img, name, published_date },
      image_url,
      title,
      details,
      total_view,
    } = item;

    const maxLength = 300; // Set max length for button attributes
    const sanitizedDetails =
      details.length > maxLength
        ? details.substring(0, maxLength) + "..."
        : details;

    const div = document.createElement("div");
    div.classList.add("shadow-md", "rounded-lg", "border-2", "lg:p-5", "p-1");
    div.innerHTML = `
    <div class="col">
            <div class="singleNews grid grid-cols-1 lg:grid-cols-4">
              <div
                class=" d-flex justify-content-center align-items-center"
              >
                <img class="w-full rounded-lg h-full object-cover"
                  src=${image_url}
                />
              </div>
              <div class="content p-5 col-span-3">
                <article class="writings space-y-5">
                  <h1 class="text-3xl font-extrabold">${title}</h1>
                  <p class="mb-5 multiline">
              ${sanitizedDetails}
                  </p>
                </article>

                <div
                  class="info d-md-flex justify-content-between align-items-center"
                >
                  <div class="author d-flex">
                    <div class="author-img rounded-full w-10 h-10">
                      <img
                        class="author-img w-full rounded-full object-cover"
                        src=${img}
                        alt=""
                      />
                    </div>
                    <div class="author-info px-3">
                      <h5>${name ? name : "No data available"}</h5>
                      <p>${
                        published_date ? published_date : " No data available"
                      }</p>
                    </div>
                  </div>
                  <div class="views">
                    <h5 class="text-lg font-bold">${
                      total_view ? `${total_view} Views` : "No data available"
                    } </h5>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-blue-500">
        <button onclick="showAModal('${image_url}',\`${sanitizedDetails}\`,\`${title}\`, \`${img}\`,\`${total_view}\`, \`${name}\`)">
    <img src="https://img.icons8.com/?size=50&id=11759&format=png" />
  </button>
</div>

                </div>
              </div>
            </div>
          </div>
    
    `;
    newsContainer.appendChild(div);
  });
  console.log(mostviewed.length);
};

// for showing modal
const showAModal = (img, details, title, profile, total_view, name) => {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = `
      <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold border-b-2 mb-2">${title}</h3>
          <img src=${img} />
  
          <div class="flex items-center mt-3 justify-between gap-4">
            <div class="flex items-center">
              <img class="w-10 h-10 mr-2 rounded-full" src=${profile} >
              <p class="font-bold">${name}</p>
            </div>
            <p class="font-bold">${total_view} Views</p>
          </div>
          <p class="py-4">${details}</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    `;

  // Adding a delay to ensure modal is rendered
  setTimeout(() => {
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      modal.showModal();
    }
  }, 100);
};

// for showing trending news
// for loading trending news
const loadTrendingNews = async (id) => {
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("news-container").classList.add("hidden");
  document.getElementById("trending-container").classList.add("hidden");
  document.getElementById("no-data").classList.add("hidden");

  // Clear the previous trending data
  empty.length = 0; // Clear empty array for each category

  // Fetching all the categories to get trending news
  const res = await fetch(
    `https://openapi.programming-hero.com/api/news/category/${id ? id : "01"}`
  );
  const data = await res.json();

  // Sort trending news by views
  const sorted = data.data.sort(
    (a, b) => (b.total_view || 0) - (a.total_view || 0)
  );

  setTimeout(() => {
    displayTrending(sorted);
    if (data.data.length === 0) {
      document.getElementById("no-data").classList.remove("hidden");
    } else {
      document.getElementById("no-data").classList.add("hidden");
    }
  }, 3000);
};
let empty = [];
const displayTrending = (data) => {
  //   document.getElementById("trending-container").classList.remove("hidden");
  const trendingContainer = document.getElementById("trending-container");
  trendingContainer.innerHTML = "";

  data.forEach((single) => {
    if (single.others_info.is_trending === true) {
      empty.push(single);
      const {
        author: { img, name, published_date },
        image_url,
        title,
        details,
        total_view,
      } = single;

      const maxLength = 300; // Set max length for button attributes
      const sanitizedDetails =
        details.length > maxLength
          ? details.substring(0, maxLength) + "..."
          : details;

      const div = document.createElement("div");
      div.classList.add("shadow-md", "rounded-lg", "border-2", "lg:p-5", "p-1");
      div.innerHTML = `
    <div class="col">
            <div class="singleNews grid grid-cols-1 lg:grid-cols-4">
              <div
                class=" d-flex justify-content-center align-items-center"
              >
                <img class="w-full rounded-lg h-full object-cover"
                  src=${image_url}
                />
              </div>
              <div class="content p-5 col-span-3">
                <article class="writings space-y-5">
                  <h1 class="text-3xl font-extrabold">${title}</h1>
                  <p class="mb-5 multiline">
              ${sanitizedDetails}
                  </p>
                </article>

                <div
                  class="info d-md-flex justify-content-between align-items-center"
                >
                  <div class="author d-flex">
                    <div class="author-img rounded-full w-10 h-10">
                      <img
                        class="author-img w-full rounded-full object-cover"
                        src=${img}
                        alt=""
                      />
                    </div>
                    <div class="author-info px-3">
                      <h5>${name ? name : "No data available"}</h5>
                      <p>${
                        published_date ? published_date : " No data available"
                      }</p>
                    </div>
                  </div>
                  <div class="views">
                    <h5 class="text-lg font-bold">${
                      total_view ? `${total_view} Views` : "No data available"
                    } </h5>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-blue-500">
       <button onclick="hello('${image_url}',\`${sanitizedDetails}\`,\`${title}\`, \`${img}\`,\`${total_view}\`, \`${name}\`)">
    <img src="https://img.icons8.com/?size=50&id=11759&format=png" />
  </button>

</div>

                </div>
              </div>
            </div>
          </div>
    
    `;
      trendingContainer.appendChild(div);
    }
  });
};

//

const hello = (img, details, title, profile, total_view, name) => {
  const modalContainer = document.getElementById("trending-modal-container");
  modalContainer.innerHTML = `
         <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold border-b-2 mb-2">${title}</h3>
          <img src=${img} />
  
          <div class="flex items-center mt-3 justify-between gap-4">
            <div class="flex items-center">
              <img class="w-10 h-10 mr-2 rounded-full" src=${profile} >
              <p class="font-bold">${name}</p>
            </div>
            <p class="font-bold">${total_view} Views</p>
          </div>
          <p class="py-4">${details}</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    `;
  // Adding a delay to ensure modal is rendered
  setTimeout(() => {
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      modal.showModal();
    }
  }, 100);
};
//
document.getElementById("trendy-btn").addEventListener("click", () => {
  document.getElementById("news-container").classList.add("hidden");
  document.getElementById("trending-container").classList.remove("hidden");
  document
    .getElementById("most-viewed-btn")
    .classList.remove("btn-outline-primary");
  console.log(empty.length);
  document.getElementById("number-of-news").innerText = `${
    empty.length === 0
      ? `No Trending News Found`
      : `${empty.length} trending news found`
  } `;
});

document.getElementById("most-viewed-btn").addEventListener("click", () => {
  document.getElementById("news-container").classList.remove("hidden");
  document.getElementById("trending-container").classList.add("hidden");
  document
    .getElementById("most-viewed-btn")
    .classList.add("btn-outline-primary");
  document.getElementById("number-of-news").innerText = `${
    mostviewed.length === 0
      ? `No News Found`
      : `${mostviewed.length} news found in Breaking News`
  } `;
});

loadCategoryData();
