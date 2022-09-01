import { useEffect, useState, useRef } from 'react'
import { isEmpty } from 'ramda'
import { R } from 'lib/utils'
import { GateField, FieldConfig, GateFieldState } from './types'

export function useField<T>({
    key,
    label,
    initialValue,
    validationRules,
    isRequired,
    placeholder,
    validateOnBlur = false,
    dependencies = [],
    liveParser,
    submitParser
}: FieldConfig<T>): GateField<T> {
    const [field, setField] = useState<GateFieldState<T>>({
        value: initialValue,
        isPristine: true,
        errorMessage: ''
    })
    const isFirstRender = useRef<boolean>(true)

    useEffect(() => {
        const areDependenciesSet = dependencies?.every(dependency => R.isDefined(dependency))

        if (!areDependenciesSet) {
            return
        }

        if (isFirstRender.current) {
            isFirstRender.current = false

            return
        }

        setField(prevState => ({
            ...prevState,
            errorMessage: computeErrorMessage(undefined, true)
        }))
    }, dependencies)

    const computeErrorMessage = (value?: T, forceCheck: boolean = false) => {
        if ((!forceCheck && field.isPristine) || !validationRules) {
            return ''
        }

        const val = (R.isDefined(value)
            ? value
            : field.value) as T

        if (isRequired && isEmpty(val)) {
            return validationRules[0].errorMessage
        }

        if (!isRequired && !Boolean(val)) {
            return ''
        }

        const firstError = validationRules
            .find(rule => !rule.validate(val))

        return firstError
            ? firstError.errorMessage
            : ''
    }

    return {
        key,
        label,
        isRequired,
        placeholder,
        submitParser,
        value: field.value,
        hasChange: field.value !== initialValue,
        errorMessage: field.errorMessage,
        onBlur: () => setField(prevState => ({
            ...prevState,
            isPristine: false,
            errorMessage: computeErrorMessage(undefined, true)
        })),
        onChangeValue: (newValue: T) => setField(prevState => ({
            ...prevState,
            value: liveParser
                ? liveParser(newValue)
                : newValue,
            isPristine: prevState.isPristine
                ? validateOnBlur
                : prevState.isPristine,
            errorMessage: computeErrorMessage(newValue)
        })),
        validateOnSubmit: () => {
            const errorMessage = computeErrorMessage(undefined, true)

            if (errorMessage) {
                setField(prevState => ({
                    ...prevState,
                    errorMessage
                }))

                return errorMessage
            }

            return ''
        },
        setError: (errorMessage: string) => setField(prevState => ({
            ...prevState,
            errorMessage
        })),
        resetState: () => setField(prevState => ({
            ...prevState,
            isPristine: true,
            errorMessage: '',
            value: initialValue
        }))
    }
}
