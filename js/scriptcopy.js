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

let items = []; //
let itemsData = [];
let itemIDGen = 0;
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

const moveItemUp = function (li) {
  const i = itemsData.findIndex(item => item.itemID === li.id)
  const existingList = document.querySelector("#shoplist");

  if (i !== 0) {
    const [movingDown, movingUp] = [itemsData[i - 1], itemsData[i]];
    itemsData[i] = movingDown;
    itemsData[i - 1] = movingUp;
  }

  existingList.innerHTML = "";
  itemsData.forEach(item => existingList.append(item.HTMLElements.li)); // converter p funcao

  console.log("ID of li to move up:", li.id, "\nIndex of li to move up:", i, "\nITEMS:", itemsData);  //
};

const moveItemDown = function (li) {
  const i = itemsData.findIndex(item => item.itemID === li.id)
  const existingList = document.querySelector("#shoplist");

  if (i !== itemsData.length - 1) {
    const [movingDown, movingUp] = [itemsData[i], itemsData[i + 1]]
    itemsData[i] = movingUp;
    itemsData[i + 1] = movingDown;
  }

  existingList.innerHTML = "";
  itemsData.forEach(item => existingList.append(item.HTMLElements.li)); // converter p funcao
  
  console.log("ID of li to move down:", li.id, "\nIndex of li to move down:", i, "\nITEMS:", itemsData);  //
};

const RemoveItem = function (li) {
  const i = itemsData.findIndex(item => item.itemID === li.id);
  const l = document.querySelector("#shoplist");

  itemsData.splice(i, 1);
  li.remove();
  if (l.children.length === 0) {
    l.remove();
    itemIDGen = 0;  // resets item ID generator
    closeList();
  }

  console.log("ID of deleted li:", li.id, "\nIndex of deleted li:", i, "\nITEMS:", itemsData, "\nl.children.length:", l.children.length); //
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

const reformatList = function (type) {
  try {
    if (type !== "ul" && type !== "ol") throw new Error("Argument 'type' must be set to either 'ol' or 'ul'.");

    const existingList = document.querySelector("#shoplist");
    const reverseType = type === "ul" ? "ol" : "ul";
  
    if (existingList && existingList.tagName.toLowerCase() === reverseType) {
      const newListType = document.createElement(type);
      newListType.id = existingList.id;
      itemsData.forEach(item => newListType.append(item.HTMLElements.li));
      listContainer.replaceChildren(newListType);
    }
  } catch(e) {
    console.error(e);
  }
}

const addItem = function () {
  /* const */ let p = productField.value;

  if (p === "") {
    alertMsg.innerHTML =
      "<p>Por favor, insira seu produto no espaço apropriado acima.</p><br>";
  } else {
    if (alertMsg.innerHTML) alertMsg.innerHTML = "";
    if (listContainer.classList.contains("hidden"))
    listContainer.classList.remove("hidden");

    if (itemsData.some(item => item.itemName === p) && !allowDuplicate) {
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
      
      li.id = 'li-' + itemIDGen;
  
      itemsData.push({
        itemID: li.id,
        itemName: p,
        itemAmount: amount,
        HTMLElements: {
          li: li,
          buttons: liBtns
        }
      })
  
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
        alertMsg.innerHTML =
          "<p>Por favor, insira seu produto no espaço apropriado acima.</p><br>";
      } else {
        alertMsg.innerHTML = "";
        if (listContainer.classList.contains("hidden"))
          listContainer.classList.remove("hidden");
  
        // build up list
        li.append(product, btnMoveItemUp, btnMoveItemDown, btnRemoveItem); // append elements to list item
        if (!existingList) {
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
  
      btnMoveItemDown.addEventListener("click", () => moveItemDown(li));
      btnMoveItemUp.addEventListener("click", () => moveItemUp(li));
      btnRemoveItem.addEventListener("click", () => RemoveItem(li));
  
      itemIDGen++;  // increase id generator
  
      // show info
      console.log(
        `=== INFO ===
    
      allowDuplicate: ${allowDuplicate}
      existingList: ${existingList}
      ITEMS:`,
        itemsData
      );
    }
  }
};

// === EVENT LISTENERS ===
btnAddItem.addEventListener("click", addItem);

btnClearList.addEventListener("click", () => {
  if (listContainer.children.length === 0) {
    alertMsg.innerHTML = "<p>Não há itens para remover!</p><br>";
  } else {
    listContainer.innerHTML = "";
    itemsData = [];
    itemIDGen = 0;  // resets the id generator
    closeList();
    showInfo(); //
  }
});

btnUl.addEventListener("click", () => {
  reformatList("ul");
  if (!btnUl.classList.contains("format-btn-selected")) {
    btnUl.classList.add("format-btn-selected");
    btnOl.classList.remove("format-btn-selected");
  }
  showInfo(); //
});

btnOl.addEventListener("click", () => {
  reformatList("ol");
  if (!btnOl.classList.contains("format-btn-selected")) {
    btnOl.classList.add("format-btn-selected");
    btnUl.classList.remove("format-btn-selected");
  }
  showInfo(); //
}); // WIP

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
    itemsData
  );
}

// console.log(getComputedStyle(document.querySelector(".popout")).animationDuration);

/*

TODO:

- Go over the entire code: see what can be tidied up, what can be removed, what can be improved etc;
- Implement falling item animation, to be played when a new item is added to the list;
- See if it is possible to add more to the item quantity/amount feature (like having the option to combine list items that have the same name into a single item followed by the appropriate amount, for instance);
- Add a modal/dialog for the user to confirm if he wishes to clear the entire list in case he clicks the designed button (and/or make the button stand out somehow to make it visually clearer for the user that it is a clear button (maybe by making it reddish));
- Improve the fluff (animations, more styling etc).

*/
