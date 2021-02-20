import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { FilePreviewerThumbnail } from 'react-file-previewer';
import { getFileSize } from '../utils';
import './styles.css';

export default function Thumb({ file, loading, fileString }) {
  if (!file) return null;
  if (loading) return <p>Cargando Archivo...</p>;
  const { size } = file;
  const exactSize = getFileSize(size);

  return (
    <>
      <DescriptionIcon />
      <p>
        <strong>Nombre: </strong> {file.name}
      </p>
      <p>
        <strong>Tamaño: </strong> {exactSize}
      </p>
      {fileString && (
        <FilePreviewerThumbnail
          style={{ maxHeight: 180 }}
          file={{
            name: file.name,
            mimeType: file.type,
            data: fileString.substr(fileString.indexOf('base64,') + 7),
          }}
        />
      )}
    </>
  );
}
