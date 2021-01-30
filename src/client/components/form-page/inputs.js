import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

export const CustomTextField = ({
  values,
  name,
  label,
  type,
  touched,
  errors,
  isLoading,
  handleChange,
  handleBlur,
  ...props
}) => (
  <TextField
    value={values[name] || ''}
    onChange={handleChange}
    disabled={isLoading}
    onBlur={handleBlur}
    helperText={touched[name] && errors[name]}
    error={!!(touched[name] && errors[name])}
    required
    type={type}
    id={name}
    name={name}
    label={label}
    fullWidth
    {...props}
  />
);

export const CustomSelect = ({
  name,
  label,
  classes,
  errors,
  touched,
  values,
  handleChange,
  isLoading,
}) => (
  <FormControl
    className={classes.formControl}
    fullWidth
    error={!!(touched[name] && errors[name])}
  >
    <InputLabel htmlFor={name}>{label}</InputLabel>
    <Select
      required
      fullWidth
      classes={{
        root: classes.root,
        select: classes.select,
      }}
      value={values[name] || ''}
      onChange={handleChange}
      disabled={isLoading}
      inputProps={{
        name,
        id: name,
      }}
    >
      <MenuItem value={'A'}>A</MenuItem>
      <MenuItem value={'B'}>B</MenuItem>
      <MenuItem value={'C'}>C</MenuItem>
    </Select>
    <FormHelperText>
      {touched.tematica_ponencia && errors.tematica_ponencia}
    </FormHelperText>
  </FormControl>
);
