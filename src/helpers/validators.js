/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
    __,
    allPass,
    any,
    complement,
    compose,
    countBy,
    dissoc, equals,
    gte,
    identity,
    prop,
    values
} from "ramda";

const Shapes = {
    Star: 'star',
    Circle: 'circle',
    Triangle: 'triangle',
    Square: 'square'
}

const getStar = prop(Shapes.Star);
const getTriangle = prop(Shapes.Triangle);
const getSquare = prop(Shapes.Square);
const getCircle = prop(Shapes.Circle);

const Colors = {
    Red: 'red',
    White: 'white',
    Green: 'green',
    Blue: 'blue',
    Orange: 'orange',
};

const getGreen = prop(Colors.Green);
const getRed = prop(Colors.Red);

const isRed = (color) => color === Colors.Red;
const isWhite = (color) => color === Colors.White;
const isGreen = (color) => color === Colors.Green;
const isBlue = (color) => color === Colors.Blue;
const isOrange = (color) => color === Colors.Orange;

const withoutWhite = dissoc(Colors.White);

const isWhiteTriangle = compose(isWhite, getTriangle);
const isNotWhiteTriangle = complement(isWhiteTriangle);
const isGreenTriangle = compose(isGreen, getTriangle);

const isWhiteCircle = compose(isWhite, getCircle);
const isBlueCircle = compose(isBlue, getCircle);

const isWhiteStar = compose(isWhite, getStar);
const isNotWhiteStar = complement(isWhiteStar);
const isRedStar = compose(isRed, getStar);
const isNotRedStar = complement(isRedStar);

const isWhiteSquare = compose(isWhite, getSquare);
const isNotWhiteSquare = complement(isWhiteSquare);
const isGreenSquare = compose(isGreen, getSquare);
const isOrangeSquare = compose(isOrange, getSquare);

const numberOfColors = compose(countBy(identity), values);
const numberOfColorsWithoutWhite = compose(withoutWhite, numberOfColors);
const numberOfGreenColors = compose(getGreen, numberOfColors);

const greaterOrEqualsThanTwo = gte(__, 2);
const greaterOrEqualsThanThree = gte(__, 3);
const equalsFour = equals(__, 4);
const equalsTwo = equals(__, 2);
const equalsOne = equals(__, 1);
const anyGreaterOrEqualsThanThree = any(greaterOrEqualsThanThree);
const anyValueGreaterOrEqualsThanThree = compose(anyGreaterOrEqualsThanThree, values);

const twoGreen = compose(equalsTwo, getGreen, numberOfColors);
const oneRed = compose(equalsOne, getRed, numberOfColors);

const allHasColor = (color) => compose(equalsFour, prop(color), numberOfColors);

const isRedCountEqualsCountBlue = ({red, blue}) => red === blue;
const isTriangleCountEqualsSquareCount = ({triangle, square}) => triangle === square;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteTriangle, isWhiteCircle]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(greaterOrEqualsThanTwo, numberOfGreenColors);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(isRedCountEqualsCountBlue, numberOfColors);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(anyValueGreaterOrEqualsThanThree, numberOfColorsWithoutWhite);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([isGreenTriangle, twoGreen, oneRed]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allHasColor(Colors.Orange);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allHasColor(Colors.Green);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isNotWhiteTriangle, isNotWhiteSquare, isTriangleCountEqualsSquareCount]);
