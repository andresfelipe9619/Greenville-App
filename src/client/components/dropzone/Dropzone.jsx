import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import Box from '@material-ui/core/Box';
import Thumb from './Thumb';
import { getFile } from '../utils';

export default function CustomDropzone({
  error,
  field,
  values,
  helperText,
  setFieldValue,
  ...dropZoneProps
}) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { disabled } = dropZoneProps;

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

  let borderColor = 'black';
  if (error) borderColor = 'red';
  if (disabled) borderColor = 'gray';
  const style = {
    borderColor,
    borderStyle: 'dashed',
  };

  return (
    <Dropzone onDrop={onDrop} {...dropZoneProps}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div style={style} {...getRootProps()}>
          <input id={field} name={field} {...getInputProps()} />
          {error && <p>{helperText}</p>}
          {isDragActive && !error && <p>Drop Files here ...</p>}
          {!files.length && !error && <p>Drop files here or click to upload</p>}
          {!!files.length && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {files.map((file, i) => (
                <Thumb key={i} {...{ file, loading }} />
              ))}
            </Box>
          )}
        </div>
      )}
    </Dropzone>
  );
}
