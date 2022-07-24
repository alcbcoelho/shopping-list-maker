// button setup
for (let i = 0; i < liBtns.length; i++) {
  const arr = [
    ["&#8679" /* [0][0] */, "&#8681" /* [0][1] */, "&times;" /* [0][2] */],
    [
      "Mover item para cima" /* [1][0] */,
      "Mover item para baixo" /* [1][1] */,
      "Remover item" /* [1][2] */,
    ],
    [
      "move-item" /* [2][0] */,
      "move-item" /* [2][1] */,
      "remove-item" /* [2][2] */,
    ],
  ];
  arr.forEach((j) => (liBtns[i].innerHTML = arr[0][j]));
  arr.forEach((j) => (liBtns[i].title = arr[1][j]));
  arr.forEach((j) =>
    liBtns[i].classList.add("li-btn", arr[2][j], "visibility-hidden")
  );
}
