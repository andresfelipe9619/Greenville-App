import * as Yup from 'yup';

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const testValues = {
  model: 'A',
  builder: 'B',
  zone: 'C',
  lastName: 'SUAREZ',
  address: 'Mariano Ramos',
  drywallFootage: '2222',
  footGarage: '2222',
  footHouse: '2222',
  footExterior: '2222',
  houseFile: undefined,
};

const initialValues = {
  model: '',
  builder: '',
  idHR: '',
  zone: '',
  lastName: '',
  address: '',
  drywallFootage: '',
  footGarage: '',
  footHouse: '',
  footExterior: '',
  houseFile: undefined,
};

const defaultSchema = {
  idHR: Yup.number().required('Obligatory field'),
  drywallFootage: Yup.number().required('Obligatory field'),
  footGarage: Yup.number().required('Obligatory field'),
  footHouse: Yup.number().required('Obligatory field'),
  footExterior: Yup.number().required('Obligatory field'),
  model: Yup.string().required('Obligatory field'),
  builder: Yup.string().required('Obligatory field'),
  zone: Yup.string().required('Obligatory field'),
  lastName: Yup.string().required('Obligatory field'),
};

const updateValidationSchema = Yup.object().shape({
  ...defaultSchema,
});

const createValidationSchema = Yup.object().shape({
  ...defaultSchema,
  address: Yup.string().required('Obligatory field'),
  // houseFile: Yup.mixed()
  //   .required('The file is required')
  //   .test(
  //     'fileSize',
  //     'File too big!',
  //     value => value && value.size <= FILE_SIZE
  //   ),
});

export {
  initialValues,
  testValues,
  SUPPORTED_FORMATS,
  createValidationSchema,
  updateValidationSchema,
};
