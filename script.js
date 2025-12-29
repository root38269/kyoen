
const div_main_field = document.getElementById("main_field");



let y_count = 15;
let x_count = 15;
let cell_size = 50;

/**@type {Kyoen} */
let main_kyoen = new Kyoen(2);

function createField () {
  while (div_main_field.children.length > 0) {
    div_main_field.removeChild(div_main_field.firstChild);
  }
  for (let i = 0; i < x_count; i++) {
    for (let j = 0; j < y_count; j++) {
      let div_cell = document.createElement("div");
      div_cell.classList.add("cell");
      div_cell.id = "c_" + i + "_" + j;
      div_cell.title = i + "," + j;
      div_cell.style.gridArea = (y_count - j) + " / " + (i + 1) + " / " + (y_count - j + 1) + " / " + (i + 2);
      
      div_cell.addEventListener("click", cell_click_listener);
      let div_cell_content = document.createElement("div");
      div_cell_content.classList.add("cell_content");
      div_cell.appendChild(div_cell_content);
      div_main_field.appendChild(div_cell);
    }
  }
  document.body.style.setProperty("--row-count", y_count);
  document.body.style.setProperty("--column-count", x_count);
  main_kyoen.newGame();
  main_kyoen.startGame();
}

function resize_cell (new_cell_size) {
  new_cell_size = Number(new_cell_size);
  if (Number.isFinite(new_cell_size)) {
    if (new_cell_size < 1) {
      new_cell_size = 1
    }
    if (new_cell_size > 1000) {
      new_cell_size = 1000;
    }
    cell_size = new_cell_size;
  }
  document.body.style.setProperty("--cell-size", cell_size + "px");
}


/**
 * 
 * @param {MouseEvent} event 
 */
function cell_click_listener (event) {
  /**@type {HTMLDivElement} */
  let my_target = event.currentTarget
  if (my_target.classList.contains("cell")) {
    let str_coords = my_target.id.split("_");
    let coord = new Coordinate(2, str_coords[1], str_coords[2]);
    let result = main_kyoen.addPoint(coord);
    if (result === undefined) {
      return;
    }else if (result === false) {
      my_target.classList.add("point");
    }else{
      my_target.classList.add("point");
      my_target.classList.add("emph");
      for (let i = 0; i < result[1].length; i++) {
        let target_div = document.getElementById("c_" + result[1][i].getCoord().map(elem => elem.asString()).join("_"));
        target_div.classList.add("emph");
      }
      let div_circle = document.createElement("div");
      div_circle.classList.add("circle");
      let radius = Math.pow(result[0].radius2.toNumber(), 0.5)
      div_circle.style.setProperty("top", `calc(${y_count - (result[0].centerPoint.getCoord()[1].toNumber() + radius) - 0.5} * var(--cell-size))`);
      div_circle.style.setProperty("left", `calc(${result[0].centerPoint.getCoord()[0].toNumber() - radius + 0.5} * var(--cell-size))`);
      div_circle.style.setProperty("height", `calc(${radius * 2} * var(--cell-size))`);
      div_circle.style.setProperty("width", `calc(${radius * 2} * var(--cell-size))`);
      div_main_field.appendChild(div_circle);
    }
  }
}


createField();
resize_cell(50);
