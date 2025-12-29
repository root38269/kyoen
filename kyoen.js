
/**
 * 整数オブジェクト。from... は初期化時のみ使用すること。別の整数にしたいときは、別のインスタンスを作る。
 */
class Integer {
  /**@type {number} */
  #num;

  /**
   * 
   * @param {any} num 
   */
  constructor (num) {
    if (num === undefined) {
      return;
    }
    if (!this.fromAny(num)) {
      return {};
    }
  }

  /**
   * 任意のものから Integer オブジェクトを作る。変換できない場合は false を返す
   * @param {any} any 
   * @returns {false|this}
   */
  fromAny (any) {
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      this.#num = target.toNumber();
      return this;
    }else if (any.constructor.name === "Fraction") {
      any = any.toNumber();
    }
    let target = Math.floor(Number(any) + 0.5);
    if (Number.isInteger(target)) {
      return this.fromIntegerNumber(target);
    }else{
      return false;
    }
  }

  /**
   * 整数の Number オブジェクトまたは number プリミティブから Integer オブジェクトを作る
   * @param {number} num 
   * @returns {this}
   */
  fromIntegerNumber (num) {
    if (!Number.isFinite(num)) {
      console.log("aaa");
    }
    this.#num = num;
    return this;
  }

  toNumber () {
    return this.#num;
  }

  /**
   * 
   * @param {any} any 
   * @returns {Integer}
   */
  add (any) {
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      return new Integer().fromIntegerNumber(this.#num + target.toNumber());
    }else{
      return new Integer(this.#num + Number(any));
    }
  }
  /**
   * 
   * @param {any} any 
   * @returns {Integer}
   */
  subtract (any) {
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      return new Integer().fromIntegerNumber(this.#num - target.toNumber());
    }else{
      return new Integer(this.#num - Number(any));
    }
  }
  /**
   * 
   * @param {any} any 
   * @returns {Integer}
   */
  subtracted (any) {
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      return new Integer().fromIntegerNumber(target.toNumber() - this.#num);
    }else{
      return new Integer(Number(any) - this.#num);
    }
  }
  /**
   * 
   * @param {any} any 
   * @returns {Integer}
   */
  multiply (any) {
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      return new Integer().fromIntegerNumber(this.#num * target.toNumber());
    }else{
      return new Integer(this.#num * Number(any));
    }
  }
  /**
   * 
   * @param {any} any 
   * @returns {Integer}
   */
  divide (any) {
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      if (target.toNumber() === 0) {
        return {};
      }else{
        return new Integer().fromIntegerNumber(Math.floor(this.#num / target.toNumber()));
      }
    }else{
      return new Integer(this.#num / Number(any));
    }
  }
  /**
   * 
   * @param {any} any 
   * @returns {Integer}
   */
  divided (any) {
    if (this.#num === 0) {
      return {};
    }
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      return new Integer().fromIntegerNumber(Math.floor(target.toNumber() / this.#num));
    }else{
      return new Integer(Number(any) / this.#num);
    }
  }
  /**
   * 
   * @param {any} any 
   * @returns {Integer}
   */
  residue (any) {
    if (any.constructor.name === "Integer") {
      /**@type {Integer} */
      let target = any;
      if (target.toNumber() === 0) {
        return {};
      }else{
        return new Integer().fromIntegerNumber(Math.floor(this.#num % target.toNumber()));
      }
    }else{
      return new Integer(this.#num % Number(any));
    }
  }

  /**
   * 
   * @param {Integer} a 
   * @param {Integer} b 
   * @returns {Integer}
   */
  static gcd (a, b) {
    /**@type {number} */
    let num1 = Math.abs(a.toNumber());
    /** @type {number} */
    let num2 = Math.abs(b.toNumber());
    if (num1 < num2) {
      let buf = num1;
      num1 = num2;
      num2 = buf;
    }
    return new Integer().fromIntegerNumber(Integer.gcd_num(num1, num2));
  }

  /**
   * a, b は正(または 0)の整数で a >= b とする
   * @param {number} a 
   * @param {number} b 
   * @returns {number}
   */
  static gcd_num (a, b) {
    if (b === 0) {
      return a;
    }
    return Integer.gcd_num(b, a % b);
  }

  asString () {
    return String(this.#num);
  }

  asTexString () {
    return this.asString();
  }

  toString () {
    return "Integer<" + this.asString() + ">";
  }
  
  
}

/**
 * 分数オブジェクト。可約状態は保証しません。
 */
class Fraction {
  /**@type {Integer} */
  #numerator; get numerator () {return this.#numerator;}
  /**@type {Integer} */
  #denominator; get denominator () {return this.#denominator;}
  /**@type {boolean} */
  #is_irreducible = false;
  get isIrreducible () {return this.#is_irreducible;}

  /**
   * 
   * @param {any} num 
   */
  constructor (num) {
    this.#is_irreducible = false;
    if (num === undefined) {
      return;
    }
    if (!this.fromAny(num)) {
      return {};
    }
  }

  /**
   * 
   * @param {any} any 
   * @returns {false|this}
   */
  fromAny (any) {
    if (any.constructor.name === "Integer") {
      return this.fromInteger(any);
    }else if (any.constructor.name === "Fraction") {
      /**@type {Fraction} */
      let target = any;
      return this.fromNumeDeno(target.numerator, target.denominator);
    }
    let target = Number(any);
    return this.fromNumber(target);
  }

  /**
   * 
   * @param {number} num 
   * @returns {false|this}
   */
  fromNumber (num) {
    if (Number.isFinite(num)) {
      let digit = 0;
      while (!Number.isInteger(num)) {
        num = num * 10;
        digit++;
      }
      this.#denominator = new Integer().fromIntegerNumber(Math.pow(10, digit));
      this.#numerator = new Integer().fromIntegerNumber(num);
    }else if (num === Infinity) {
      this.#denominator = new Integer().fromIntegerNumber(0);
      this.#numerator = new Integer().fromIntegerNumber(1);
    }else if (num === -Infinity) {
      this.#denominator = new Integer().fromIntegerNumber(0);
      this.#numerator = new Integer().fromIntegerNumber(-1);
    }else if (Number.isNaN(num)) {
      this.#denominator = new Integer().fromIntegerNumber(0);
      this.#numerator = new Integer().fromIntegerNumber(0);
    }else{
      console.error("not finite, not Infinity, not NaN number: " & num & "\noriginal: " & any);
      return false;
    }
    this.reduce();
    return this;
  }

  /**
   * 
   * @param {Integer} int 
   * @returns {this}
   */
  fromInteger (int) {
    this.#numerator = int;
    this.#denominator = new Integer().fromIntegerNumber(1);
    this.#is_irreducible = true;
    return this;
  }

  /**
   * 
   * @param {Integer} numerator 
   * @param {Integer} denominator 
   * @returns {this}
   */
  fromNumeDeno (numerator, denominator) {
    this.#numerator = numerator;
    this.#denominator = denominator;
    this.#is_irreducible = false;
    return this;
  }

  toNumber () {
    if (!this.#is_irreducible) {
      this.reduce();
    }
    return this.#numerator.toNumber() / this.#denominator.toNumber();
  }

  /**
   * 約分する、分母は正(または 0)の整数となる
   * @returns {this}
   */
  reduce () {
    if (this.#denominator.toNumber() === 1) {
      this.#is_irreducible = true;
      return this;
    }
    if (this.#denominator.toNumber() < 0) {
      this.#denominator = new Integer().fromIntegerNumber(-this.#denominator.toNumber());
      this.#numerator = new Integer().fromIntegerNumber(-this.#numerator.toNumber());
    }else if (this.#denominator.toNumber() === 0) {
      if (this.#numerator.toNumber() > 0) {
        this.#numerator = new Integer().fromIntegerNumber(1);
      }else if (this.#numerator.toNumber() < 0) {
        this.#numerator = new Integer().fromIntegerNumber(-1);
      }
      this.#is_irreducible = true;
      return this;
    }
    let gcd = Integer.gcd(this.#denominator, this.#numerator);
    this.#denominator = this.#denominator.divide(gcd);
    this.#numerator = this.#numerator.divide(gcd);
    this.#is_irreducible = true;
    return this;
  }

  /**
   * @returns {boolean}
   */
  isInteger () {
    if (!this.#is_irreducible) {
      this.reduce();
    }
    return (this.#denominator.toNumber() === 1);
  }

  /**
   * 
   * @param {any} any 
   * @returns {Fraction}
   */
  add (any) {
    /**@type {Fraction} */
    let frac = new Fraction(any);
    if (!this.#is_irreducible) {
      this.reduce();
    }
    if (!frac.isIrreducible) {
      frac.reduce();
    }
    if (this.#denominator.toNumber() === frac.denominator.toNumber()) {
      return new Fraction().fromNumeDeno(this.#numerator.add(frac.numerator), this.#denominator);
    }
    let gcd = Integer.gcd(this.#denominator, frac.denominator);
    let lcm = new Integer(this.#denominator.divide(gcd).multiply(frac.denominator));
    let num1 = new Integer(frac.denominator.divide(gcd).multiply(this.#numerator));
    let num2 = new Integer(this.#denominator.divide(gcd).multiply(frac.numerator));
    let result = new Fraction();
    result.fromNumeDeno(num1.add(num2), lcm);
    return result;
  }
  /**
   * 
   * @param {any} any 
   * @returns {Fraction}
   */
  subtract (any) {
    /**@type {Fraction} */
    let frac = new Fraction(any);
    frac.fromNumeDeno(frac.numerator.subtracted(0), frac.denominator);
    return this.add(frac);
  }
  
  /**
   * 
   * @param {any} any 
   * @returns {Fraction}
   */
  multiply (any) { // todo: 効率的な約分
    /**@type {Fraction} */
    let frac = new Fraction(any);
    return new Fraction().fromNumeDeno(this.#numerator.multiply(frac.#numerator), this.#denominator.multiply(frac.denominator));
  }

  /**
   * @returns {Fraction}
   */
  square () {
    return this.multiply(this);
  }

  /**
   * @returns {Fraction}
   */
  inverse () {
    return new Fraction().fromNumeDeno(this.#denominator, this.#numerator);
  }

  /**
   * 
   * @param {any} any 
   * @returns {Fraction}
   */
  divide (any) {
    /**@type {Fraction} */
    let frac = new Fraction(any);
    return this.multiply(frac.inverse());
  }

  /**
   * 分数が同じかどうかを判定する。渡した分数は約分されます。
   * @param {Fraction} frac1 
   * @param {Fraction} frac2 
   * @param {boolean}
   */
  static isSame (frac1, frac2) {
    if (!frac1.isIrreducible) {
      frac1.reduce();
    }
    if (!frac2.isIrreducible) {
      frac2.reduce();
    }
    if (frac1.denominator.toNumber() === 0 && frac1.numerator.toNumber() === 0 && frac2.denominator.toNumber() === 0 && frac2.numerator.toNumber() === 0) {
      return false;
    }
    return (frac1.numerator.toNumber() === frac2.numerator.toNumber() && frac1.denominator.toNumber() === frac2.denominator.toNumber());
  }

  asString () {
    if (this.#denominator.toNumber() === 1) {
      return this.#numerator.asString();
    }else{
      return this.#numerator.asString() + "/" + this.#denominator.asString();
    }
  }

  asTexString () {
    if (this.#denominator.toNumber() === 1) {
      return this.#numerator.asTexString();
    }else if (this.#denominator.toNumber() === 0) {
      if (this.#denominator.toNumber() < 0) {
        return "\\infty";
      }else if (this.#denominator.toNumber() < 0) {
        return "-\\infty";
      }else{
        return "\\frac{0}{0}";
      }
    }else{
      return "\\frac{" + this.#numerator.asTexString() + "}{" + this.#denominator.asTexString() + "}";
    }
  }

  toString () {
    return "Fraction<" + this.asString() + ">";
  }

}

/**
 * 座標は分数です
 */
class Coordinate {
  /**@type {number} */
  #dim;
  get dim () {return this.#dim;}
  /**@type {Fraction[]} */
  #coords = [];
  /**
   * 
   * @param {number} dim 
   * @param {Fraction[]|number[]} coords 
   */
  constructor (dim, ...coords) {
    this.#dim = dim;
    this.setCoord(...coords);
  }

  /**
   * 
   * @param {Fraction[]|number[]} coords 
   */
  setCoord (...coords) {
    coords = coords.map(elem => {
      /**@type {Fraction} */
      let target;
      if (elem.constructor.name !== "Fraction") {
        target = new Fraction(elem);
      }else{
        target = elem;
      }
      if (!target.isIrreducible) {
        target.reduce();
      }
      return target;
    });
    this.#coords = coords;
  }
  /**
   * 
   * @returns {Fraction[]}
   */
  getCoord () {
    return this.#coords.concat();
  }
  /**
   * 
   * @returns {boolean}
   */
  isLatticePoint () {
    let flag = true;
    for (let i = 0; i < this.#dim; i++) {
      if (!this.#coords[i].isInteger()) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  /**
   * ノルムの2乗を返す (x^2+y^2)
   * @returns {Fraction}
   */
  getNorm2 () {
    let arr = this.#coords.map(elem => (elem.multiply(elem)));
    return arr.reduce((prev, current) => (prev.add(current)));
  }

  /**
   * 距離の2乗を返す (x^2+y^2)
   * @param {Coordinate} coord1 
   * @param {Coordinate} coord2 
   */
  static getDistance2(coord1, coord2) {
    if (coord1.dim !== coord2.dim) return;
    let arr1 = coord1.getCoord();
    let arr2 = coord2.getCoord();
    for (let i = 0; i < arr1.length; i++) {
      arr1[i] = arr1[i].subtract(arr2[i]);
    }
    return new Coordinate(coord1.dim, ...arr1).getNorm2();
  }

  /**
   * 
   * @param {Coordinate} point1 
   * @param {Coordinate} point2 
   * @returns {boolean}
   */
  static isSamePoint (point1, point2) {
    if (point1.dim !== point2.dim) return false;
    let coord1 = point1.getCoord();
    let coord2 = point2.getCoord();
    for (let i = 0; i < point1.dim; i++) {
      // if (coord1[i] !== coord2[i]) return false;
      if (!Fraction.isSame(coord1[i], coord2[i])) return false;
    }
    return true;
  }

  asString () {
    return "(" + this.#coords.map(elem => elem.asString()).join(", ") + ")";
  }

  asTexString () {
    return "\\left(" + this.#coords.map(elem => elem.asTexString()).join(", ") + "\\right)";
  }

  toString () {
    return "Coordinate<" + this.asString() + ">";
  }
}

/**
 * 要素は分数です
 */
class Matrix {
  /**@type {Fraction[][]} */
  #data = [];
  get isSquare () {
    return (this.#row === this.#column);
  }
  /**@type {number} */
  #row; get row () {return this.#row;}
  /**@type {number} */
  #column; get column () {return this.#column;}


  /**
   * 
   * @param {Fraction[][]|number[][]} data 
   */
  constructor (data) {
    let row = data.length;
    let column = data[0].length;
    for (let i = 1; i < data.length; i++) {
      if (column !== data[i].length) {
        return {};
      }
    }
    this.#row = row;
    this.#column = column;
    this.#data = data.map(elem => elem.map(elem2 => {
      /**@type {Fraction} */
      let target;
      if (elem2.constructor.name !== "Fraction") {
        target = new Fraction(elem2);
      }else{
        target = elem2;
      }
      if (!target.isIrreducible) {
        target.reduce();
      }
      return target;
    }));
  }

  /**
   * 
   * @returns {Fraction[][]}
   */
  asArray () {
    return this.#data;
  }

  /**
   * 
   * @param {number} size 
   * @returns {Matrix}
   */
  static unit (size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
      let arr2 = [];
      for (let j = 0; j < size; j++) {
        if (i === j) {
          arr2.push(new Fraction(1));
        }else{
          arr2.push(new Fraction(0));
        }
      }
      arr.push(arr2);
    }
    return new Matrix(arr);
  }

  /**
   * @returns {Matrix}
   */
  transpose () {
    let row = this.#column;
    let column = this.#row;
    let arr = Array(row);
    for (let i = 0; i < row; i++) {
      arr.push(Array(column));
      for (let j = 0; j < column; j++) {
        arr[i][j] = this.#data[j][i];
      }
    }
    return new Matrix(arr);
  }

  /**
   * 
   * @param {Matrix} mat 
   * @returns {Matrix}
   */
  add (mat) {
    if (this.#row === mat.row) {
      if (this.#column === mat.column) {
        for (let i = 0; i < this.#row; i++) {
          arr.push(Array(this.#column));
          for (let j = 0; j < this.#column; j++) {
            // arr[i][j] = this.#data[i][j] + mat.asArray()[i][j];
            arr[i][j] = this.#data[i][j].add(mat.asArray()[i][j]);
          }
        }
        return new Matrix(arr);
      }
    }
  }

  /**
   * この行列に mat を右からかけた行列を返す
   * @param {Matrix|Fraction[]|number[]} mat 
   * @returns {Matrix|Fraction[]}
   */
  multiply (mat) {
    if (Array.isArray(mat)) {
      /**@type {Fraction[]} */
      let arr = Array(this.#row);
      for (let i = 0; i < this.#row; i++) {
        let result = new Fraction(0);
        for (let k = 0; k < this.#column; k++) {
          // result += this.#data[i][k] * mat[k];
          result = result.add(this.#data[i][k].multiply(mat[k]));
        }
        arr[i] = result;
      }
      return arr;
    }else{
      if (this.#column === mat.row) {
        /**@type {Fraction[][]} */
        let arr = [];
        for (let i = 0; i < this.#row; i++) {
          arr.push(Array(mat.column));
          for (let j = 0; j < mat.column; j++) {
            let result = new Fraction(0);
            for (let k = 0; k < this.#column; k++) {
              // result += this.#data[i][k] * mat.asArray()[k][j];
              result = result.add(this.#data[i][k].multiply(mat.asArray()[k][j]));
            }
            arr[i][j] = result;
          }
        }
        return new Matrix(arr);
      }
    }
  }

  /**
   * この行列に mat を左からかけた行列を返す
   * @param {Matrix|Fraction[]|number[]} mat 
   * @returns {Matrix|Fraction[]}
   */
  multiplyed (mat) {
    if (Array.isArray(mat)) {
      /**@type {Fraction[]} */
      let arr = Array(this.#column);
      for (let j = 0; j < this.#column; j++) {
        let result = new Fraction(0);
        for (let k = 0; k < this.#row; k++) {
          // result += this.#data[k][j] * mat[k];
          result = result.add(this.#data[k][j].multiply(mat[k]));
        }
        arr[j] = result;
      }
      return arr;
    }else{
      if (this.#row === mat.column) {
        /**@type {Fraction[][]} */
        let arr = [];
        for (let i = 0; i < mat.row; i++) {
          arr.push(Array(mat.row));
          for (let j = 0; j < this.#column; j++) {
            let result = new Fraction(0);
            for (let k = 0; k < this.#row; k++) {
              // result += this.#data[k][j] * mat.asArray()[i][k];
              result = result.add(this.#data[k][j].multiply(mat.asArray()[i][k]));
            }
            arr[i][j] = result;
          }
        }
        return new Matrix(arr);
      }
    }
  }


  /**
   * @returns {Matrix}
   */
  inverse () {
    if (this.isSquare) {
      let det = this.determinant();
      if (!Fraction.isSame(det, new Fraction(0))) {
        let size = this.#row;
        if (size === 1) {
          return new Matrix([[this.#data[0][0].divide(det)]]);
        }else if (size === 2) {
          let arr = [[0,0],[0,0]];
          arr[0][0] = this.#data[1][1].divide(det);
          arr[0][1] = this.#data[0][1].divide(det).multiply(-1);
          arr[1][0] = this.#data[1][0].divide(det).multiply(-1);
          arr[1][1] = this.#data[0][0].divide(det);
          return new Matrix(arr);
        }else if (size === 3) {
          let arr = [[0,0,0],[0,0,0],[0,0,0]];
          // arr[0][0] =  (this.#data[1][1]*this.#data[2][2] - this.#data[1][2]*this.#data[2][1]) / det;
          // arr[1][0] = -(this.#data[1][0]*this.#data[2][2] - this.#data[1][2]*this.#data[2][0]) / det;
          // arr[2][0] =  (this.#data[1][0]*this.#data[2][1] - this.#data[1][1]*this.#data[2][0]) / det;
          // arr[0][1] = -(this.#data[0][1]*this.#data[2][2] - this.#data[0][2]*this.#data[2][1]) / det;
          // arr[1][1] =  (this.#data[0][0]*this.#data[2][2] - this.#data[0][2]*this.#data[2][0]) / det;
          // arr[2][1] = -(this.#data[0][0]*this.#data[2][1] - this.#data[0][1]*this.#data[2][0]) / det;
          // arr[0][2] =  (this.#data[0][1]*this.#data[1][2] - this.#data[0][2]*this.#data[1][1]) / det;
          // arr[1][2] = -(this.#data[0][0]*this.#data[1][2] - this.#data[0][2]*this.#data[1][0]) / det;
          // arr[2][2] =  (this.#data[0][0]*this.#data[1][1] - this.#data[0][1]*this.#data[1][0]) / det;
          arr[0][0] = this.#data[1][1].multiply(this.#data[2][2]).subtract(this.#data[1][2].multiply(this.#data[2][1])).divide(det);
          arr[1][0] = this.#data[1][0].multiply(this.#data[2][2]).subtract(this.#data[1][2].multiply(this.#data[2][0])).divide(det).multiply(-1);
          arr[2][0] = this.#data[1][0].multiply(this.#data[2][1]).subtract(this.#data[1][1].multiply(this.#data[2][0])).divide(det);
          arr[0][1] = this.#data[0][1].multiply(this.#data[2][2]).subtract(this.#data[0][2].multiply(this.#data[2][1])).divide(det).multiply(-1);
          arr[1][1] = this.#data[0][0].multiply(this.#data[2][2]).subtract(this.#data[0][2].multiply(this.#data[2][0])).divide(det);
          arr[2][1] = this.#data[0][0].multiply(this.#data[2][1]).subtract(this.#data[0][1].multiply(this.#data[2][0])).divide(det).multiply(-1);
          arr[0][2] = this.#data[0][1].multiply(this.#data[1][2]).subtract(this.#data[0][2].multiply(this.#data[1][1])).divide(det);
          arr[1][2] = this.#data[0][0].multiply(this.#data[1][2]).subtract(this.#data[0][2].multiply(this.#data[1][0])).divide(det).multiply(-1);
          arr[2][2] = this.#data[0][0].multiply(this.#data[1][1]).subtract(this.#data[0][1].multiply(this.#data[1][0])).divide(det);

          return new Matrix(arr);
        }
      }
    }
  }

  /**
   * @returns {Fraction}
   */
  determinant () {
    if (this.isSquare) {
      let size = this.#row;
      if (size === 1) {
        return this.#data[0][0];
      }else if (size === 2) {
        // return this.#data[0][0]*this.#data[1][1] - this.#data[0][1]*this.#data[1][0];
        return this.#data[0][0].multiply(this.#data[1][1]).subtract(this.#data[0][1].multiply(this.#data[1][0]));
      }else if (size === 3) {
        let result = new Fraction(0);
        // result += this.#data[0][0] * this.#data[1][1] * this.#data[2][2];
        result = result.add(this.#data[0][0].multiply(this.#data[1][1]).multiply(this.#data[2][2]));
        result = result.add(this.#data[0][1].multiply(this.#data[1][2]).multiply(this.#data[2][0]));
        result = result.add(this.#data[0][2].multiply(this.#data[1][0]).multiply(this.#data[2][1]));
        result = result.subtract(this.#data[0][2].multiply(this.#data[1][1]).multiply(this.#data[2][0]));
        result = result.subtract(this.#data[0][0].multiply(this.#data[1][2]).multiply(this.#data[2][1]));
        result = result.subtract(this.#data[0][1].multiply(this.#data[1][0]).multiply(this.#data[2][2]));
        return result;
      }
    }
  }

  /**
   * @returns {Fraction}
   */
  trace () {
    if (this.isSquare) {
      let result = new Fraction(0);
      for (let i = 0; i < this.#row; i++) {
        result = result.add(this.#data[i][i]);
      }
      return result;
    }
  }

  asString () {
    return this.#data.map(elem => ("[\t" + elem.map(elem2 => elem2.asString()).join(",\t")) + "\t]").join("\n");
  }

  toString () {
    return "Matrix<\n" + this.asString() + "\n>";
  }

}

/**
 * 円(球)を表すオブジェクト
 */
class Circle {
  /**
   * 円の中心座標。直線の場合は、ax+by=1 の (a,b) とする。原点を通る場合は、ax+by=0 の (a,b) とする。
   * @type {Coordinate} 
   */
  #center_point; get centerPoint () {return this.#center_point;}
  /**
   * 円の半径の2乗。直線の場合は無限大とする。
   * @type {Fraction} 
   */
  #radius2; get radius2 () {return this.#radius2;}

  /**
   * このオブジェクトが原点を通る直線の場合は true
   * @type {boolean}
   */
  #is_origin_line = false;

  #dim;
  
  constructor () {
    
  }

  /**
   * 
   * @param {Coordinate} center 
   * @param {Fraction|number} radius2 
   * @returns {this}
   */
  fromCenterRadius (center, radius2) {
    if (center.constructor.mame === "Coordinate") {
      this.#center_point = center;
    }else{
      this.#center_point = new Coordinate(2, 0, 0);
    }
    
    /**@type {Fraction} */
    let target;
    if (radius2.constructor.name === "Fraction") {
      target = radius2;
    }else{
      target = new Fraction(radius2);
    }
    if (target.reduce().numerator.toNumber() > 0) {
      this.#radius2 = target;
    }else{
      this.#radius2 = new Fraction(1);
    }
    this.#is_origin_line = false;
    return this;
  }

  /**
   * 
   * @param {Coordinate[]} points 
   * @returns {this}
   */
  fromPoints (...points) {
    if (points.length === 3 && points[0].dim === 2) { // todo: ちゃんとチェックする
      /**@type {Fraction[][]} */
      let arr = [];
      for (let i = 0; i < points.length; i++) {
        let arr2 = points[i].getCoord();
        arr2.push(new Fraction(1));
        arr.push(arr2);
      }
      let mat = new Matrix(arr);

      if (Fraction.isSame(mat.determinant(), new Fraction(0))) { // 同一直線上
        this.#radius2 = new Fraction(0).inverse();
        let arr2 = [];
        for (let i = 0; i < points.length - 1; i++) {
          arr2.push(points[i].getCoord());
        }
        let mat2 = new Matrix(arr2);
        if (Fraction.isSame(mat2.determinant(), new Fraction(0))) { // 直線が原点を通る
          let arr3 = [];
          let target_coord = points[0].getCoord();
          if (Fraction.isSame(target_coord[0], new Fraction(0))) { ////////////////
            this.#center_point = new Coordinate(2, 1, 0);
          }else{
            this.#center_point = new Coordinate(2, target_coord[1], target_coord[0].multiply(-1));
          }
          this.#is_origin_line = true;
        }else{
          let arr_result = mat2.inverse().multiply(new Array(points.length - 1).fill(1));  // ax + by = 1
          this.#center_point = new Coordinate(arr_result.length, ...arr_result);
          this.#is_origin_line = false
        }
      }else{
        /**@type {Fraction[]} */
        let arr_c = Array(points.length);
        for (let i = 0; i < points.length; i++) {
          arr_c[i] = points[i].getNorm2().multiply(-1);
        }  
        /**@type {Fraction[]} */
        let arr_result = mat.inverse().multiply(arr_c);
        let center = new Coordinate(2, arr_result[0].divide(-2), arr_result[1].divide(-2)); //
        for (let i = 0; i < arr_result.length - 1; i++) {
          arr_result[i] = arr_result[i].divide(2).square();
        }
        arr_result[arr_result.length - 1] = arr_result[arr_result.length - 1].multiply(-1);
        let radius2 = arr_result.reduce((prev, current) => prev.add(current));
        this.#center_point = center;
        this.#radius2 = radius2;
        this.#is_origin_line = false
      }
    }
    return this;

  }

  /**
   * 
   * @param {Coordinate} point 
   * @returns {boolean}
   */
  onCircle (point) {
    if (this.#radius2.denominator.toNumber() === 0) {
      if (this.#is_origin_line) {
        if (Fraction.isSame(this.#center_point.getCoord()[0].multiply(point.getCoord()[0]).add(this.#center_point.getCoord()[1].multiply(point.getCoord()[1])), new Fraction(0))) {
          return true;
        }else{
          return false;
        }
      }else{
        if (Fraction.isSame(this.#center_point.getCoord()[0].multiply(point.getCoord()[0]).add(this.#center_point.getCoord()[1].multiply(point.getCoord()[1])), new Fraction(1))) {
          return true;
        }else{
          return false;
        }
      }
    }else{
      if (Fraction.isSame(Coordinate.getDistance2(point, this.#center_point), this.#radius2)) {
        return true;
      }else{
        return false;
      }
    }
  }


}

class Kyoen {
  /**@type {number} */
  #dim;
  get dim () {return this.#dim;}
  /**@type {Coordinate[]} */
  #points = [];
    /**@type {Map<Circle, Coordinate[]>} */
  #circles;
  /**@type {"standby"|"ready"|"playing"|"judging"|"finished"} */
  #game_state = "standby";


  /**
   * 
   * @param {number} dim 
   */
  constructor (dim = 2) {
    this.#dim = dim;
    this.#circles = new Map();
  }

  newGame () {
    this.#game_state = "ready";
    this.#points = [];
    this.#circles.clear();
  }
  startGame () {
    if (this.#game_state === "ready") {
      this.#game_state = "playing";
    }
  }

  /**
   * 共円であればその円と円周上の点、でなければ false, 点をおけなかった場合は undefined を返す
   * @param {Coordinate} point 
   */
  addPoint (point) {
    if (this.#game_state === "playing") {
      if (point.dim !== this.#dim) return;
      if (!point.isLatticePoint()) return;
      for (let i = 0; i < this.#points.length; i++) {
        if (Coordinate.isSamePoint(this.#points[i], point)) {
          return;
        }
      }
      if (this.#points.length >= this.#dim + 1) {
        this.#game_state = "judging";
        if (this.#dim === 2) {
          let arr_circles = Array.from(this.#circles.keys());
          for (let i = 0; i < this.#circles.size; i++) {
            if (arr_circles[i].onCircle(point)) {
              this.#game_state = "finished";
              return Array.from(this.#circles.entries())[i];
            }
          }
        }
      }
      if (this.#points.length >= this.#dim) {
        if (this.#dim === 2) {
          for (let i1 = 0; i1 < this.#points.length - 1; i1++) {
            for (let i2 = i1 + 1; i2 < this.#points.length; i2++) {
              this.#circles.set(new Circle().fromPoints(this.#points[i1], this.#points[i2], point), [this.#points[i1], this.#points[i2], point]);
            }
          }
        }
      }
      this.#points.push(point);
      this.#game_state = "playing";
      return false;
    }
  }

  

}






let p1 = new Coordinate(2, 2, 1);
let p2 = new Coordinate(2, 9, 0);
let p3 = new Coordinate(2, 10, 7);

let p4 = new Coordinate(2, 1, 4);
let p5 = new Coordinate(2, 0, 0);

// let p1 = new Coordinate(2, 5, 0);
// let p2 = new Coordinate(2, -1, 3);
// let p3 = new Coordinate(2, 3, 1);

// let c1 = new Circle().fromPoints(p1, p2, p3);
// console.log(c1);


let k1 = new Kyoen();
k1.newGame();
k1.startGame();

k1.addPoint(p1);
k1.addPoint(p2);
k1.addPoint(p3);
