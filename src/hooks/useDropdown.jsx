import { API } from "@/api/api";
import { useEffect, useState, useMemo, useRef } from "react";

// ✅ cache خارجي
const dropdownCache = {};

// 🔹 function بسيطة تقارن objects
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export default function useDropdown(url, params = {}, mapping = ["id", "name"]) {
  const [options, setOptions] = useState([]);
  const [stableParams, setStableParams] = useState(params);
  const api = useRef(API()).current;

  // 🔹 update stableParams بس لو فعلاً اتغير
  useEffect(() => {
    if (!isEqual(params, stableParams)) {
      setStableParams(params);
    }
  }, [params, stableParams]);

  // cleanParams
  const cleanParams = useMemo(() => {
    if (!stableParams || Object.keys(stableParams).length === 0) return null;
    return Object.fromEntries(
      Object.entries(stableParams).filter(
        ([, v]) => v !== null && v !== undefined && v !== ""
      )
    );
  }, [stableParams]);

  // cache key
  const cacheKey = useMemo(() => {
    return `${url}?${JSON.stringify(cleanParams)}`;
  }, [url, cleanParams]);

  useEffect(() => {
    let isMounted = true;

    if (dropdownCache[cacheKey]) {
      setOptions(dropdownCache[cacheKey]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await api.get(
          url,
          cleanParams ? { params: cleanParams } : {}
        );
        const data = res?.data || res;

        if (Array.isArray(data)) {
          const mappedOptions = data.map((item) => ({
            value: item[mapping[0]],
            label: item[mapping[1]],
            raw: item,
          }));

          if (isMounted) {
            setOptions(mappedOptions);
            dropdownCache[cacheKey] = mappedOptions;
          }
        } else {
          if (isMounted) setOptions([]);
        }
      } catch (error) {
        console.error("useDropdown error:", error);
        if (isMounted) setOptions([]);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, mapping[0], mapping[1], url]);

  return options;
}

// import { API } from "@/api/api";
// import { useEffect, useState, useMemo } from "react";

// // ✅ cache خارجي بسيط للاحتفاظ بالـ dropdown data
// const dropdownCache = {};

// export default function useDropdown(
//   url,
//   params = {},
//   mapping = ["id", "name"]
// ) {
//   const [options, setOptions] = useState([]);
//   const api = API();

//   // cleanParams ثابت لتقليل fetch غير الضروري
//   const cleanParams = useMemo(() => {
//     if (!params || Object.keys(params).length === 0) return null;
//     return Object.fromEntries(
//       Object.entries(params).filter(
//         ([, v]) => v !== null && v !== undefined && v !== ""
//       )
//     );
//   }, [JSON.stringify(params)]);

//   // key فريد للـ cache
//   const cacheKey = useMemo(() => {
//     return `${url}?${JSON.stringify(cleanParams)}`;
//   }, [url, cleanParams]);

//   useEffect(() => {
//     // ✅ إذا البيانات موجودة في الكاش، نستخدمها فورًا
//     if (dropdownCache[cacheKey]) {
//       setOptions(dropdownCache[cacheKey]);
//       return;
//     }

//     const fetchData = async () => {

//       try {
//         const res = await api.get(
//           url,
//           cleanParams ? { params: cleanParams } : {}
//         );
//         const data = res?.data || res;

//         if (Array.isArray(data)) {

//           const mappedOptions = data.map((item) => ({
//             value: item[mapping[0]],
//             label: item[mapping[1]],
//             raw: item,
//           }));

        

//           setOptions(mappedOptions);
//           dropdownCache[cacheKey] = mappedOptions; // ✅ تخزين النتائج في الكاش
//         } else {
//           setOptions([]);
//         }
//       } catch (error) {
//         console.error("useDropdown error:", error);
//         setOptions([]);
//       }
//     };

//     fetchData();
//   }, [cacheKey, mapping[0], mapping[1], url, params, cleanParams]);

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
//         // ✅ فلترة البارامز: نشيل أي param قيمته null/undefined/""
//         let cleanParams = null;
//         if (params && Object.keys(params).length > 0) {
//           cleanParams = Object.fromEntries(
//             Object.entries(params).filter(
//               ([, v]) => v !== null && v !== undefined && v !== ""
//             )
//           );
//         }

//         const res = await api.get(
//           url,
//           cleanParams ? { params: cleanParams } : {}
//         );
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
//   }, [url, JSON.stringify(params), mapping[0], mapping[1]]);

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
