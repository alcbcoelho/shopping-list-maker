"use strict";

/////////////////////////////////////////////////
// VARIABLES
/////////////////////////////////////////////////

// language dependent variables
let lang;
let alertMsgInnerText;
let modalMsgInnerText;

// input field elements
const productField = document.querySelector("#product-field");
const amountField = document.querySelector("#amount-field");

// div elements
const alertMsg = document.querySelector(".alert");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const listContainer = document.querySelector(".list");

// button elements
const btnAddItem = document.querySelector("#add-item");
const btnClearList = document.querySelector("#clear-list");
const btnUl = document.querySelector("#unordered-list");
const btnOl = document.querySelector("#ordered-list");
const btnYes = document.querySelector("#yes");
const btnNo = document.querySelector("#no");
const btnLangEN = document.querySelector("#lang-en");
const btnLangPT = document.querySelector("#lang-pt");

// lets
let itemsData = [];
let itemIDGen = 0;
let allowDuplicate = false;

/////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////

const setUpLanguage = function (lang_) {
  const redefineAlertMessages = function (lang__) {
    try {
      if (lang__ !== "en" && lang__ !== "pt")
        throw new Error(
          "Argument 'lang__' must be set to either 'en' (for English) or 'pt' (for Portuguese)."
        );

      const arr = lang__ === "en" ? txt.alertMsg.pt : txt.alertMsg.en;

      if (alertMsg.textContent) {
        if (alertMsg.textContent === arr[0])
          alertMsg.innerHTML = `<p>${alertMsgInnerText[0]}</p><br>`;
        if (alertMsg.textContent === arr[1])
          alertMsg.innerHTML = `<p>${alertMsgInnerText[1]}</p><br>`;
      }
    } catch (e) {
      console.error(e);
    }
  };

  lang = lang_;

  switch (lang) {
    case "en":
      alertMsgInnerText = txt.alertMsg.en;
      modalMsgInnerText = txt.modalMsg.en;

      document.querySelector("html").lang = txt.lang.en;
      document.querySelector("title").innerText = txt.pageTitle.en;
      document.querySelector("h1").innerText = txt.pageTitle.en;
      productField.placeholder = txt.productFieldPlaceholder.en;
      amountField.placeholder = txt.amountFieldPlaceholder.en;
      productField.title = txt.productFieldTitle.en;
      amountField.title = txt.amountFieldTitle.en;
      document.querySelector(".formatting").querySelector("strong").innerText =
        txt.formattingInnerText.en;
      btnUl.title = txt.formatBtnUnorderedListTitle.en;
      btnOl.title = txt.formatBtnOrderedListTitle.en;
      btnAddItem.innerText = txt.btnAddItemInnerText.en;
      btnClearList.innerText = txt.btnClearListInnerText.en;
      btnYes.innerText = txt.btnYesInnerText.en;
      btnNo.innerText = txt.btnNoInnerText.en;
      modal.querySelector("p").innerText = txt.modalMsg.en[0];
      document.querySelectorAll(".move-item").forEach((btn, i) => {
        if (!(i % 2)) {
          btn.title = txt.btnMoveItemUpTitle.en;
        } else btn.title = txt.btnMoveItemDownTitle.en;
      });
      document
        .querySelectorAll(".remove-item")
        .forEach(btn => (btn.title = txt.btnRemoveItemTitle.en));

      redefineAlertMessages("en");

      btnLangEN.style.opacity = 1;
      btnLangPT.removeAttribute("style");

      break;
    case "pt":
    default:
      alertMsgInnerText = txt.alertMsg.pt;
      modalMsgInnerText = txt.modalMsg.pt;

      document.querySelector("html").lang = txt.lang.pt;
      document.querySelector("title").innerText = txt.pageTitle.pt;
      document.querySelector("h1").innerText = txt.pageTitle.pt;
      productField.placeholder = txt.productFieldPlaceholder.pt;
      amountField.placeholder = txt.amountFieldPlaceholder.pt;
      productField.title = txt.productFieldTitle.pt;
      amountField.title = txt.amountFieldTitle.pt;
      document.querySelector(".formatting").querySelector("strong").innerText =
        txt.formattingInnerText.pt;
      btnUl.title = txt.formatBtnUnorderedListTitle.pt;
      btnOl.title = txt.formatBtnOrderedListTitle.pt;
      btnAddItem.innerText = txt.btnAddItemInnerText.pt;
      btnClearList.innerText = txt.btnClearListInnerText.pt;
      btnYes.innerText = txt.btnYesInnerText.pt;
      btnNo.innerText = txt.btnNoInnerText.pt;
      modal.querySelector("p").innerText = txt.modalMsg.pt[0];
      document.querySelectorAll(".move-item").forEach((btn, i) => {
        if (!(i % 2)) {
          btn.title = txt.btnMoveItemUpTitle.pt;
        } else btn.title = txt.btnMoveItemDownTitle.pt;
      });
      document
        .querySelectorAll(".remove-item")
        .forEach(btn => (btn.title = txt.btnRemoveItemTitle.pt));

      redefineAlertMessages("pt");

      btnLangPT.style.opacity = 1;
      btnLangEN.removeAttribute("style");
  }
};

