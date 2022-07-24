/* === CRIADOR DE LISTA DE COMPRAS ===

Por: André Luís Costa Bandeira Coêlho (Matrícula: 2124290028 | Turma: ADSNM1A)

Descrição: Pensei em fazer algo para facilitar a vida de qualquer um que precise ir para o mercado fazer as compras mensais/semanais. A premissa do programa é auto-explicativa - ele obtém inputs do usuário, a partir dos quais gera uma lista de compras, que pode ser reordenada, reformatada e modificada a qualquer momento.

*/

"use strict";

// === VARIABLES ===
const body = document.querySelector("body");
const productField = document.querySelector("#product-field");
const amountField = document.querySelector("#amount-field");
const itemType = document.querySelector("#item-type");
const alertMsg = document.querySelector(".alert");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnAddItem = document.querySelector("#add-item");
const btnClearList = document.querySelector("#clear-list");
const btnUl = document.querySelector("#unordered-list");
const btnOl = document.querySelector("#ordered-list");
const btnYes = document.querySelector("#yes");
const btnNo = document.querySelector("#no");
const listContainer = document.querySelector(".list");

const alertMsgClasses = alertMsg.classList;

let items = [];
let itemz = [];
let createNewList = true;
let allowDuplicate = false;

// === FUNCTIONS ===
const toggleVisibilityInElementsOnHover = function (targetElem, arr) {
  const toggleVisibilityInElements = function (arr, onoff) {
    switch (onoff) {
      case 0:
        arr.forEach((element) => element.classList.add("visibility-hidden"));
        break;
      case 1:
        arr.forEach((element) => element.classList.remove("visibility-hidden"));
    }
  };

  targetElem.addEventListener("mouseover", () => {
    toggleVisibilityInElements(arr, 1);
  });
  targetElem.addEventListener("mouseleave", () => {
    toggleVisibilityInElements(arr, 0);
  });
};

const btnMagic = function () {
  const listElements = document.querySelectorAll("li");
  let liBtns = [];
  listElements.forEach((li) => {
    liBtns.push(li.querySelectorAll(".li-btn"));
  });
  // console.log("liBtns: ", liBtns, "\nLiBtns[0]:", liBtns[0]);
  listElements.forEach((li, i) => {
    toggleVisibilityInElementsOnHover(li, liBtns[i]);
    liBtns[i].forEach((btn, i) => {
      switch (i) {
        case 0:
          btn.addEventListener("click", () => moveItemUp(btn));
          break;
        case 1:
          btn.addEventListener("click", () => moveItemDown(btn));
          break;
        case 2:
          btn.addEventListener("click", () => RemoveItem(btn));
      }
    });
  });
};

const moveItemUp = function (element) {
  const li = element.parentElement;
  let arr = [];
  const listElements = document.querySelectorAll("li");

  listElements.forEach((li) => {
    arr.push(li.innerHTML);
  });

  const i = arr.indexOf(li.innerHTML);
  if (i !== 0) {
    const [x, y] = [arr[i - 1], arr[i]];
    listElements[i - 1].innerHTML = y;
    listElements[i].innerHTML = x;
  }
  btnMagic();
};

const moveItemDown = function (element) {
  const li = element.parentElement;
  let arr = [];
  const listElements = document.querySelectorAll("li");

  listElements.forEach((li) => {
    arr.push(li.innerHTML);
  });

  const i = arr.indexOf(li.innerHTML);
  if (i !== arr.length - 1) {
    const [x, y] = [arr[i], arr[i + 1]];
    listElements[i].innerHTML = y;
    listElements[i + 1].innerHTML = x;
  }
  btnMagic();
};

const RemoveItem = function (element) {
  const li = element.parentElement;
  const i = items.indexOf(li.innerText);
  const l = document.querySelector("#shoplist");
  // newList.remove();
  li.remove();
  if (l.children.length === 0) {
    l.remove();
    closeList();
  }
  items.splice(i, 1);
  console.log("ITEMS:", items); //
  btnMagic();
};

const closeModal = function () {
  if (!modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }
};

const closeList = function () {
  if (!listContainer.classList.contains("hidden"))
    listContainer.classList.add("hidden");
};

