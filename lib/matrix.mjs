/**
 * Matrix represents a collection of Float32 values that can be used in typical needs in algebra.
 * new Matrix (2, 3, [1,2,3,4,5,6]) =>
 *   |1, 2, 3|
 *   |4, 5, 6|
 */
class Matrix {
    constructor(ySize, xSize, values) {
        this.values = Float32Array.from(values)
        this.ySize = ySize
        this.xSize = xSize
        if (this.values.length < this.ySize * this.xSize) throw new Error('The matrix does not have enough values')
        if (this.values.length > this.ySize * this.xSize) throw new Error('The matrix has too many values')
    }
    /**
     * Shorthand builder for matrices
     * Matrix.matrix(2, 3)(1,2,3,4,5,6) =>
     *   |1, 2, 3|
     *   |4, 5, 6|
     */
    static matrix(y, x) {
        return function (...args) {
            return new Matrix(y, x, args)
        }
    }
    /**
     * Shorthand builder for identity matrices
     * Matrix.identity(3) =>
     *   |1, 0, 0|
     *   |0, 1, 0|
     *   |0, 0, 1|
     */
    static identity(size) {
        let values = new Array(size * size).fill(0)
        for (let i = 0; i < size; i++) {
            values[i * size + i] = 1
        }
        return new Matrix(size, size, values)
    }
    /**
     * Shorthand builder for matrices with a scalar value spread across the matrix
     * Matrix.scalar(2, 3, 5) =>
     *   |5, 5, 5|
     *   |5, 5, 5|
     */
    static scalar(ySize, xSize, value) {
        return new Matrix(ySize, xSize, new Array(ySize * xSize).fill(value))
    }
    /**
     * Shorthand buildr for vectors
     * Matrix.vector([1,2,3]) =>
     *   |1|
     *   |2|
     *   |3|
     */
    static vector(values) {
        return new Matrix(values.length, 1, values)
    }
    get(y, x) {
        return this.values[y * this.xSize + x]
    }
    eq(b) {
        if (this.xSize !== b.xSize || this.ySize !== b.ySize)
            return false
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] !== b.values[i])
                return false
        }
        return true
    }
    /**
     * Flips the matrix over its diagonal axis.
     * https://en.wikipedia.org/wiki/Transpose
     *
     * matrix(2, 3)(1, 2, 3, 4, 5, 6).transpose() =>
     *   |1, 2, 3| => |1, 4|
     *   |4, 5, 6|    |2, 5|
     *                |3, 6|
     */
    transpose() {
        let result = new Array(this.xSize * this.ySize)
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                result[y + x * this.ySize] = this.values[y * this.xSize + x]
            }
        }
        return new Matrix(this.xSize, this.ySize, result)
    }
    /**
     * Rotates the matrix by 90 degrees in place
     *
     * matrix(2, 3)(1, 2, 3, 4, 5, 6).rotate() =>
     *   |1, 2, 3| => |4, 1|
     *   |4, 5, 6|    |5, 2|
     *                |6, 3|
     */
    rotate() {
        let result = []
        for (let x = 0; x < this.xSize; x++) {
            for (let y = this.ySize - 1; y >= 0; y--) {
                result.push(this.values[y * this.xSize + x])
            }
        }
        return new Matrix(this.xSize, this.ySize, result)
    }
    /**
     * Calculates the determinant value of the matrix.
     * Only square matrices have a determinant value.
     * https://en.wikipedia.org/wiki/Determinant
     *
     * matrix(2, 2)(2, 2, 4, 4).determinant() =>
     *   |1, 2| => 1*4 - 2*3 => -2
     *   |3, 4|
     */
    determinant() {
        if (this.xSize !== this.ySize)
            throw new Error(`${this} is not square and has no determinant.`)
        if (this.xSize === 2 && this.ySize === 2) {
            return this.get(0, 0) * this.get(1, 1) - this.get(0, 1) * this.get(1, 0)
        }
        else {
            let sum = 0
            for (let x = 0; x < this.xSize; x++) {
                sum += this.values[x] * this.minor(0, x).determinant() * Math.pow(-1, x)
            }
            return sum
        }
    }
    /**
     * Gets a submatrix from the matrix by removing the given column and row.
     * https://en.wikipedia.org/wiki/Minor_(linear_algebra)
     *
     * matrix(2, 3)(1, 2, 3, 4, 5, 6).minor(0, 0) =>
     *   |1, 2, 3| => |5, 6|
     *   |4, 5, 6|
     */
    minor(y, x) {
        let values = []
        let sourceix = -1
        for (let iy = 0; iy < this.ySize; iy++) {
            for (let ix = 0; ix < this.xSize; ix++) {
                sourceix = iy * this.xSize + ix
                if ((sourceix % this.xSize) !== x && Math.floor(sourceix / this.xSize) !== y) {
                    values.push(this.values[sourceix])
                }
            }
        }
        return new Matrix(this.ySize - 1, this.xSize - 1, values)
    }
    /**
     * Gets all the minor matrices of the matrix
     */
    minors() {
        let result = []
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                result.push(this.minor(y, x))
            }
        }
        return result
    }
    /**
     * Gets the inverse of the matrix.
     * A Matrix can have several inversions.
     * Only square matrices can have an inverse matrix.
     * https://en.wikipedia.org/wiki/Invertible_matrix
     *
     * matrix(2, 2)(1, 2, 3, 4).inverse() =>
     *   |1, 2| => |-0, 0|
     *   |3, 4|    |-0, 0|
     */
    inverse() {
        const determinant = this.determinant()
        if (determinant === 0)
            throw new Error(`${this} has no inverse matrix`)
        return this.adjugate().map(x => x / determinant)
    }
    /**
     * Adjugate of a matrix is a magical being with unicorn horns.
     * https://en.wikipedia.org/wiki/Adjugate_matrix
     *
     * matrix(3, 3)(1, 2, 3, 4, 5, 6, 7, 8, 9).adjugate() =>
     *   |1, 2, 3| => |-3,   6, -3|
     *   |4, 5, 6|    | 6, -12,  6|
     *   |7, 8, 9|    |-3,   6, -3|
     */
    adjugate() {
        return new Matrix(this.ySize, this.xSize, this
            .transpose()
            .minors()
            .map((minor, ix) => minor.determinant() * Math.pow(-1, ix)))
    }
    /**
     * Mirrors the values of each row in the matrix
     * matrix(2, 2)(1, 2, 3, 4).mirror() =>
     *   |1, 2| => |2, 1|
     *   |3, 4|    |4, 3|
     */
    mirror() {
        let result = []
        for (let y = 0; y < this.ySize; y++) {
            let slice = this.values.slice(y * this.xSize, y * this.xSize + this.xSize)
            result = result.concat(Array.from(slice.reverse()))
        }
        return new Matrix(this.ySize, this.xSize, result)
    }
    /**
     * Multiplies the matrix by the given scalar value or matrix
     *
     * matrix(2, 2)(1, 2, 3, 4).multiply(2) =>
     *   |1, 2| => |2, 4|
     *   |3, 4|    |6, 8|
     *
     * Matrices can be multiplied only if their sizes correspond such that
     * the width of the first must be the height of the other
     * The result size of the matrix is a combination of the width of one and height of other
     * m x n * n x j => m x j
     * https://en.wikipedia.org/wiki/Matrix_multiplication
     *
     * matrix(1, 2)(1, 2).multiply(matrix(2, 2)(1, 2, 3, 4) =>
     *   |1, 2| x |1, 2| => |1*1 + 2*3, 1*2 + 2*4| =>  |7, 10|
     *            |3, 4|
     */
    multiply(multiplier) {
        if (typeof multiplier === 'number') {
            multiplier = Matrix
                .identity(this.xSize)
                .map(x => x * multiplier)
        }
        else {
            multiplier = multiplier
        }
        let result = new Array(this.ySize * multiplier.xSize).fill(0)
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < multiplier.xSize; x++) {
                for (let z = 0; z < this.xSize; z++) {
                    result[x + y * multiplier.xSize] +=
                        this.get(y, z) * multiplier.get(z, x)
                }
            }
        }
        return new Matrix(this.ySize, multiplier.xSize, result)
    }
    col(x) {
        let result = []
        for (let y = 0; y < this.ySize; y++) {
            result.push(this.values[x + y * this.xSize])
        }
        return new Matrix(this.ySize, 1, result)
    }
    row(y) {
        let result = this.values.slice(y * this.xSize, y * this.xSize + this.xSize)
        return new Matrix(1, this.xSize, result)
    }
    map(fn) {
        return new Matrix(this.ySize, this.xSize, this.values.map(fn))
    }
    reduce(fn, initial) {
        return this.values.reduce(fn, initial)
    }
}

export default Matrix

