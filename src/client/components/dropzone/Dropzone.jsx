import React, { useCallback, useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { fade, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { getFile } from '../utils';
import PreviewList from './PreviewList';

const useStyles = makeStyles(() => ({
  text: {
    textAlign: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    borderStyle: 'dashed',
    backgroundColor: fade('#555', 0.2),
  },
  default: {
    borderColor: 'black',
  },
  error: {
    borderColor: 'red',
  },
  disabled: {
    borderColor: 'gray',
  },
}));

export default function CustomDropzone({
  error,
  field,
  reset,
  helperText,
  setFieldValue,
  ...dropZoneProps
}) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { disabled } = dropZoneProps;
  const classes = useStyles();

  const addFiles = (droppedFiles = []) =>
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);

  const onDrop = useCallback(async acceptedFiles => {
    if (!acceptedFiles.length) return;
    setLoading(true);
    addFiles(acceptedFiles);
    const response = await Promise.all(acceptedFiles.map(getFile));
    setFieldValue(field, response);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (reset) {
      setFiles([]);
    }
  }, [reset]);

  return (
    <Dropzone onDrop={onDrop} {...dropZoneProps}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          className={clsx(classes.container, {
            [classes.error]: error,
            [classes.disabled]: disabled,
            [classes.default]: !disabled && !error,
          })}
          {...getRootProps()}
        >
          <input id={field} name={field} {...getInputProps()} />
          <p className={classes.text}>
            {error && helperText}
            {isDragActive && !error && 'Drop Files here ...'}
            {!files.length && !error && 'Drop files here or click to upload'}
          </p>
          {!!files.length && <PreviewList files={files} loading={loading} />}
        </div>
      )}
    </Dropzone>
  );
}