const addItem = function () {
  /* const */ let p = productField.value;

  if (items.includes(p) && !allowDuplicate) {
    modal.classList.remove("hidden"); // "Já existe um produto com esse nome na lista. Inserir mesmo assim?"
    overlay.classList.remove("hidden");
  } else {
    const listFormat = btnUl.classList.contains("format-btn-selected")
      ? "ul"
      : "ol";
    /* document.querySelector("#unordered-list").checked === true ? "ul" : "ol"; */

    // create elements
    const newList = document.createElement(listFormat); // = ul | ol
    const existingList = document.querySelector("#shoplist");
    const li = document.createElement("li");
    const btnMoveItemUp = document.createElement("button");
    const btnMoveItemDown = document.createElement("button");
    const btnRemoveItem = document.createElement("button");
    const liBtns = [btnMoveItemUp, btnMoveItemDown, btnRemoveItem];

    const amount = Number(amountField.value) <= 0 ? "1" : amountField.value;
    const product = amount === "" || amount === "1" ? p : `${p} (x${amount})`;

    // button setup
    btnMoveItemUp.innerHTML = "&#8679";
    btnMoveItemUp.title = "Mover item para cima";
    btnMoveItemUp.classList.add("li-btn", "move-item", "visibility-hidden");

    btnMoveItemDown.innerHTML = "&#8681";
    btnMoveItemDown.title = "Mover item para baixo";
    btnMoveItemDown.classList.add("li-btn", "move-item", "visibility-hidden");

    btnRemoveItem.innerHTML = "&times;";
    btnRemoveItem.title = "Remover item";
    btnRemoveItem.classList.add("li-btn", "remove-item", "visibility-hidden");

    //
    if (p === "") {
      // alertMsgClasses.remove("hidden"); // show alert if product field is empty
      alertMsg.innerHTML =
        "<p>Por favor, insira seu produto no espaço apropriado acima.</p><br>";
    } else {
      alertMsg.innerHTML = "";
      while (items.includes(p)) {
        p += "_";
      }
      items.push(p); // items++
      if (listContainer.classList.contains("hidden"))
        listContainer.classList.remove("hidden");

      // build up list
      li.append(product, btnMoveItemUp, btnMoveItemDown, btnRemoveItem); // append elements to list item
      if (existingList === null) {
        newList.id = "shoplist";
        newList.append(li);
        listContainer.append(newList); // append newly created list to container
        console.log(`existingList: ${existingList}
        existingList_: ${document.querySelector("#shoplist")}`); //
      } else {
        existingList.append(li);
      }
    }

    toggleVisibilityInElementsOnHover(li, liBtns);

    btnMoveItemDown.addEventListener("click", function() {
      moveItemDown(this);
      // btnMagic();
    }); //

    btnMoveItemUp.addEventListener("click", function() {
      moveItemUp(this);
      // btnMagic();
    }); //

    btnRemoveItem.addEventListener("click", function() {
      /*       const i = items.indexOf(p);
      const l = document.querySelector("#shoplist");
      // newList.remove();
      li.remove();
      if (l.children.length === 0) {
        l.remove();
        closeList();
      }
      items.splice(i, 1);
      console.log("ITEMS:", items); //
      btnMagic(); */
      RemoveItem(this);
    });

    // if (p !== "") items.push(p);

    // itemz.push([li, liBtns]);
    itemz.push({
      itemName: p,
      itemAmount: amount,
      HTMLElements: {
        li: li,
        buttons: liBtns
      }
    })

    // show info
    console.log(
      `=== INFO ===
  
    allowDuplicate: ${allowDuplicate}
    existingList: ${existingList}
    ITEMS:`,
      itemz
    );
  }
};

// === EVENT LISTENERS ===
btnAddItem.addEventListener("click", addItem);

btnClearList.addEventListener("click", () => {
  if (listContainer.children.length === 0) {
    alertMsg.innerHTML = "<p>Não há itens para remover!</p><br>";
  } else {
    listContainer.innerHTML = "";
    items = []; //
    itemz = [];
    closeList();
    showInfo(); //
  }
});

btnUl.addEventListener("click", () => {
  const existingList = document.querySelector("#shoplist");

  /*   console.log("tag name: ", existingList.tagName); */
  if (existingList !== null && existingList.tagName.toLowerCase() === "ol") {
    const ul = document.createElement("ul"); // CONVERTER P FUNÇÃO
    ul.id = existingList.id;
    ul.innerHTML = existingList.innerHTML;
    existingList.parentElement.replaceChildren(ul);
    btnMagic();
  }
  if (!btnUl.classList.contains("format-btn-selected")) {
    btnUl.classList.add("format-btn-selected");
    btnOl.classList.remove("format-btn-selected");
  }
});

btnOl.addEventListener("click", () => {
  const existingList = document.querySelector("#shoplist");

  if (existingList !== null && existingList.tagName.toLowerCase() === "ul") {
    const ol = document.createElement("ol"); // CONVERTER P FUNÇÃO
    ol.id = existingList.id;
    ol.innerHTML = existingList.innerHTML;
    existingList.parentElement.replaceChildren(ol);
    btnMagic();
  }
  if (!btnOl.classList.contains("format-btn-selected")) {
    btnOl.classList.add("format-btn-selected");
    btnUl.classList.remove("format-btn-selected");
  }
});

btnYes.addEventListener("click", () => {
  closeModal();
  allowDuplicate = true;
  addItem();
  allowDuplicate = false;
});

btnNo.addEventListener("click", closeModal);

const showInfo = function () {
  console.log(
    `=== INFO ===

  ITEMS:`,
    itemz
  );
}

/*
BUGS/ERRORS:

- the (lazy) way to get something similar to the "p" local variable from the addItem function in the removeItem function doesn't quite cut it. Look for a way to do it better.
- "items" array gets messed up with items getting moved up and down or getting deleted. This is a problem because sometimes the elements in the array end up unbound to the items in the list, which gives room to issues like the ability to add a duplicate item in the list without triggering the warning modal for that.

SUGGESTION: maybe reformulate the "items" array functionality altogether.
*/
