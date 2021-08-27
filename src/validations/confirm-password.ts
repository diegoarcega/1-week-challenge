import * as Yup from 'yup';

export default Yup.string()
  .trim()
  .transform((value: string) => (value === '' ? undefined : value))
  .required('Password confirmation is required')
  .min(8, 'Password confirmation is too short')
  .oneOf([Yup.ref('password')], 'Passwords must match');
