
const Calculator = require('../modules/calculator');
const calculator = new Calculator();

it('1 + 2 = 3 >', () => {
    const expected = 3;
    expect(calculator.add(1, 2)).toEqual(3);
});