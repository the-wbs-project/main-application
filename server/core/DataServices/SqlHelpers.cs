using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace Wbs.Core.DataServices;

public class SqlHelpers
{
    public static DateTimeOffset? DbDate(SqlDataReader reader, string column) => reader.IsDBNull(column) ? (DateTimeOffset?)null : reader.GetDateTime(column);

    public static T DbValue<T>(SqlDataReader reader, string column) => reader.IsDBNull(column) ? default : reader.GetFieldValue<T>(column);

    public static T DbValue<T>(SqlDataReader reader, int index) => reader.IsDBNull(index) ? default : reader.GetFieldValue<T>(index);

    public static T DbJson<T>(SqlDataReader reader, string column) => reader.IsDBNull(column) ? default : JsonSerializer.Deserialize<T>(reader.GetString(column));

    public static T DbJson<T>(SqlDataReader reader, int index) => reader.IsDBNull(index) ? default : JsonSerializer.Deserialize<T>(reader.GetString(index));

    public static object DbValue(object obj) => obj == null ? DBNull.Value : obj;

    public static object DbJson(object obj) => obj == null ? (object)DBNull.Value : JsonSerializer.Serialize(obj);
}