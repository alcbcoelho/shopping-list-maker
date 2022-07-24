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
let createNewList = true;
let allowDuplicate = false;

function drawButtons() {
  const btnMoveItemUp = document.createElement("button");
  const btnMoveItemDown = document.createElement("button");
  const btnRemoveItem = document.createElement("button");
  const lis = listContainer.querySelectorAll("li");
  // const liBtns = [btnMoveItemUp, btnMoveItemDown, btnRemoveItem];

  let liBtns = []; // li button array

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

  /*   items.forEach((item, index) => {
    // console.log(item, index);
    item = 0;
  }); */
  liBtns = items.map((item, i) => {
    switch (i) {
      case 0:
        if (items.length > 0) {
          return btnRemoveItem;
          /* return "[X]"; */
        } else {
          /* return "[v], [X]" */
          return [btnMoveItemDown, btnRemoveItem];
        }
        break;
      case items.length - 1: // && index !== 0
        /* return "[^], [X]" */
        return [btnMoveItemUp, btnRemoveItem];
        break;
      default:
        /* return "[^], [v], [X]" */
        return [btnMoveItemUp, btnMoveItemDown, btnRemoveItem];
    }
  });
  console.log("liBtns:", liBtns, "\nlis: ", lis);
  lis.forEach((li, i) => {
    // function
    function toggleVisibility(onoff) {
      switch (onoff) {
        case 0:
          liBtns.forEach((btn) => {
            if (!Array.isArray(btn)) {
              btn.classList.add("visibility-hidden");
            } else {
              btn.forEach((btn_) => {
                btn_.classList.add("visibility-hidden");
              });
            }
          });
          break;
        case 1:
          liBtns.forEach((btn) => {
            if (!Array.isArray(btn)) {
              btn.classList.remove("visibility-hidden");
            } else {
              btn.forEach((btn_) => {
                btn_.classList.remove("visibility-hidden");
              });
            }
          });
          break;
      }
    }
    //
    // only append buttons once per li
    if (li.getElementsByClassName("li-btn").length === 0) {
      // console.log("Length:", liBtns[i].length);
      if (!Array.isArray(liBtns[i])) {
        li.append(liBtns[i]);
      } else {
        li.append(liBtns[i][0], liBtns[i][1]);
      }
    }

    li.addEventListener("mouseover", () => toggleVisibility(1));
    li.addEventListener("mouseleave", () => toggleVisibility(0));

    /*     btnMoveItemDown.addEventListener("click", () => {
      let arr = [];

      lis.forEach((element) => {
        arr.push(element.innerHTML);
      });

      const j = arr.indexOf(li.innerHTML);
      const [x, y] = [arr[j], arr[j + 1]];
      lis[j].innerHTML = y;
      lis[j + 1].innerHTML = x;
    }); //

    btnMoveItemUp.addEventListener("click", () => {
      let arr = [];
      const lis = document.querySelectorAll("li");

      lis.forEach((element) => {
        arr.push(element.innerHTML);
      });

      const j = arr.indexOf(li.innerHTML);
      const [x, y] = [arr[j - 1], arr[j]];
      lis[j - 1].innerHTML = y;
      lis[j].innerHTML = x;
    }); //

    btnRemoveItem.addEventListener("click", () => {
      // const i = items.indexOf(p);
      const l = document.querySelector("#shoplist");
      // newList.remove();
      li.remove();
      if (l.children.length === 0) {
        l.remove();
        closeList();
      }
      // items.splice(i, 1);
      // console.log("ITEMS:", items);
    }); */
  });
}

