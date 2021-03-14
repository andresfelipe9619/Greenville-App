import { useEffect, useState } from 'react';
import API from '../api';

export default function useHouseForm() {
  const [zones, setZones] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [models, setModels] = useState([]);
  const [filesGroups, setFilesGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const initFormData = async () => {
    try {
      const [z, b, m, f] = await Promise.all([
        API.getZones(),
        API.getBuilders(),
        API.getModels(),
        API.getFilesGroups(),
      ]);
      setZones(z);
      setModels(m);
      setBuilders(b);
      setFilesGroups(f);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initFormData();
  }, []);

  return { loading, zones, builders, models, filesGroups };
}

export function getFormData(values) {
  const formData = Object.keys(values).reduce(
    (acc, key) => {
      const keyValue = values[key];
      const isFile = Array.isArray(keyValue);
      if (isFile) {
        return {
          ...acc,
          houseFiles: [...acc.houseFiles, { group: key, files: [...keyValue] }],
        };
      }
      return { ...acc, formData: { ...acc.formData, [key]: keyValue } };
    },
    { houseFiles: [], formData: {} }
  );
  console.log(`Form Data`, formData);
  return formData;
}
