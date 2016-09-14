export default
`RM {
  Model = name AttributeList? Contained<Schema*>
  Schema = name AttributeList? Contained<Table*>

  Table = name AttributeList? Dependency*

  AttributeList = Contained<ListOf<Attribute, ",">>
  Dependency = arity? dependency_glyph arity? PrimaryKeyOrUnique? Reference Optional? RoundContained<ReferenceName>?

  Attribute = RegularAttribute
             | Dependency

  RegularAttribute = PrimaryKeyOrUnique? name Optional? Type? Constraint?
  DependencyAttribute = arity? dependency_glyph? arity? PrimaryKeyOrUnique? Reference Optional? RoundContained<ReferenceName>?

  PrimaryKeyOrUnique = PrimaryKey
                     | Unique
  PrimaryKey = "@"
  Unique = "!"
  Optional = "?"

  Type = List
       | Set

  List = SquareContained<ListOf<Value, ",">>
  Set = Contained<ListOf<Value, ",">>
  Value = digit+
        | CContained<"'", name, "'">

  Constraint = Operator Check
  Operator = ">"
           | "<"
           | ">="
           | "<="
           | "=="
           | "<>"
           | "!="
  Check = CheckName
        | CheckNumber

  CheckName = name
  CheckNumber = number

  Reference = SchemaTableName
            | TableName

  ReferenceName = name

  SchemaTableName = name "." name
  TableName = name

  Contained<element> = CContained<"{", element, "}">
  SquareContained<element> = CContained<"[", element, "]">
  RoundContained<element> = CContained<"(", element, ")">

  CContained<open, element, close> = open element close

  name = first_character additional_character*
  first_character = letter | "_"
  additional_character = first_character | alnum

  arity = "*" | "+" | number
  dependency_glyph = "->"

  number = digit+
}

RM_PGSQL <: RM {
  Type := List
        | Set
        | SQLType

  SQLType = "bigint"
          | "smallint"
          | "integer"
          | "real"
          | "double precision"
          | "smallserial"
          | "serial"
          | "bigserial"
          | "money"
          | "blob"
          | "bytea"
          | "boolean"
          | "text"
          | "timestamp"
          | "date"
          | "time"
          | "interval"
          | "point"
          | "line"
          | "lseq"
          | "box"
          | "path"
          | "polygon"
          | "circle"
          | "cidr"
          | "inet"
          | "macaddr"
          | "json"
          | "jsonb"
          | "int4range"
          | "int8range"
          | "numrange"
          | "tsrange"
          | "tstzrange"
          | "daterange"
          | Numeric
          | VarChar

  Numeric = numeric RoundContained<NumericParameters>?
  NumericParameters = Precision OptionalScale?
  Precision = number
  OptionalScale = "," number

  numeric = "numeric" | "decimal"

  VarChar = "varchar" RoundContained<number>?
}`;