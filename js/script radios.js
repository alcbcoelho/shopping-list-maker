const body = document.querySelector("body");
const productField = document.querySelector("#product-field");
const amountField = document.querySelector("#amount-field");
const itemType = document.querySelector("#item-type");
const alertMsg = document.querySelector(".alert");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnAddItem = document.querySelector("#add-item");
const btnClearList = document.querySelector("#clear-list");
const btnYes = document.querySelector("#yes");
const btnNo = document.querySelector("#no");
const listContainer = document.querySelector(".list");

const alertMsgClasses = alertMsg.classList;

let items = [];
let createNewList = true;
let allowDuplicate = false;

const addItem = function () {
  const p = productField.value;

  if (items.includes(p) && allowDuplicate === false) {
    modal.classList.remove("hidden"); // "Já existe um produto com esse nome na lista. Inserir mesmo assim?"
    overlay.classList.remove("hidden");
  } else {
    const listFormat =
      document.querySelector("#unordered-list").checked === true ? "ul" : "ol";
    /*     const existingList = document.querySelector("#shop-list");  */

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
    if (product === "") {
      // alertMsgClasses.remove("hidden"); // show alert if product field is empty
      alertMsg.innerHTML =
        "<p>Por favor, insira seu produto no espaço apropriado acima.</p><br>";
    } else {
      alertMsg.innerHTML = "";
      // if (!alertMsgClasses.contains("hidden")) {
      //   alertMsgClasses.add("hidden"); // hide alert if otherwise
      // }

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

    li.addEventListener("mouseover", () => {
      for (let i = 0; i < liBtns.length; i++) {
        liBtns[i].classList.remove("visibility-hidden");
      }
    });

    li.addEventListener("mouseleave", () => {
      for (let i = 0; i < liBtns.length; i++) {
        liBtns[i].classList.add("visibility-hidden");
      }
    });

    btnRemoveItem.addEventListener("click", () => {
      const i = items.indexOf(p);
      // newList.remove();
      li.remove();
      items.splice(i, 1);
      console.log("ITEMS:", items); //
    });

    if (p !== "") items.push(p);

    // show info
    console.log(
      `=== INFO ===
  
    allowDuplicate: ${allowDuplicate}
    existingList: ${existingList}
    ITEMS:`,
      items
    );
  }
};

/* const displayAlertMessage = function () {

} */

const closeModal = function () {
  if (!modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }
};

btnAddItem.addEventListener("click", addItem);

btnClearList.addEventListener("click", () => {
  if (listContainer.children.length === 0) {
    alertMsg.innerHTML = "<p>Não há itens para remover!</p><br>";
  } else {
    listContainer.innerHTML = "";
    items = [];
    showInfo(); //
  }
});

btnYes.addEventListener("click", () => {
  closeModal();
  allowDuplicate = true;
  addItem();
  allowDuplicate = false;
});

btnNo.addEventListener("click", closeModal);

function showInfo() {
  console.log(
    `=== INFO ===

  ITEMS:`,
    items
  );
}

/*
TODO:
- Implement bullet point/number switching for all items in list
- shift items up and down functionality --> array with list items?
*/
