import { API } from "@/api/api";
import { useEffect, useState } from "react";

export default function useDropdown(url, params = {}, mapping = ["id", "name"]) {
  const [options, setOptions] = useState([]);
  const api = API();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(url, { params }); // هنا بعتنا البارامترات
        const data = res?.data || res;

        if (Array.isArray(data)) {
          setOptions(
            data.map((item) => ({
              value: item[mapping[0]],
              label: item[mapping[1]],
              raw: item, // لو محتاجة باقي البيانات
            }))
          );
        }
      } catch (error) {
        console.error("useDropdown error:", error);
        setOptions([]);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params), JSON.stringify(mapping)]);

  return options;
}

// import { API } from "@/api/api";
// import { useEffect, useState } from "react";


// export default function useDropdown(url, params = {}, mapping = ["id", "name"]) {
//   const [options, setOptions] = useState([]);
// const api = API()
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get(url);
//         const data = res?.data || res;

//         if (Array.isArray(data)) {
//           setOptions(
//             data.map((item) => ({
//               value: item[mapping[0]],
//               label: item[mapping[1]],
//               raw: item, // عشان لو عاوزة باقي البيانات
//             }))
//           );
//         }
//       } catch (error) {
//         console.error("useDropdown error:", error);
//         setOptions([]);
//       }
//     };

//     fetchData();
//   }, [url, JSON.stringify(params), JSON.stringify(mapping)]);

//   return options;
// }
