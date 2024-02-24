// get elements -------------------------------------
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let totalOutput = document.getElementById("total-output");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("btn-create");
let tbody = document.getElementById("tbody");
let captionTab = document.getElementById("captionTab");
let deleteAll = document.getElementById("deleteAll");

console.log(
  title,
  price,
  taxes,
  totalOutput,
  ads,
  discount,
  total,
  count,
  category,
  create
);

// declare variable -------------------------------------
let products = [];
let state = -1;

// calc price -------------------------------------
function calcPrice() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    totalOutput.innerHTML = result;
  } else {
    totalOutput.innerHTML = "";
  }
}

// crate product -------------------------------------
create.onclick = () => {
  let newPro = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: totalOutput.innerHTML,
    category: category.value,
    count: count.value,
  };

  if (state == -1) {
    fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPro),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert(data.message);
      });
  } else {
    fetch(`http://localhost:3000/products/${state}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPro),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert(data.message);
      });
  }

  clearData();
  showProduct();
};



// clear inputs after click btn -------------------------------------
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  totalOutput.innerHTML = "";
  count.value = "";
  category.value = "";
}

// read data from array and show in table -------------------------------------
function showProduct() {
  let items = "";
  fetch("http://localhost:3000/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.data.length) {
        deleteAll.style.display = "inline";
      }
      captionTab.innerHTML = `Number of Products: ${data.data.length}`;
      for (let i = 0; i < data.data.length; i++) {
        items += `<tr>
                <td>${data.data[i].id}</td>
                <td>${data.data[i].title}</td>
                <td>${data.data[i].price}</td>
                <td>${data.data[i].taxes}</td>
                <td>${data.data[i].ads}</td>
                <td>${data.data[i].discount}</td>
                <td>${data.data[i].total}</td>
                <td>${data.data[i].category}</td>
                <td><button class="update" onclick="updateItem(${data.data[i].id})">update</button></td>
                <td><button class="Delete" onclick="deleteItem(${data.data[i].id})">Delete</button></td>
              </tr>`;
      }
    })
    .then(() => {
      tbody.innerHTML = items;
    });
}

// delete items from Array -------------------------------------
function deleteItem(itemNum) {
  fetch(`http://localhost:3000/products/${itemNum}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .then(() => {
      showProduct();
    });
}
deleteAll.onclick = () => {
  products.splice(0, products.length);
  showProduct();
};

// update items  -------------------------------------
function updateItem(itemNum) {
  create.innerHTML = "update";
  fetch(`http://localhost:3000/products/${itemNum}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      title.value = data.data[0].title;
      price.value = data.data[0].price;
      taxes.value = data.data[0].taxes;
      ads.value = data.data[0].ads;
      discount.value = data.data[0].discount;
      totalOutput.innerHTML = `${data.data[0].total}`;
      count.style.display = "none";
      category.value = data.data[0].category;
    });

  state = itemNum;
}

// call functions -------------------------------------
showProduct();
