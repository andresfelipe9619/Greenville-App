import { useEffect, useState } from 'react';
import API from '../api';

export default function useHouseForm() {
  const [zones, setZones] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [models, setModels] = useState([]);
  const [filesGroups, setFilesGroups] = useState([]);
  const [houseStatuses, setHouseStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const initFormData = async () => {
    try {
      const [z, b, m, f, s] = await Promise.all([
        API.getZones(),
        API.getBuilders(),
        API.getModels(),
        API.getFilesGroups(),
        API.getHouseStatuses(),
      ]);
      setZones(z);
      setModels(m);
      setBuilders(b);
      setFilesGroups(f);
      setHouseStatuses(s);
    } catch (error) {
      console.log('Error getting dependencies data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initFormData();
  }, []);

  return { loading, zones, builders, models, filesGroups, houseStatuses };
}

export function getFormData(values) {
  const formData = Object.keys(values).reduce(
    (acc, key) => {
      let keyValue = values[key];
      const isFile = Array.isArray(keyValue);
      if (isFile) {
        return {
          ...acc,
          houseFiles: [...acc.houseFiles, { group: key, files: [...keyValue] }],
        };
      }
      if (key == "model" || key == "builder") {
        keyValue = keyValue.name;
      }
      return { ...acc, formData: { ...acc.formData, [key]: keyValue } };
    },
    { houseFiles: [], formData: {} }
  );
  console.log(`Form Data`, formData);
  return formData;
}
