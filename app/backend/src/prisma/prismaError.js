export function convertPrismaError(code) {
  switch (code) {
    case "P2002": // Unique constraint failed on the field: {field_name}
      return 409;
    case "P2003": // Foreign key constraint failed on the field: {field_name}
      return 409;
    case "P2025": // An operation failed because it depends on one or more records that were required but not found. {cause
      return 404;
    default: // Error Code not mapped
      return 500;
  }
}
