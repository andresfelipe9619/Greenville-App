import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import Thumb from './Thumb';

export default function CustomDropzone({
  error,
  field,
  accept,
  values,
  disabled,
  setFieldValue,
  helperText,
}) {
  const [loading, setLoading] = useState(false);
  const file = values[field];
  const onDrop = useCallback(acceptedFiles => {
    if (!acceptedFiles.length) return;
    setLoading(true);
    setFieldValue(field, acceptedFiles[0]);
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
    <Dropzone onDrop={onDrop} accept={accept} disabled={disabled}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div style={style} {...getRootProps()}>
          <input id="houseFile" name="houseFile" {...getInputProps()} />
          {error && <p>{helperText}</p>}
          {isDragActive && !error && <p>Arrastra los archivos acá ...</p>}
          {!file && !error && (
            <p>
              Arrastra y suelta tu archivo aquí, o haz clic para seleccionar un
              archivo
            </p>
          )}
          {file && <Thumb file={file} loading={loading} />}
        </div>
      )}
    </Dropzone>
  );
}
