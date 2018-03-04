import assert from 'assert'
import Matrix from './../lib/matrix.mjs'

const { vector, identity, scalar, matrix } = Matrix

const m31 = matrix(3, 1)(1, 2, 3)
const m32 = matrix(3, 2)(1, 2, 3, 4, 5, 6)
const m33 = matrix(3, 3)(1, 2, 3, 4, 5, 6, 7, 8, 9)
const minvertable = matrix(3, 3)(1, 2, 3, 0, 1, 4, 5, 6, 0)

assert.throws(() => matrix(2, 2)())
assert.throws(() => matrix(2, 2)(1,2,3,4,5))

// eq()
assert(m32.eq(m32))
assert(!m32.eq(m33))

// get()
assert.equal(m32.get(0, 0), 1)
assert.equal(m32.get(1, 1), 4)

// row()
assert.deepEqual(m32.row(0), matrix(1, 2)(1, 2))
assert.deepEqual(m32.row(1), matrix(1, 2)(3, 4))
assert.deepEqual(m32.row(2), matrix(1, 2)(5, 6))

// col()
assert.deepEqual(m32.col(0), matrix(3, 1)(1, 3, 5))
assert.deepEqual(m32.col(1), matrix(3, 1)(2, 4, 6))

// rotate()
assert.deepEqual(m32.rotate(), matrix(2, 3)(5, 3, 1, 6, 4, 2))

// mirror()
assert.deepEqual(m32.mirror(), matrix(3, 2)(2, 1, 4, 3, 6, 5))

// transpose()
assert.deepEqual(m32.transpose(), matrix(2, 3)(1, 3, 5, 2, 4, 6))

// identity()
assert.deepEqual(identity(3), matrix(3, 3)(1, 0, 0, 0, 1, 0, 0, 0, 1))

// scalar()
assert.deepEqual(scalar(3, 3, 1), matrix(3, 3)(1, 1, 1, 1, 1, 1, 1, 1, 1))

// vector()
assert.deepEqual(vector([1, 2, 3]), matrix(3, 1)(1, 2, 3))

// multiply()
assert.deepEqual(m32.multiply(2), matrix(3, 2)(2, 4, 6, 8, 10, 12))
assert.deepEqual(m32.multiply(matrix(2, 1)(1, 2)), matrix(3, 1)(5, 11, 17))
assert.deepEqual(m31.multiply(matrix(1, 2)(1, 2)), matrix(3, 2)(1, 2, 2, 4, 3, 6))

// minor()
assert.deepEqual(m33.minor(0, 0), matrix(2, 2)(5, 6, 8, 9))
assert.deepEqual(m33.minor(1, 1), matrix(2, 2)(1, 3, 7, 9))
assert.deepEqual(m33.minor(2, 2), matrix(2, 2)(1, 2, 4, 5))

// minors()
assert.deepEqual(m33.minors(), [
    matrix(2, 2)(5, 6, 8, 9),
    matrix(2, 2)(4, 6, 7, 9),
    matrix(2, 2)(4, 5, 7, 8),
    matrix(2, 2)(2, 3, 8, 9),
    matrix(2, 2)(1, 3, 7, 9),
    matrix(2, 2)(1, 2, 7, 8),
    matrix(2, 2)(2, 3, 5, 6),
    matrix(2, 2)(1, 3, 4, 6),
    matrix(2, 2)(1, 2, 4, 5)
])

// determinant()
assert.deepEqual(matrix(3, 3)(1, 5, 3, 2, 4, 7, 4, 6, 2).determinant(), 74)
assert.deepEqual(minvertable.determinant(), 1)

// adjugate()
assert.deepEqual(minvertable.adjugate(), matrix(3, 3)(-24, 18, 5, 20, -15, -4, -5, 4, 1))

// inverse()
assert.deepEqual(minvertable.inverse(), matrix(3, 3)(-24, 18, 5, 20, -15, -4, -5, 4, 1))
assert.deepEqual(minvertable.inverse().multiply(minvertable), identity(3))

console.log('All is ok :)')