const openModal = function (
  modalMsg = lang === "en" ? txt.modalMsg.en[0] : txt.modalMsg.pt[0]
) {
  modal.querySelector("p").innerText = modalMsg;
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
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
    if (type !== "ul" && type !== "ol")
      throw new Error("Argument 'type' must be set to either 'ol' or 'ul'.");

    const existingList = document.querySelector("#shoplist");
    const reverseType = type === "ul" ? "ol" : "ul";

    if (existingList && existingList.tagName.toLowerCase() === reverseType) {
      const newListType = document.createElement(type);
      newListType.id = existingList.id;
      itemsData.forEach(item => newListType.append(item.li));
      listContainer.replaceChildren(newListType);
    }
  } catch (e) {
    console.error(e);
  }
};

const addItem = function () {
  ///////////////////////////////////////////////
  // INNER FUNCTIONS
  ///////////////////////////////////////////////

  const moveItemUp = function (li) {
    const i = itemsData.findIndex(item => item.itemID === li.id);
    const existingList = document.querySelector("#shoplist");

    if (i !== 0) {
      const [movingDown, movingUp] = [itemsData[i - 1], itemsData[i]];
      itemsData[i] = movingDown;
      itemsData[i - 1] = movingUp;
    }

    existingList.innerHTML = "";
    itemsData.forEach(item => existingList.append(item.li));

    console.log(
      "ID of li to move up:",
      li.id,
      "\nIndex of li to move up:",
      i,
      "\nITEMS:",
      itemsData
    ); //
  };

  const moveItemDown = function (li) {
    const i = itemsData.findIndex(item => item.itemID === li.id);
    const existingList = document.querySelector("#shoplist");

    if (i !== itemsData.length - 1) {
      const [movingDown, movingUp] = [itemsData[i], itemsData[i + 1]];
      itemsData[i] = movingUp;
      itemsData[i + 1] = movingDown;
    }

    existingList.innerHTML = "";
    itemsData.forEach(item => existingList.append(item.li));

    console.log(
      "ID of li to move down:",
      li.id,
      "\nIndex of li to move down:",
      i,
      "\nITEMS:",
      itemsData
    ); //
  };

  const removeItem = function (li) {
    const i = itemsData.findIndex(item => item.itemID === li.id);
    const l = document.querySelector("#shoplist");

    itemsData.splice(i, 1);
    li.remove();
    if (l.children.length === 0) {
      l.remove();
      itemIDGen = 0; // resets item ID generator
      closeList();
    }

    console.log(
      "ID of deleted li:",
      li.id,
      "\nIndex of deleted li:",
      i,
      "\nITEMS:",
      itemsData,
      "\nl.children.length:",
      l.children.length
    ); //
  };

  const toggleElementsVisibility = function (arr, onoff) {
    switch (onoff) {
      case 0:
        arr.forEach(element => element.classList.add("visibility-hidden"));
        break;
      case 1:
        arr.forEach(element => element.classList.remove("visibility-hidden"));
    }
  };

  ///////////////////////////////////////////////

  const p = productField.value;

  if (p === "") {
    alertMsg.innerHTML = `<p>${alertMsgInnerText[0]}</p><br>`;
  } else {
    if (alertMsg.innerHTML) alertMsg.innerHTML = "";
    if (listContainer.classList.contains("hidden"))
      listContainer.classList.remove("hidden");

    if (itemsData.some(item => item.itemName === p) && !allowDuplicate) {
      openModal();
    } else {
      const listFormat = btnUl.classList.contains("format-btn-selected")
        ? "ul"
        : "ol";

      // create elements
      const newList = document.createElement(listFormat);
      const existingList = document.querySelector("#shoplist");
      const li = document.createElement("li");
      const btnMoveItemUp = document.createElement("button");
      const btnMoveItemDown = document.createElement("button");
      const btnRemoveItem = document.createElement("button");
      const liBtns = [btnMoveItemUp, btnMoveItemDown, btnRemoveItem];

      const amount = Number(amountField.value) <= 0 ? "1" : amountField.value;
      const product = amount === "" || amount === "1" ? p : `${p} (x${amount})`;

      li.id = "li-" + itemIDGen;

      itemsData.push({
        itemID: li.id,
        itemName: p,
        itemAmount: amount,
        li: li,
      });

      // button setup
      btnMoveItemUp.innerHTML = "&#8679";
      btnMoveItemUp.title =
        lang === "en" ? txt.btnMoveItemUpTitle.en : txt.btnMoveItemUpTitle.pt;
      btnMoveItemUp.classList.add("li-btn", "move-item", "visibility-hidden");

      btnMoveItemDown.innerHTML = "&#8681";
      btnMoveItemDown.title =
        lang === "en"
          ? txt.btnMoveItemDownTitle.en
          : txt.btnMoveItemDownTitle.pt;
      btnMoveItemDown.classList.add("li-btn", "move-item", "visibility-hidden");

      btnRemoveItem.innerHTML = "&times;";
      btnRemoveItem.title =
        lang === "en" ? txt.btnRemoveItemTitle.en : txt.btnRemoveItemTitle.pt;
      btnRemoveItem.classList.add("li-btn", "remove-item", "visibility-hidden");

      // create new list/append new item
      li.append(product, ...liBtns);
      if (!existingList) {
        newList.id = "shoplist";
        newList.append(li);
        listContainer.append(newList);

        console.log(`existingList: ${existingList}
        existingList_: ${document.querySelector("#shoplist")}`); //
      } else existingList.append(li);

      // toggle li button visibility on hover
      li.addEventListener("mouseover", () => {
        toggleElementsVisibility(liBtns, 1);
      });

      li.addEventListener("mouseleave", () => {
        toggleElementsVisibility(liBtns, 0);
      });

      // set up li button functionality
      btnMoveItemDown.addEventListener("click", () => moveItemDown(li));
      btnMoveItemUp.addEventListener("click", () => moveItemUp(li));
      btnRemoveItem.addEventListener("click", () => removeItem(li));

      itemIDGen++; // increase id generator

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

const showInfo = function () {
  console.log("ITEMS:", itemsData);
};

/////////////////////////////////////////////////
// EVENT LISTENERS
/////////////////////////////////////////////////

btnAddItem.addEventListener("click", addItem);

btnClearList.addEventListener("click", () => {
  if (listContainer.children.length === 0) {
    alertMsg.innerHTML = `<p>${alertMsgInnerText[1]}</p><br>`;
  } else openModal(modalMsgInnerText[1]);
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
});

btnYes.addEventListener("click", () => {
  closeModal();
  if (modal.querySelector("p").innerText === modalMsgInnerText[1]) {
    // clear list
    listContainer.innerHTML = "";
    itemsData = [];
    itemIDGen = 0; // resets the id generator
    closeList();
    showInfo(); //
  } else {
    // insert duplicate item
    allowDuplicate = true;
    addItem();
    allowDuplicate = false;
  }
});

btnNo.addEventListener("click", closeModal);

btnLangEN.addEventListener("click", () => setUpLanguage("en"));

btnLangPT.addEventListener("click", () => setUpLanguage("pt"));

/////////////////////////////////////////////////

setUpLanguage("pt");
