import * as Yup from 'yup';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function createRequiredSchema(fieldname: string) {
  return Yup.string()
    .trim()
    .transform((value: string) => (value === '' ? undefined : value))
    .required(`${fieldname} is required`);
}
