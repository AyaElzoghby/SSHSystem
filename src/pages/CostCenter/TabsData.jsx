import Tabs from "../../components/Tabs";
import CostCenterLang from "@/constants/Lang/CostCenter";
import { useLanguage } from "@/context/LanguageContext";
import Checkbox from "@/components/Checkbox";
import DropdownComponent from "@/components/ui/DropDown";
import InputComponent from "@/components/InputComponent";
import DatePicker from "@/components/DatePicker";

export function CostCenterDetails({ DetailedTabs, selectedCostCenter }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedCostCenter ? (
        <>
          {/* toggle checkboxes */}
          <div className="flex justify-start gap-4 mb-4">
            <Checkbox
              label={CostCenterLang.secondary[languageId]}
              checked={!selectedCostCenter.dsecondry}
            />
            <Checkbox
              label={CostCenterLang.general[languageId]}
              checked={selectedCostCenter.dsecondry}
            />
          </div>
          <div className="flex gap-4 grid grid-cols-4 mb-4">
            <div className="col-span-1">
              <InputComponent
                disabled
                type="number"
                value={selectedCostCenter.dlevel}
                title={CostCenterLang.level[languageId]}
              />
            </div>
            <div className="col-span-3">
              <InputComponent
                disabled
                value={selectedCostCenter.dcodE1}
                title={CostCenterLang.CostCenterCode[languageId]}
                type="number"
              />
            </div>
          </div>
          <InputComponent
            disabled
            title={CostCenterLang.CostCenterNameArabic[languageId]}
            className="mb-4"
            value={selectedCostCenter.dname}
          />
          <InputComponent
            disabled
            title={CostCenterLang.CostCenterNameEnglish[languageId]}
            className="mb-4"
            value={selectedCostCenter.dnamE2}
          />
          <InputComponent
            disabled
            title={CostCenterLang.usercreate[languageId]}
            value={selectedCostCenter.userName}
          />
          <InputComponent
            disabled
            title={CostCenterLang.codecreate[languageId]}
            value={selectedCostCenter.userNo}
            type="number"
          />{" "}
          <DatePicker
            disabled
            title={CostCenterLang.datecreate[languageId]}
            value={selectedCostCenter.es_Date}
          />{" "}
          <InputComponent
            disabled
            title={CostCenterLang.useredit[languageId]}
            value={selectedCostCenter.eUserName}
          />
          <InputComponent
            disabled
            title={CostCenterLang.codeeditor[languageId]}
            value={selectedCostCenter.eUserNo}
            type="number"
          />{" "}
          <DatePicker
            disabled
            title={CostCenterLang.editdate[languageId]}
            value={selectedCostCenter.edDate}
          />
          {!selectedCostCenter.dsecondry && <Tabs contents={DetailedTabs} />}
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {CostCenterLang.SelelctCostCenterDetails[languageId]}
        </p>
      )}
    </>
  );
}
export function Information({ selectedCostCenter }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedCostCenter ? (
        <>
          <InputComponent
            disabled
            title={CostCenterLang.Address1[languageId]}
            value={selectedCostCenter.daddress}
          />
          <InputComponent
            disabled
            title={CostCenterLang.Address2[languageId]}
            value={selectedCostCenter.daddresS2}
          />
          <InputComponent
            disabled
            title={CostCenterLang.fax[languageId]}
            value={selectedCostCenter.dphonE2}
            type="number"
          />
          <InputComponent
            disabled
            title={CostCenterLang.phone[languageId]}
            value={selectedCostCenter.dphone}
            type="number"
          />
          <InputComponent
            disabled
            title={CostCenterLang.mobile[languageId]}
            className="mb-4"
            value={selectedCostCenter.dtelx}
            type="number"
          />
          <InputComponent
            disabled
            title={CostCenterLang.Employee[languageId]}
            value={selectedCostCenter.demployee}
          />
          <InputComponent
            disabled
            title={CostCenterLang.sales[languageId]}
            value={selectedCostCenter.dslaes}
          />
          <InputComponent
            disabled
            title={CostCenterLang.email[languageId]}
            className="mb-4"
            value={selectedCostCenter.email}
            type="email"
          />
          <DatePicker
            disabled
            title={CostCenterLang.creationdate[languageId]}
            value={selectedCostCenter.dvaluedate}
          />
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {CostCenterLang.SelelctCostCenterDetails[languageId]}
        </p>
      )}
    </>
  );
}
export function Openingbalance({ selectedCostCenter, Currencies }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedCostCenter ? (
        <>
          {" "}
          <InputComponent
            disabled
            title={`${CostCenterLang.openingBalanceCurrent[languageId]} ${
              selectedCostCenter.doldacC2 > 0
                ? CostCenterLang.credit[languageId]
                : selectedCostCenter.doldacC1 > 0
                ? CostCenterLang.debt[languageId]
                : ""
            }`}
            value={selectedCostCenter.doldacc}
            type="number"
          />
          <div className="flex gap-4">
            <InputComponent
              disabled
              flex
              title={CostCenterLang.debtor[languageId]}
              value={selectedCostCenter.doldacC1}
              type="number"
            />
            <InputComponent
              disabled
              flex
              title={CostCenterLang.creditor[languageId]}
              value={selectedCostCenter.doldacC2}
              type="number"
            />
          </div>
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {CostCenterLang.SelelctCostCenterDetails[languageId]}
        </p>
      )}
    </>
  );
}
export function CostCenterControl({ selectedCostCenter }) {
  const { languageId } = useLanguage();

  return (
    <>
      {selectedCostCenter ? (
        <>
          <Checkbox
            disabled
            checked={selectedCostCenter.dstop}
            label={CostCenterLang.SuspendCostCenter[languageId]}
          />
          {selectedCostCenter.dstop && (
            <InputComponent
              disabled
              placeholder={CostCenterLang.SuspendCostCenterReason[languageId]}
              value={selectedCostCenter.dStop_Rem}
            />
          )}
          <Checkbox
            disabled
            checked={selectedCostCenter.accshow_Rem}
            label={CostCenterLang.CostCenterHandlingNotes[languageId]}
          />
          {selectedCostCenter.accshow_Rem && (
            <InputComponent
              disabled
              value={selectedCostCenter.acc_Rem}
              placeholder={CostCenterLang.CostCenterHandlingNotes[languageId]}
            />
          )}
        </>
      ) : (
        <p className="text-textPrimary text-base font-bold">
          {CostCenterLang.SelelctCostCenterDetails[languageId]}
        </p>
      )}
    </>
  );
}
// export function Information1({ selectedCostCenter }) {
//   const { languageId } = useLanguage();

