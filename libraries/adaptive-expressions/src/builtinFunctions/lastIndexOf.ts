/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Expression } from '../expression';
import { ExpressionEvaluator, ValueWithError } from '../expressionEvaluator';
import { ExpressionType } from '../expressionType';
import { FunctionUtils } from '../functionUtils';
import { InternalFunctionUtils } from '../functionUtils.internal';
import { MemoryInterface } from '../memory/memoryInterface';
import { Options } from '../options';
import { ReturnType } from '../returnType';

/**
 * Returns the index of the last occurrence of a specified value in an array.
 * The zero-based index position of value if that value is found, or -1 if it is not.
 */
export class LastIndexOf extends ExpressionEvaluator {
    /**
     * Initializes a new instance of the [LastIndexOf](xref:adaptive-expressions.LastIndexOf) class.
     */
    public constructor() {
        super(ExpressionType.LastIndexOf, LastIndexOf.evaluator, ReturnType.Number, LastIndexOf.validator);
    }

    /**
     * @private
     */
    private static evaluator(expression: Expression, state: MemoryInterface, options: Options): ValueWithError {
        let value = -1;
        const { args, error: childrenError } = FunctionUtils.evaluateChildren(expression, state, options);
        let error = childrenError;
        if (!error) {
            const firstChild = args[0];
            const secondChild = args[1];
            if (firstChild == null || typeof firstChild === 'string') {
                if (secondChild == null || typeof secondChild === 'string') {
                    const str = InternalFunctionUtils.parseStringOrUndefined(firstChild);
                    const searchValue = InternalFunctionUtils.parseStringOrUndefined(secondChild);
                    value = str.lastIndexOf(searchValue, str.length - 1);
                } else {
                    error = `Can only look for indexof string in ${expression}`;
                }
            } else if (Array.isArray(firstChild)) {
                value = firstChild.lastIndexOf(secondChild);
            } else {
                error = `${expression} works only on string or list.`;
            }
        }

        return { value, error };
    }

    /**
     * @private
     */
    private static validator(expression: Expression): void {
        FunctionUtils.validateOrder(expression, [], ReturnType.String | ReturnType.Array, ReturnType.Object);
    }
}
