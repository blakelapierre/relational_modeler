CREATE DATABASE "usda";
\c "usda"
CREATE SCHEMA "sr28";
CREATE TABLE sr28.DATA_SRC (DataSrc_ID text, Authors text, Title text NOT NULL, Year text, Journal text, Vol_City text, Issue_State text, Start_Page text, End_Page text, PRIMARY KEY (DataSrc_ID));
CREATE TABLE sr28.DATSRCLN (NDB_No bigserial, Nutr_No bigserial, DATA_SRC_DataSrc_ID text NOT NULL REFERENCES sr28.DATA_SRC, PRIMARY KEY (NDB_No,Nutr_No));
CREATE TABLE sr28.FOOTNOTE (NDB_No text NOT NULL, Footnt_No text NOT NULL, Footnt_Typ text NOT NULL, Nutr_No text NOT NULL, Footnt_Txt text NOT NULL);
CREATE TABLE sr28.WEIGHT (NDB_No bigserial, Seq bigserial, Amount NUMERIC(5,3) NOT NULL, Msre_Desc text NOT NULL, Gm_Wgt NUMERIC(7,1) NOT NULL, Num_Data_Pts NUMERIC(3) NOT NULL, Std_Dev NUMERIC(7,3) NOT NULL, PRIMARY KEY (NDB_No,Seq));
CREATE TABLE sr28.SRC_CD (Src_Cd VARCHAR(2), SrcCd_Desc text NOT NULL, PRIMARY KEY (Src_Cd));
CREATE TABLE sr28.NUT_DATA (NDB_No bigserial, Nutr_No bigserial, Nutr_Val NUMERIC(10,3) NOT NULL, Num_Data_Pts NUMERIC(5) NOT NULL, Std_Error NUMERIC(8,3) NOT NULL, Ref_NDB_No text NOT NULL, Add_Nutr_Mark text NOT NULL, Num_Studies NUMERIC(2) NOT NULL, Min NUMERIC(10,3) NOT NULL, Max NUMERIC(10,3) NOT NULL, DF NUMERIC(4) NOT NULL, Low_EB NUMERIC(10,3) NOT NULL, UpEB NUMERIC(10,3) NOT NULL, Stat_cmt text NOT NULL, AddMod_Date text NOT NULL, CC text NOT NULL, SRC_CD_Src_Cd VarChar NOT NULL REFERENCES sr28.SRC_CD, PRIMARY KEY (NDB_No,Nutr_No));
CREATE TABLE sr28.NUTR_DEF (Nutr_No bigserial, Units text NOT NULL, Tagname text NOT NULL, NutrDesc text NOT NULL, Num_Dec text NOT NULL, SR_Order NUMERIC(6) NOT NULL, PRIMARY KEY (Nutr_No));
CREATE TABLE sr28.DERV_CD (Deriv_Cd bigserial, Deriv_Desc text NOT NULL, PRIMARY KEY (Deriv_Cd));
CREATE TABLE sr28.LANGUAL (NDB_No text NOT NULL, Factor_Code bigserial, PRIMARY KEY (Factor_Code));
CREATE TABLE sr28.LANGDESC (Description text NOT NULL, LANGUAL_Factor_Code bigserial NOT NULL REFERENCES sr28.LANGUAL);
CREATE TABLE sr28.FD_GROUP (FdGrp_Cd bigserial, FdGrp_Desc text NOT NULL, PRIMARY KEY (FdGrp_Cd));
CREATE TABLE sr28.FOOD_DES (NDB_No bigserial, Long_Desc text NOT NULL, Short_Desc text NOT NULL, ComName text NOT NULL, ManufacName text NOT NULL, Survey text NOT NULL, Ref_desc text NOT NULL, SciName text NOT NULL, N_Factor text NOT NULL, Pro_Factor text NOT NULL, Fat_Factor text NOT NULL, CHO_Factor text NOT NULL, FD_GROUP_FdGrp_Cd bigserial NOT NULL REFERENCES sr28.FD_GROUP, PRIMARY KEY (NDB_No));