function addItem() {
  const p = productField.value;

  if (items.includes(p) && allowDuplicate === false) {
    modal.classList.remove("hidden"); // "Já existe um produto com esse nome na lista. Inserir mesmo assim?"
    overlay.classList.remove("hidden");
  } else {
    const listFormat = btnUl.classList.contains("li-btn-selected")
      ? "ul"
      : "ol";
    /* document.querySelector("#unordered-list").checked === true ? "ul" : "ol"; */

    // create elements
    const newList = document.createElement(listFormat); // = ul | ol
    const existingList = document.querySelector("#shoplist");
    const li = document.createElement("li");
    /* const btnMoveItemUp = document.createElement("button");
    const btnMoveItemDown = document.createElement("button");
    const btnRemoveItem = document.createElement("button");
    const liBtns = [btnMoveItemUp, btnMoveItemDown, btnRemoveItem]; */

    const amount = Number(amountField.value) <= 0 ? "1" : amountField.value;
    const product = amount === "" || amount === "1" ? p : `${p} (x${amount})`;

    // button setup

    //
    if (p === "") {
      // alertMsgClasses.remove("hidden"); // show alert if product field is empty
      alertMsg.innerHTML =
        "<p>Por favor, insira seu produto no espaço apropriado acima.</p><br>";
    } else {
      alertMsg.innerHTML = "";
      if (p !== "") items.push(p); // items++
      if (listContainer.classList.contains("hidden"))
        listContainer.classList.remove("hidden");

      // build up list
      li.append(product);
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

    /* ========================================================
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

    btnMoveItemDown.addEventListener("click", () => {
      let arr = [];
      const listElements = document.querySelectorAll("li");

      listElements.forEach((element) => {
        arr.push(element.innerHTML);
      });

      const i = arr.indexOf(li.innerHTML);
      const [x, y] = [arr[i], arr[i + 1]];
      listElements[i].innerHTML = y;
      listElements[i + 1].innerHTML = x;
    }); //

    btnMoveItemUp.addEventListener("click", () => {
      let arr = [];
      const listElements = document.querySelectorAll("li");

      listElements.forEach((element) => {
        arr.push(element.innerHTML);
      });

      const i = arr.indexOf(li.innerHTML);
      const [x, y] = [arr[i - 1], arr[i]];
      listElements[i - 1].innerHTML = y;
      listElements[i].innerHTML = x;
    }); //

    btnRemoveItem.addEventListener("click", () => {
      const i = items.indexOf(p);
      const l = document.querySelector("#shoplist");
      // newList.remove();
      li.remove();
      if (l.children.length === 0) {
        l.remove();
        closeList();
      }
      items.splice(i, 1);
      console.log("ITEMS:", items); //
    });
    ======================================================== */

    // if (p !== "") items.push(p);
    drawButtons();

    // show info
    console.log(
      `=== INFO ===
  
    allowDuplicate: ${allowDuplicate}
    existingList: ${existingList}
    ITEMS:`,
      items
    );
  }
}

/* const displayAlertMessage = function () {

} */

function closeModal() {
  if (!modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }
}

function closeList() {
  if (!listContainer.classList.contains("hidden"))
    listContainer.classList.add("hidden");
}

btnAddItem.addEventListener("click", addItem);

btnClearList.addEventListener("click", () => {
  if (listContainer.children.length === 0) {
    alertMsg.innerHTML = "<p>Não há itens para remover!</p><br>";
  } else {
    listContainer.innerHTML = "";
    items = [];
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
  }
  if (!btnUl.classList.contains("li-btn-selected")) {
    btnUl.classList.add("li-btn-selected");
    btnOl.classList.remove("li-btn-selected");
  }
});

btnOl.addEventListener("click", () => {
  const existingList = document.querySelector("#shoplist");

  if (existingList !== null && existingList.tagName.toLowerCase() === "ul") {
    const ol = document.createElement("ol"); // CONVERTER P FUNÇÃO
    ol.id = existingList.id;
    ol.innerHTML = existingList.innerHTML;
    existingList.parentElement.replaceChildren(ol);
  }
  if (!btnOl.classList.contains("li-btn-selected")) {
    btnOl.classList.add("li-btn-selected");
    btnUl.classList.remove("li-btn-selected");
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
BUGS/ERRORS: // these seem to be side effects of transcribing event-dependent content (such as the li buttons) via the innerHTML property
- li buttons not showing up when list is set to a different format // maybe have a function to generate li buttons?
- li button shenanigans when moving items up/down (buttons showing up permanently on translocated items, not showing up on those that were shifted from their init position)

TODO:
- implement li buttons with the format switching feature

CONSIDER:
- function to generate li buttons
*/
