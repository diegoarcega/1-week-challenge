import * as Yup from 'yup';

export default Yup.string()
  .trim()
  .transform((value: string) => (value === '' ? undefined : value))
  .required('Password is required')
  .min(8, 'Password is too short');
