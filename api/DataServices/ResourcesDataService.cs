using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Wbs.Api.Configuration;

namespace Wbs.Api.DataServices;

public class ResourcesDataService
{
    private readonly ILogger<ResourcesDataService> _logger;
    private readonly AppConfig config;

    public ResourcesDataService(ILogger<ResourcesDataService> logger, AppConfig config)
    {
        _logger = logger;
        this.config = config;
    }

    public async Task<List<string>> GetCategoriesAsync()
    {
        using (var conn = new SqlConnection(config.sqlConnectionString))
        {
            await conn.OpenAsync();

            return await GetCategoriesAsync(conn);
        }
    }

    public async Task<List<string>> GetCategoriesAsync(SqlConnection conn)
    {
        var results = new List<string>();

        var cmd = new SqlCommand("SELECT DISTINCT [Section] FROM [dbo].[Resources] WHERE [Section] NOT LIKE 'Dashboard%' AND [Section] NOT LIKE 'Tab%' ORDER BY [Section]", conn);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read()) results.Add(reader.GetString(0));
        }
        return results;
    }

    public async Task<Dictionary<string, Dictionary<string, string>>> GetAllAsync(string locale)
    {
        using (var conn = new SqlConnection(config.sqlConnectionString))
        {
            await conn.OpenAsync();

            return await GetAllAsync(conn, locale);
        }
    }

    public async Task<Dictionary<string, Dictionary<string, string>>> GetAllAsync(SqlConnection conn, string locale)
    {
        var results = new Dictionary<string, Dictionary<string, string>>();

        var cmd = new SqlCommand("SELECT [Section], [Name], [Value] FROM [dbo].[Resources] WHERE [Locale] = @Locale", conn);
        cmd.Parameters.AddWithValue("@Locale", locale);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
            {
                var cat = reader.GetString(0);
                var name = reader.GetString(1);
                var text = reader.GetString(2);

                if (!results.ContainsKey(cat)) results.Add(cat, new Dictionary<string, string>());

                results[cat].Add(name, text);
            }
        }
        return results;
    }

    public async Task<Dictionary<string, string>> GetBySectionAsync(string locale, string section)
    {
        using (var conn = new SqlConnection(config.sqlConnectionString))
        {
            await conn.OpenAsync();

            return await GetBySectionAsync(conn, locale, section);
        }
    }

    public async Task<Dictionary<string, string>> GetBySectionAsync(SqlConnection conn, string locale, string section)
    {
        var results = new Dictionary<string, string>();

        var cmd = new SqlCommand("SELECT [Name],[Value] FROM [dbo].[Resources] WHERE [Locale] = @Locale AND [Section] = @Section", conn);
        cmd.Parameters.AddWithValue("@Locale", locale);
        cmd.Parameters.AddWithValue("@Section", section);

        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (reader.Read())
            {
                var name = reader.GetString(0);
                var text = reader.GetString(1);

                results.Add(name, text);
            }
        }
        return results;
    }

    public async Task SetAsync(string locale, string section, Dictionary<string, string> values)
    {
        using (var conn = new SqlConnection(config.sqlConnectionString))
        {
            await conn.OpenAsync();
            await SetAsync(conn, locale, section, values);
        }
    }

    public async Task SetAsync(SqlConnection conn, string locale, string section, Dictionary<string, string> values)
    {
        var cmd = new SqlCommand("dbo.Resources_Set", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Locale", locale);
        cmd.Parameters.AddWithValue("@Section", section);
        cmd.Parameters.AddWithValue("@JsonValues", values == null ? "{}" : JsonSerializer.Serialize(values));

        await cmd.ExecuteNonQueryAsync();
    }
}
