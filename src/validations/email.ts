import * as Yup from 'yup';

export default Yup.string()
  .trim()
  .transform((value: string) => (value === '' ? undefined : value))
  .lowercase()
  .required('Email is required')
  .email('Email is not valid');
