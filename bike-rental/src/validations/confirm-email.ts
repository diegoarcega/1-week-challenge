import * as Yup from 'yup';

export default Yup.string()
  .trim()
  .transform((value: string) => (value === '' ? undefined : value))
  .required('Email confirmation is required')
  .min(5, 'Email confirmation is too short')
  .email('Email is invalid')
  .oneOf([Yup.ref('email')], 'Emails must match');
