/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
 import Api from '../tools/api';
import {
    __,
    allPass,
    andThen,
    assoc,
    compose,
    concat,
    gt, ifElse,
    lt,
    mathMod,
    otherwise,
    partial,
    prop,
    tap,
    test,
    length
} from "ramda";

const API_NUMBERS_URL = 'https://api.tech/numbers/base';
const API_ANIMALS_URL = 'https://animals.tech/';

const api = new Api();

const square = num => num ** 2;
const thenSquare = andThen(square);

const greaterThanTwo = gt(__, 2);
const lessThanTen = lt(__, 10);

const lengthGreaterThanTwo = compose(greaterThanTwo, length);
const lengthLowerThanTen = compose(lessThanTen, length);
const testOnlyNumbers = test(/^[0-9]+\.?[0-9]+$/);
const stringToNumberAndRound = compose(Math.round, Number);
const modForThreeToString = compose(String, mathMod(__, 3));
const thenModOfThreeToString = andThen(modForThreeToString);
const thenGetLength = andThen(length);

const validation = allPass([lengthGreaterThanTwo, lengthLowerThanTen, testOnlyNumbers]);

const getResponseResult = compose(String, prop('result'));

const assocNumberToBinary = assoc('number', __, { from: 10, to: 2 });

const apiGetNumberBinaryBase = compose(
    api.get(API_NUMBERS_URL),
    assocNumberToBinary
);

const thenGetResponseResult = andThen(getResponseResult);
const thenConcatToAnimalsUrl = andThen(concat(API_ANIMALS_URL));
const thenCallApiWithEmptyParams = andThen(api.get(__, {}));

 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
     const tapLog = tap(writeLog);
     const thenTapLog = andThen(tapLog);
     const thenHandleSuccess = andThen(handleSuccess);
     const otherwiseHandleError = otherwise(handleError);

     const handleValidationError = partial(handleError, ['ValidationError']);

     const app = compose(
         otherwiseHandleError,
         thenHandleSuccess, // 9
         thenGetResponseResult, // 8
         thenCallApiWithEmptyParams,
         thenConcatToAnimalsUrl,
         thenTapLog, // 7
         thenModOfThreeToString,
         thenTapLog, // 6
         thenSquare,
         thenTapLog, // 5
         thenGetLength,
         thenTapLog, // 4
         thenGetResponseResult,
         apiGetNumberBinaryBase,
         tapLog, // 3
         stringToNumberAndRound,
     );

     const runWithCondition = ifElse(validation, app, handleValidationError); // 2
     const logAndRunApp = compose(runWithCondition, tapLog); // 1

     logAndRunApp(value);
 }

export default processSequence;
