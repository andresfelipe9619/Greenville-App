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
