type VoidFunction = () => void

type ValidationRule<T> = {
    errorMessage: string,
    validate(value: T): boolean
}

type Field<T> = {
    value: T,
    key: string,
    label?: string,
    isRequired: boolean,
    hasChange: boolean,
    placeholder?: string,
    errorMessage: string,
    onBlur: VoidFunction,
    resetState: VoidFunction,
    validate: VoidFunction,
    children?: Array<Field<T>>,
    hasError: boolean,
    validateOnSubmit(): string,
    onChangeValue(newValue: T): void,
    submitParser?(value: T): T,
    setError(errorMessage: string): void
}

type FieldConfig<T> = {
    key: string,
    label?: string,
    initialValue: T,
    isRequired: boolean,
    placeholder?: string,
    validateOnBlur?: boolean,
    validationRules?: Array<ValidationRule<T>>,
    liveParser?(value: T): T,
    submitParser?(value: T): T
}

type UseFormReturn<T> = {
    form: Record<keyof T, Field<any>>,
    hasError: boolean,
    isFilled: boolean,
    resetForm: VoidFunction,
    submit: VoidFunction,
    validateAll: VoidFunction,
    formHasChanges(): boolean,
    setError(field: string, errorMessage: string): void,
    setFieldValue(field: string, value: any): void,
    setFieldInitialValue(field: string, value: any): void,
    addFields(fields: Array<Field>): void,
    removeFieldIds(fields: Array<string>)
}

type FormGateCallbacks<T> = {
    onSuccess(form: T): void,
    onError?(form: Record<keyof T, string>): void
}

declare function useForm<T>(
    formFields: Record<keyof T, Field<any>>,
    callbacks: FormGateCallbacks<T>
): UseFormReturn<T>

declare function useField<T>(props: FieldConfig<T>): Field<T>

export {
    useForm,
    useField,
    Field,
    UseFormReturn
}
