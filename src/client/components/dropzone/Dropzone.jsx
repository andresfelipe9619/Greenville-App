import React, {useCallback, useState} from 'react';
import Dropzone from 'react-dropzone';
import Thumb from './Thumb';
export default function CustomDropzone({
  error,
  accept,
  values,
  disabled,
  setFieldValue,
  helperText,
}) {
  const [loading, setLoading] = useState(false);
  const file = values.archivo_ponencia;
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setLoading(true);
    setFieldValue('archivo_ponencia', acceptedFiles[0]);
    setLoading(false);
  }, []);

  const style = {
    borderStyle: 'dashed',
    borderColor: error ? 'red' : disabled ? 'gray' : 'black',
  };

  return (
    <Dropzone onDrop={onDrop} accept={accept} disabled={disabled}>
      {({getRootProps, getInputProps, isDragActive}) => (
        <div style={style} {...getRootProps()}>
          <input
            id="archivo_ponencia"
            name="archivo_ponencia"
            {...getInputProps()}
          />
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
