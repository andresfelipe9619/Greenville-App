import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { getFileSize } from '../utils';

export default function Thumb({ file, loading }) {
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
    </>
  );
}
