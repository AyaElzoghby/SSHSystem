// utils/schemaUtils.js

// يعمل generate للـ initialFormState بناءً على الـ schema
export const generateInitialFormState = (schema) => {
  const state = {};
  Object.entries(schema).forEach(([key, value]) => {
    switch (value.type) {
      case "string":
        // لو DateTime خليه فاضي بدلاً من string
        state[key] = value.format === "date-time" ? null : "";
        break;
      case "number":
      case "integer":
        state[key] = null;
        break;
      case "boolean":
        state[key] = false;
        break;
      default:
        state[key] = null;
    }
  });
  return state;
};

// لتحويل أي input → تاريخ مضبوط (toDate)
export const toDate = (value) => {
  try {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString(); // بصيغة ISO للـ API
  } catch {
    return null;
  }
};

// يحول الـ formState لقيم مناسبة للـ API
export const processFormData = (formState, schema) => {
  // نبدأ بالـ defaults عشان كل المفاتيح تبقى موجودة
  const data = generateInitialFormState(schema);

  Object.entries(formState).forEach(([key, value]) => {
    const field = schema[key];
    if (!field) return;

    if (field.format === "date-time" && value) {
      data[key] = toDate(value);
    } else if (field.type === "number" || field.type === "integer") {
      data[key] = value !== "" && value !== null ? Number(value) : null;
    } else if (field.type === "boolean") {
      data[key] = Boolean(value);
    } else {
      data[key] = value ?? data[key]; // fallback على الـ default
    }
  });

  return data;
};

// export const processFormData = (formState, schema) => {
//   const data = {};

//   Object.entries(formState).forEach(([key, value]) => {
//     const field = schema[key];

//     if (!field) return;

//     // handle date-time → ISO string
//     if (field.format === "date-time" && value) {
//       data[key] = toDate(value);
//     }
//     // handle numbers
//     else if (field.type === "number" || field.type === "integer") {
//       data[key] = value !== "" && value !== null ? Number(value) : null;
//     }
//     // handle boolean
//     else if (field.type === "boolean") {
//       data[key] = Boolean(value);
//     }
//     // default → string
//     else {
//       data[key] = value;
//     }
//   });

//   return data;
// };
