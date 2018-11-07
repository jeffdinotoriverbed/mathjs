'use strict'

import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'
import { nearlyEqual } from '../../utils/number'
import { factory } from '../../utils/factory'

const name = 'equalScalar'
const dependencies = ['typed', 'config']

export const createEqualScalar = factory(name, dependencies, ({ typed, config }) => {
  /**
   * Test whether two scalar values are nearly equal.
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit} x   First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex} y          Second value to compare
   * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
   * @private
   */
  const equalScalar = typed(name, {

    'boolean, boolean': function (x, y) {
      return x === y
    },

    'number, number': function (x, y) {
      return x === y || nearlyEqual(x, y, config().epsilon)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.eq(y) || bigNearlyEqual(x, y, config().epsilon)
    },

    'Fraction, Fraction': function (x, y) {
      return x.equals(y)
    },

    'Complex, Complex': function (x, y) {
      return x.equals(y)
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return equalScalar(x.value, y.value)
    }
  })

  return equalScalar
})
