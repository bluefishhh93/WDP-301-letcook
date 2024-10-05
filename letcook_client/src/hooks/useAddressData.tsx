import { set } from "date-fns";
import { useState, useEffect } from "react";


interface DistrictOption {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
}

interface WardOption {
  WardCode: string;
  WardName: string;
}

interface ProvinceOption {
  ProvinceID: number;
  ProvinceName: string;
}

export const useAddressData = () => {
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [wards, setWards] = useState<WardOption[]>([]);

  // useEffect(() => {
  //   // fetchProvinces();
  //   fetchDistricts("48");
  // }, []);

  const fetchProvinces = async () => {
    try {
      const response  = await fetch('/api/address?type=province')
      const data = await response.json()
      setProvinces(data)
    } catch (error) {
      console.error("Error fetching provinces:", error);  
      setProvinces([]);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await fetch(
        `/api/address?type=district&provinceId=${provinceId}`
      );
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const response = await fetch(`/api/address?type=ward&districtId=${districtId}`);
      const data = await response.json();
      setWards(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
      setWards([]);
    }
  };

  useEffect(() => {
    fetchDistricts(203); // Fetch districts for the default province (203) only once when the component mounts
  }, []);

  return { provinces, districts, wards, fetchProvinces, fetchDistricts, fetchWards };
};
