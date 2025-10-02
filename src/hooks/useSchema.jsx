// src/hooks/useSchema.js
import { useEffect, useState, useMemo } from "react";

const generateInitialFormState = (schema) => {
  if (!schema) return {};
  return Object.keys(schema).reduce((acc, key) => {
    const type = schema[key]?.type;
    const format = schema[key]?.format;

    switch (type) {
      case "string":
        acc[key] = format === "date-time" ? null : "";
        break;
      case "integer":
      case "number":
        acc[key] = null; // null instead of 0
        break;
      case "boolean":
        acc[key] = false;
        break;
      default:
        acc[key] = null;
    }
    return acc;
  }, {});
};

export const useSchema = (dtoName) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dtoName) return;

    const fetchSchema = async () => {
      setLoading(true);
      try {
        const res = await fetch("/swagger/v1/swagger.json");
        const data = await res.json();

        const dtoSchema = data?.components?.schemas?.[dtoName]?.properties;
        if (!dtoSchema) {
          throw new Error(`Schema for ${dtoName} not found`);
        }

        setSchema(dtoSchema);
        setError(null);
      } catch (err) {
        console.error("Error fetching schema", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, [dtoName]);

  const initialState = useMemo(
    () => generateInitialFormState(schema),
    [schema]
  );

  return { schema, initialState, loading, error };
};

// // src/hooks/useSchema.js
// import { useEffect, useState, useMemo } from "react";

// // دالة مساعدة تولد initial state من schema
// const generateInitialFormState = (schema) => {
//   if (!schema) return {};
//   return Object.keys(schema).reduce((acc, key) => {
//     const type = schema[key]?.type;
//     switch (type) {
//       case "string":
//         acc[key] = "";
//         break;
//       case "integer":
//       case "number":
//         acc[key] = 0;
//         break;
//       case "boolean":
//         acc[key] = false;
//         break;
//       default:
//         acc[key] = null;
//     }
//     return acc;
//   }, {});
// };

// export const useSchema = (dtoName) => {
//   const [schema, setSchema] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!dtoName) return;

//     const fetchSchema = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/swagger/v1/swagger.json");
//         const data = await res.json();

//         const dtoSchema = data?.components?.schemas?.[dtoName]?.properties;
//         if (!dtoSchema) {
//           throw new Error(`Schema for ${dtoName} not found`);
//         }

//         setSchema(dtoSchema);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching schema", err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchema();
//   }, [dtoName]);

//   // initial state يتحسب مرة واحدة بس لما schema يتغير
//   const initialState = useMemo(() => generateInitialFormState(schema), [schema]);

//   return { schema, initialState, loading, error };
// };

// // // src/hooks/useSchema.js
// // import { useEffect, useState } from "react";

// // export const useSchema = (dtoName) => {
// //   const [schema, setSchema] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if (!dtoName) return;

// //     const fetchSchema = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await fetch("/swagger/v1/swagger.json");
// //         const data = await res.json();

// //         const dtoSchema = data?.components?.schemas?.[dtoName]?.properties;
// //         if (!dtoSchema) {
// //           throw new Error(`Schema for ${dtoName} not found`);
// //         }

// //         setSchema(dtoSchema);
// //         setError(null);
// //       } catch (err) {
// //         console.error("Error fetching schema", err);
// //         setError(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchSchema();
// //   }, [dtoName]);

// //   return { schema, loading, error };
// // };
