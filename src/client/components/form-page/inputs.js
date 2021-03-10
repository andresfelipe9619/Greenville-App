import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

export const CustomInput = ({
  values,
  name,
  label,
  type,
  style,
  touched,
  errors,
  isLoading,
  handleChange,
  handleBlur,
}) => (
  <Input
    inputProps={{ 'aria-label': label }}
    value={values[name] || ''}
    onChange={handleChange}
    disabled={isLoading}
    onBlur={handleBlur}
    helperText={touched[name] && errors[name]}
    error={!!(touched[name] && errors[name])}
    required
    style={style}
    type={type}
    id={name}
    name={name}
    fullWidth
  />
);
export const CustomTextField = ({
  values,
  name,
  label,
  type,
  style,
  touched,
  disabled,
  errors,
  rows,
  rowsMax,
  multiline,
  isLoading,
  handleChange,
  handleBlur,
}) => (
  <TextField
    value={values[name] || ''}
    onChange={handleChange}
    disabled={isLoading || disabled}
    onBlur={handleBlur}
    helperText={touched[name] && errors[name]}
    error={!!(touched[name] && errors[name])}
    required
    style={style}
    type={type}
    id={name}
    name={name}
    rows={rows}
    multiline={multiline}
    rowsMax={rowsMax}
    label={label}
    fullWidth
  />
);

export const CustomSelect = ({
  name,
  label,
  classes,
  errors,
  style,
  touched,
  values,
  options,
  handleChange,
  isLoading,
}) => (
  <FormControl
    classes={{ root: classes.formControl }}
    fullWidth
    style={style}
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
      {(options || []).map((o, i) => (
        <MenuItem key={i} value={o.name}>
          {o.name}
        </MenuItem>
      ))}
    </Select>
    <FormHelperText>
      {touched.tematica_ponencia && errors.tematica_ponencia}
    </FormHelperText>
  </FormControl>
);
