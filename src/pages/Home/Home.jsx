// import React from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import AccountForm from "../AccountFormCostCenter";
export default function Home() {

  return (
    <>
      <div className="flex-col justify-around my-auto">
        <div className="flex justify-center">
          <Stack direction="row" spacing={1.5}>
            <Button variant="contained">خروج</Button>
            <Button variant="contained">شجرة</Button>
            <Button variant="contained">طباعة</Button>
            <Button variant="contained">ترحيل</Button>
            <Button variant="contained">حفظ</Button>
            <Button variant="contained">حذف</Button>
            <Button variant="contained">تعديل</Button>
            <Button variant="contained">جديد</Button>
            <Button variant="contained">جذر</Button>
          </Stack>
        </div>
        <div className="flex grid grid-cols-12 my-5 gap-x-5" dir="rtl">
          <div className="col-span-7 bg-slate-50 p-4 rounded-sm">
            {/* <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="رقم الحساب" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="اسم الحساب عربي" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="اسم الحساب إنجليزي" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Select fullWidth defaultValue="">
                  <MenuItem value="">نوع الحساب</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6}>
                <TextField label="العنوان 1" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="العنوان 2" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="فاكس" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="هاتف" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="موبايل" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="بريد إلكتروني" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="رقم ضريبي" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="تاريخ"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid> */}
            <AccountForm />
          </div>
          <div className="col-span-5 bg-white rounded-sm">
            {" "}
            <div className="col-span-full flex items-center gap-x-6 justify-between">
              <label
                htmlFor="Txtaccno"
                className="text-sm/6 font-medium text-gray-900"
              >
                رقم الحساب
              </label>
              <input
                id="Txtaccno"
                name="Txtaccno"
                type="number"
                placeholder="Txtaccno"
                className=" min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-1 border-gray-200 border-[1px] rounded focus:outline-gray-300 sm:text-sm/6"
              />{" "}
            </div>{" "}
            <div className="" dir="ltr">

            <Box  sx={{ minHeight: 352, minWidth: 250 }}>
              <SimpleTreeView  disableSelection>
                <TreeItem  itemId="grid" label="أصول">
                  <TreeItem itemId="grid-community" label="أصول1" />
                  <TreeItem itemId="grid-pro" label="أصول2" />
                  <TreeItem itemId="grid-premium" label="أصول3" />
                </TreeItem>
                <TreeItem icon= "../../assets/images/error.svg" itemId="pickers" label="خصوم">
                  <TreeItem itemId="pickers-community" label="خصوم1" />
                  <TreeItem itemId="pickers-pro" label="خصوم2" />
                </TreeItem>
                <TreeItem itemId="charts" label="ايرادات">
                  <TreeItem itemId="charts-community" label="ايرادات1" />
                </TreeItem>
                <TreeItem itemId="tree-view" label="مصروفات">
                  <TreeItem itemId="tree-view-community" label="مصروفات1" />
                </TreeItem>
              </SimpleTreeView>
            </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
