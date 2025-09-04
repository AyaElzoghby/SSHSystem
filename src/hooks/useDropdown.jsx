import { API } from "@/api/api";
import { useEffect, useState } from "react";

export default function useDropdown(
  url,
  params = {},
  mapping = ["id", "name"]
) {
  const [options, setOptions] = useState([]);
  const api = API();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching:", url, params);

      try {
        // ✅ فلترة البارامز: نشيل أي param قيمته null/undefined/""
        let cleanParams = null;
        if (params && Object.keys(params).length > 0) {
          cleanParams = Object.fromEntries(
            Object.entries(params).filter(
              ([, v]) => v !== null && v !== undefined && v !== ""
            )
          );
        }

        const res = await api.get(
          url,
          cleanParams ? { params: cleanParams } : {}
        );
        const data = res?.data || res;

        if (Array.isArray(data)) {
          console.log("Dropdown Data Before Mapping:", data);

          setOptions(
            data.map((item) => ({
              value: item[mapping[0]],
              label: item[mapping[1]],
              raw: item,
            }))
          );

          console.log(
            "Dropdown Options After Mapping:",
            data.map((item) => ({
              value: item[mapping[0]],
              label: item[mapping[1]],
            }))
          );
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error("useDropdown error:", error);
        setOptions([]);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params), mapping[0], mapping[1]]);

  return options;
}

// import { API } from "@/api/api";
// import { useEffect, useState } from "react";

// export default function useDropdown(
//   url,
//   params = {},
//   mapping = ["id", "name"]
// ) {
//   const [options, setOptions] = useState([]);
//   const api = API();

//   useEffect(() => {

//     const fetchData = async () => {
//       console.log("Fetching:", url, params);

//       try {
//         const res = await api.get(url, params ? { params } : {});
//         const data = res?.data || res;

//         if (Array.isArray(data)) {
//           console.log("Dropdown Data Before Mapping:", data);

//           setOptions(
//             data.map((item) => ({
//               value: item[mapping[0]],
//               label: item[mapping[1]],
//               raw: item,
//             }))
//           );
//           console.log(
//             "Dropdown Options After Mapping:",
//             data.map((item) => ({
//               value: item[mapping[0]],
//               label: item[mapping[1]],
//             }))
//           );
//         } else {
//           setOptions([]);
//         }
//       } catch (error) {
//         console.error("useDropdown error:", error);
//         setOptions([]);
//       }
//     };

//     fetchData();
//   }, [
//     url,
//     JSON.stringify(params), // أهم حاجة هنا عشان detect التغيرات
//     mapping[0],
//     mapping[1],
//   ]);

//   return options;
// }

// import { API } from "@/api/api";
// import { useEffect, useState } from "react";

// export default function useDropdown(
//   url,
//   params = {},
//   mapping = ["id", "name"]
// ) {
//   const [options, setOptions] = useState([]);
//   const api = API();

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log("Fetching:", url, params);

//       try {
//         const res = await api.get(url, { params });
//         const data = res?.data || res;

//         if (Array.isArray(data)) {
//           setOptions(
//             data.map((item) => ({
//               value: item[mapping[0]],
//               label: item[mapping[1]],
//               raw: item,
//             }))
//           );
//         } else {
//           setOptions([]);
//         }
//       } catch (error) {
//         console.error("useDropdown error:", error);
//         setOptions([]);
//       }
//     };

//     fetchData();
//   }, [
//     url,
//     JSON.stringify(params), // أهم حاجة هنا
//     mapping[0],
//     mapping[1],
//   ]);

//   return options;
// }

// import { API } from "@/api/api";
// import { useEffect, useState } from "react";

// export default function useDropdown(url, params = {}, mapping = ["id", "name"]) {
//   const [options, setOptions] = useState([]);
//   const api = API();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get(url, { params }); // هنا بعتنا البارامترات
//         const data = res?.data || res;

//         if (Array.isArray(data)) {
//           setOptions(
//             data.map((item) => ({
//               value: item[mapping[0]],
//               label: item[mapping[1]],
//               raw: item, // لو محتاجة باقي البيانات
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
