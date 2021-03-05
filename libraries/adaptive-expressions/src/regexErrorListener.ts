/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ANTLRErrorListener, Recognizer, RecognitionException } from 'antlr4ts';

/**
 * Error listener for Regex.
 */
// re-enable when this rule honors underscore prefix
/* eslint-disable @typescript-eslint/no-unused-vars */

export class RegexErrorListener implements ANTLRErrorListener<void> {
    public static readonly Instance: RegexErrorListener = new RegexErrorListener();

    /**
     * Upon syntax error, notify any interested parties.
     * @param _recognizer What parser got the error. From this object, you can access the context as well as the input stream.
     * @param _offendingSymbol Offending token in the input token stream, unless recognizer is a lexer, then it's null.
     * @param line Line number in the input where the error occurred.
     * @param charPositionInLine Character position within the line where the error occurred.
     * @param msg Message to emit.
     * @param _e Exception generated by the parser that led to the reporting of an error.
     */
    public syntaxError<T>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _recognizer: Recognizer<T, any>,
        _offendingSymbol: T,
        _line: number,
        _charPositionInLine: number,
        _msg: string,
        _e: RecognitionException | undefined
    ): void {
        throw Error(`Regular expression is invalid.`);
    }
}