//   return (
//     <>
//       {selectedCostCenter ? (
//         <>
//           <div className="grid grid-cols-5 gap-4 flex">
//             <div className="col-span-4 ">
//               <InputComponent
//                 disabled
//                 flex
//                 title={CostCenterLang.Country[languageId]}
//                 className="mb-4"
//                 value={selectedCostCenter.cntryName}
//               />
//             </div>
//             <div className="col-span-1">
//               <InputComponent
//                 disabled
//                 className="mb-4"
//                 value={selectedCostCenter.cntryIdCode}
//               />
//             </div>
//           </div>
//           <InputComponent
//             disabled
//             flex
//             title={CostCenterLang.Governorate[languageId]}
//             className="mb-4"
//             value={selectedCostCenter.cntrySubentity}
//           />

//           <div className="flex gap-4">
//             <InputComponent
//               disabled
//               flex
//               type="number"
//               value={selectedCostCenter.postalCode}
//               title={CostCenterLang.PostalCode[languageId]}
//             />

//             <InputComponent
//               flex
//               disabled
//               value={selectedCostCenter.buildNo}
//               title={CostCenterLang.buildingNumber[languageId]}
//               type="number"
//             />
//           </div>

//           <InputComponent
//             flex
//             disabled
//             title={CostCenterLang.city[languageId]}
//             className="mb-4"
//             value={selectedCostCenter.cityName}
//           />
//           <InputComponent
//             flex
//             disabled
//             title={CostCenterLang.neighborhood[languageId]}
//             className="mb-4"
//             value={selectedCostCenter.citySubDivsion}
//           />
//           <InputComponent
//             flex
//             disabled
//             title={CostCenterLang.PlotID[languageId]}
//             className="mb-4"
//             value={selectedCostCenter.plotId}
//           />
//           <InputComponent
//             flex
//             disabled
//             title={CostCenterLang.commercialRegister[languageId]}
//             className="mb-4"
//             value={selectedCostCenter.crNo}
//           />
//           <InputComponent
//             flex
//             disabled
//             title={CostCenterLang.streetName[languageId]}
//             className="mb-4"
//             value={selectedCostCenter.streetname}
//           />
//           <InputComponent
//             flex
//             disabled
//             title={CostCenterLang.ExtraStreet[languageId]}
//             className="mb-4"
//             value={selectedCostCenter.addStreetname}
//           />
//         </>
//       ) : (
//         <p className="text-textPrimary text-base font-bold">
//           {CostCenterLang.SelelctCostCenterDetails[languageId]}
//         </p>
//       )}
//     </>
//   );
// }
