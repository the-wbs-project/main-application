using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace Wbs.Api.DataServices;

public abstract class BaseDbService
{
    protected readonly IConfiguration config;

    public BaseDbService(IConfiguration config)
    {
        this.config = config;
    }

    protected string cs { get { return config["DbConnection"]; } }

    public SqlConnection CreateConnection() => new SqlConnection(cs);

    protected DateTimeOffset? DbDate(SqlDataReader reader, string column) => reader.IsDBNull(column) ? (DateTimeOffset?)null : reader.GetDateTime(column);

    protected T DbValue<T>(SqlDataReader reader, string column) => reader.IsDBNull(column) ? default(T) : reader.GetFieldValue<T>(column);

    protected T DbValue<T>(SqlDataReader reader, int index) => reader.IsDBNull(index) ? default(T) : reader.GetFieldValue<T>(index);

    protected T DbJson<T>(SqlDataReader reader, string column) => reader.IsDBNull(column) ? default(T) : JsonSerializer.Deserialize<T>(reader.GetString(column));

    protected T DbJson<T>(SqlDataReader reader, int index) => reader.IsDBNull(index) ? default(T) : JsonSerializer.Deserialize<T>(reader.GetString(index));

    protected object DbValue(object obj) => obj == null ? DBNull.Value : obj;

    protected object DbJson(object obj) => obj == null ? (object)DBNull.Value : JsonSerializer.Serialize(obj);
}