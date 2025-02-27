export * from './formation';
export * from './certification';
export * from './entreprise';

export type InputType = {
    name?: string;
    value?: string;
    type?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    onChange?: (e: any) => void;
}