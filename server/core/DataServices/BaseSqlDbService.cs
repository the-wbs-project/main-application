using Microsoft.Data.SqlClient;

namespace Wbs.Core.DataServices;

public abstract class BaseSqlDbService
{
    protected DateTimeOffset? DbDate(SqlDataReader reader, string column) => SqlHelpers.DbDate(reader, column);

    protected T DbValue<T>(SqlDataReader reader, string column) => SqlHelpers.DbValue<T>(reader, column);

    protected T DbValue<T>(SqlDataReader reader, int index) => SqlHelpers.DbValue<T>(reader, index);

    protected T DbJson<T>(SqlDataReader reader, string column) => SqlHelpers.DbJson<T>(reader, column);

    protected T DbJson<T>(SqlDataReader reader, int index) => SqlHelpers.DbJson<T>(reader, index);

    protected object DbValue(object obj) => SqlHelpers.DbValue(obj);

    protected object DbJson(object obj) => SqlHelpers.DbJson(obj);
}