'use strict';

var _api2 = require('../api');

var delimiter = '^',
    quote = '~';
// [model, result, sql, import] = ["model", "result", "sql", "import"].map(n => document.getElementBy)

var samples = {
  'example': 'database_name {\n  schema_name {\n    table_name {\n      @primaryKey,\n      attribute\n    } -> foreign_table\n\n    foreign_table {\n      @primaryKey,\n      attribute? boolean\n    }\n  }\n}',
  'experiments': 'experiments { @id, inserted_at timestamp } {\n  binary {\n    coin_flip {\n      outcome { \'H\', \'T\' }\n    }\n  }\n\n  cats_on_pants {\n    cat { name }\n    cat_position { position { \'pants1\', \'pants2\', \'both\', \'neither\' } } -> cat\n  }\n}',
  'accounting': 'dist {@id, inserted_at timestamp} {\n  accounts {\n    account {key}\n    account_feature -> account -> features.feature\n  }\n\n  features {\n    feature {description} -> feature (parent_feature)\n    feature_cost {cost numeric} -> feature\n    feature_schedule {global_unlock_value numeric} -> feature\n    feature_progress {contributed_value numeric} -> feature\n  }\n\n  transactions {\n    transaction -> accounts.account\n    transaction_detail {amount numeric} -> transaction\n    transaction_account_feature -> accounts.account_feature -> transaction_detail\n  }\n}',
  'company': 'company {@id, inserted_at timestamp} {\n  personnel {\n    employee {name}\n\n    employee_engagement {start timestamp, end? timestamp > start, salary money} -> employee\n  }\n\n  payroll {\n    payment {amount money}\n\n    employee_payment {occurred timestamp} -> personnel.employee_engagement -> payment\n  }\n\n  operations {\n    task {name, description} -> task? (parent_task)\n\n    task_assignment {ended? timestamp} -> !task -> !personnel.employee\n    task_update {update text} -> task_assignment\n  }\n}',
  'usda_sr28': 'usda {\n sr28 {\n  FOOD_DES {\n    @NDB_No text,\n  ->FD_GROUP (FdGrp_Cd),\n    Long_Desc,\n    Short_Desc,\n    ComName?,\n    ManufacName?,\n    Survey?,\n    Ref_desc?,\n    Refuse?,\n    SciName?,\n    N_Factor?,\n    Pro_Factor?,\n    Fat_Factor?,\n    CHO_Factor?\n  }\n\n  FD_GROUP {\n    @FdGrp_Cd text,\n    FdGrp_Desc\n  }\n\n  LANGUAL {\n    @NDB_No text,\n    @Factor_Code text\n  }\n\n  LANGDESC {\n    @Factor_Code text,\n    Description\n  }\n\n  NUT_DATA {\n    @NDB_No text,\n    @Nutr_No text,\n    Nutr_Val numeric(10,3),\n    Num_Data_Pts? numeric(5),\n    Std_Error? numeric(8,3),\n  ->SRC_CD (Src_Cd),\n  ->DERIV_CD? (Deriv_Cd),\n    Ref_NDB_No?,\n    Add_Nutr_Mark?,\n    Num_Studies? numeric,\n    Min? numeric(10,3),\n    Max? numeric(10,3),\n    DF? numeric(4),\n    Low_EB? numeric(10,3),\n    Up_EB? numeric(10,3),\n    Stat_cmt?,\n    AddMod_Date?,\n    CC?\n  }\n\n  NUTR_DEF {\n    @Nutr_No text,\n    Units,\n    Tagname?,\n    NutrDesc,\n    Num_Dec,\n    SR_Order numeric(6)\n  }\n\n  SRC_CD {\n    @Src_Cd text,\n    SrcCd_Desc\n  }\n\n  DERIV_CD {\n    @Deriv_Cd text,\n    Deriv_Desc\n  }\n\n  WEIGHT {\n    @NDB_No text,\n    @Seq text,\n    Amount numeric,\n    Msre_Desc,\n    Gm_Wgt numeric(7,1),\n    Num_Data_Pts? numeric(4),\n    Std_Dev? numeric(7,3)\n  }\n\n  FOOTNOTE {\n    NDB_No,\n    Footnt_No,\n    Footnt_Typ,\n    Nutr_No?,\n    Footnt_Txt\n  }\n\n  DATSRCLN {\n    @NDB_No text,\n    @Nutr_No text,\n  ->@DATA_SRC (DataSrc_ID)\n  }\n\n  DATA_SRC {\n    @DataSrc_ID text,\n    Authors?,\n    Title,\n    Year?,\n    Journal?,\n    Vol_City?,\n    Issue_State?,\n    Start_Page?,\n    End_Page?\n  }\n }\n}'
};

document.addEventListener('DOMContentLoaded', function () {
  var modelArea = document.getElementsByTagName('modelarea')[0],
      modelAreaSelect = modelArea.getElementsByTagName('select')[0],
      modelAreaTextArea = modelArea.getElementsByTagName('textarea')[0],
      errorArea = modelArea.getElementsByTagName('errorarea')[0],
      resultArea = document.getElementsByTagName('resultarea')[0],
      sqlArea = document.getElementsByTagName('sqlarea')[0],
      sqlAreaSelect = sqlArea.getElementsByTagName('select')[0],
      sqlAreaTextArea = sqlArea.getElementsByTagName('textarea')[0],
      importArea = document.getElementsByTagName('importarea')[0],
      importAreaSelect = importArea.getElementsByTagName('select')[0],
      importAreaTextArea = importArea.getElementsByTagName('textarea')[0];

  var currentEngine = sqlAreaSelect.options[sqlAreaSelect.selectedIndex].value,
      importMethod = importAreaSelect.options[importAreaSelect.selectedIndex].value;

  modelAreaTextArea.addEventListener('keyup', function (_ref) {
    var target = _ref.target;
    return a(target.value);
  });

  modelAreaSelect.selectedIndex = 0;
  modelAreaTextArea.value = samples[modelAreaSelect.options[modelAreaSelect.selectedIndex].value];

  modelAreaSelect.addEventListener('change', function () {
    modelAreaTextArea.value = samples[modelAreaSelect.options[modelAreaSelect.selectedIndex].value];
    a(modelAreaTextArea.value);
  });

  sqlAreaSelect.addEventListener('change', function () {
    currentEngine = sqlAreaSelect.options[sqlAreaSelect.selectedIndex].value;
    a(modelAreaTextArea.value);
  });
  importArea.addEventListener('change', function () {
    importMethod = importAreaSelect.options[importAreaSelect.selectedIndex].value;
    a(modelAreaTextArea.value);
  });

  a(modelAreaTextArea.value);

  function a(value) {
    try {
      var _api = (0, _api2.api)(value, currentEngine, delimiter, quote, importMethod);

      var schema = _api.schema;
      var imports = _api.imports;


      sqlAreaTextArea.value = schema.join('\n') + '\n';
      importAreaTextArea.value = imports.join('\n') + '\n';
      errorArea.classList.remove('has-error');
    } catch (e) {
      console.log('error!', { e: e });
      if (e instanceof _api2.GrammarError) {
        var match = e.match;

        errorArea.classList.add('has-error');
        errorArea.innerHTML = match.message;
      } else if (e instanceof _api2.SemanticError) {
        errorArea.classList.add('has-error');
        errorArea.innerHTML = e.message;
      } else {
        errorArea.classList.add('has-error');
        errorArea.innerHTML = e.stack;
      }
    }
  }
});

function processModel(engine, model) {
  return (0, _api2.api)(model, currentEngine, delimiter, quote);
}
