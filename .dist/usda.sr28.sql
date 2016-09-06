CREATE DATABASE "usda";
\c "usda"
CREATE SCHEMA "sr28";
CREATE TABLE sr28.DATA_SRC (DataSrc_ID text, Authors text, Title text NOT NULL, Year text, Journal text, Vol_City text, Issue_State text, Start_Page text, End_Page text, PRIMARY KEY (DataSrc_ID));
CREATE TABLE sr28.DATSRCLN (NDB_No text, Nutr_No text, DATA_SRC_DataSrc_ID text REFERENCES sr28.DATA_SRC, PRIMARY KEY (NDB_No,Nutr_No,DATA_SRC_DataSrc_ID));
CREATE TABLE sr28.FOOTNOTE (NDB_No text NOT NULL, Footnt_No text NOT NULL, Footnt_Typ text NOT NULL, Nutr_No text, Footnt_Txt text NOT NULL);
CREATE TABLE sr28.WEIGHT (NDB_No text, Seq text, Amount NUMERIC NOT NULL, Msre_Desc text NOT NULL, Gm_Wgt NUMERIC(7,1) NOT NULL, Num_Data_Pts NUMERIC(4), Std_Dev NUMERIC(7,3), PRIMARY KEY (NDB_No,Seq));
CREATE TABLE sr28.DERIV_CD (Deriv_Cd text, Deriv_Desc text NOT NULL, PRIMARY KEY (Deriv_Cd));
CREATE TABLE sr28.SRC_CD (Src_Cd text, SrcCd_Desc text NOT NULL, PRIMARY KEY (Src_Cd));
CREATE TABLE sr28.NUT_DATA (NDB_No text, Nutr_No text, Nutr_Val NUMERIC(10,3) NOT NULL, Num_Data_Pts NUMERIC(5), Std_Error NUMERIC(8,3), Ref_NDB_No text, Add_Nutr_Mark text, Num_Studies NUMERIC, Min NUMERIC(10,3), Max NUMERIC(10,3), DF NUMERIC(4), Low_EB NUMERIC(10,3), Up_EB NUMERIC(10,3), Stat_cmt text, AddMod_Date text, CC text, SRC_CD_Src_Cd text REFERENCES sr28.SRC_CD, DERIV_CD_Deriv_Cd text REFERENCES sr28.DERIV_CD, PRIMARY KEY (NDB_No,Nutr_No));
CREATE TABLE sr28.NUTR_DEF (Nutr_No text, Units text NOT NULL, Tagname text, NutrDesc text NOT NULL, Num_Dec text NOT NULL, SR_Order NUMERIC(6) NOT NULL, PRIMARY KEY (Nutr_No));
CREATE TABLE sr28.LANGDESC (Factor_Code text, Description text NOT NULL, PRIMARY KEY (Factor_Code));
CREATE TABLE sr28.LANGUAL (NDB_No text, Factor_Code text, PRIMARY KEY (NDB_No,Factor_Code));
CREATE TABLE sr28.FD_GROUP (FdGrp_Cd text, FdGrp_Desc text NOT NULL, PRIMARY KEY (FdGrp_Cd));
CREATE TABLE sr28.FOOD_DES (NDB_No text, Long_Desc text NOT NULL, Short_Desc text NOT NULL, ComName text, ManufacName text, Survey text, Ref_desc text, Refuse text, SciName text, N_Factor text, Pro_Factor text, Fat_Factor text, CHO_Factor text, FD_GROUP_FdGrp_Cd text REFERENCES sr28.FD_GROUP, PRIMARY KEY (NDB_No));
