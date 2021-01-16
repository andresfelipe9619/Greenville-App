import React from 'react';
import Icon from '@material-ui/core/Icon';

export default function Thumb({ file, loading }) {
  if (!file) return null;
  if (loading) return <p>Cargando Archivo...</p>;
  let { size } = file;
  const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size > 900) {
    size /= 1024;
    i++;
  }
  const exactSize = `${Math.round(size * 100) / 100} ${fSExt[i]}`;
  return (
    <>
      <Icon>description</Icon>
      <p>
        <strong>Nombre: </strong> {file.name}
      </p>
      <p>
        <strong>Tamaño: </strong> {exactSize}
      </p>
    </>
  );
}
