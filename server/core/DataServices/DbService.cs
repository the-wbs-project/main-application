using Microsoft.Data.SqlClient;
using Wbs.Core.Configuration;

namespace Wbs.Core.DataServices;

public class DbService
{
    protected readonly IDatabaseConfig config;

    public DbService(IDatabaseConfig config)
    {
        this.config = config;
    }

    public async Task<SqlConnection> CreateConnectionAsync()
    {
        var conn = new SqlConnection(config.SqlConnectionString);

        await conn.OpenAsync();

        return conn;
    }
}